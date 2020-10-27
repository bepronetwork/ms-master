import {
    App, Wallet, User
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';
import { BitGoSingleton } from '../../logic/third-parties';
import { getNormalizedTicker } from '../../logic/third-parties/bitgo/helpers';

import { cryptoEth, cryptoBtc } from '../../logic/third-parties/cryptoFactory';
import { SearchSingleton } from '../../logic/utils/search';
import { UsersRepository } from '../../db/repos';
import { throwError } from '../../controllers/Errors/ErrorManager';

async function setMaxDeposit(req, res) {
    try{
        let params = req.body;
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
		let wallet = new Wallet(params);
        let data = await wallet.setMaxDeposit();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function getDeposit(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getDeposit();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function webhookBitgoDeposit(req, res) {
    try {
        req.body.id = req.query.id;
        req.body.currency = req.query.currency;
        let params = req.body;
        let hooks = Array.isArray(params) ? params : [params];
        let data = await Promise.all(hooks.map(async wB => {
            try {
                // Get Info from WebToken
                const wBT = await BitGoSingleton.getTransaction({ id: wB.transfer, wallet_id: wB.wallet, ticker: getNormalizedTicker({ ticker: wB.coin }) });
                if (!wBT) { return null }
                // Verify if it is App or User Deposit /Since the App deposit is to the main MultiSign no label is given to specific address, normally label = ${user_od}
                var isApp = !wBT.label;
                params.wBT = wBT;
                let app = new App(params);
                return await app.updateWallet();
            } catch (err) {
                console.log(err);
                return err;
            }
        }))
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        // MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function webhookDeposit(req, res) {
    try {
        console.log(":::Init webhook::: ", req);
        console.log(req.query);
        req.body.id = req.query.id;
        req.body.ticker = req.body.currency;
        req.body.currency = req.query.currency;
        req.body.isApp = req.query.isApp;
        let params = req.body;
        var dataTransaction = null;
        let user = null;
        let userWallet = null;
        let addressUser = null;
        switch ((req.body.ticker).toLowerCase()) {
            case 'eth':
                dataTransaction = await cryptoEth.CryptoEthSingleton.getTransaction(params.txHash);
                user            = await UsersRepository.prototype.findUserById(req.body.id, "wallet");
                console.log("user.wallet:: ", user.wallet);
                console.log("params1:: ",params );
                let tokenToWallet = (params.token_symbol == undefined ? (req.body.ticker).toLowerCase() : (params.token_symbol).toLowerCase());
                console.log("tokenToWallet ",tokenToWallet);
                userWallet      = user.wallet.find((w) => w.currency.ticker.toLowerCase() == tokenToWallet);
                addressUser     = userWallet.depositAddresses[0].address;

                if(tokenToWallet=="eth" && addressUser != dataTransaction.payload.to){
                    throwError("USER_ADDRESS_IS_NOT_VALID");
                }
                if(tokenToWallet!="eth" && !(dataTransaction.payload.token_transfers.find(w=>w.to==addressUser))){
                    throwError("USER_ADDRESS_IS_NOT_VALID");
                }
                break;
            case 'btc':
                params.txHash = params.txid;
                dataTransaction = await cryptoBtc.CryptoBtcSingleton.getTransaction(params.txHash);
                user            = await UsersRepository.prototype.findUserById(req.body.id, "wallet");
                userWallet      = user.wallet.find((w) => w.currency.ticker.toLowerCase() == "btc");
                addressUser     = userWallet.depositAddresses[0].address;
                let indexAddress = SearchSingleton.indexOfByObjectAddress(dataTransaction.payload.txouts, addressUser);
                if(indexAddress==-1) {
                    throwError("USER_ADDRESS_IS_NOT_VALID");
                }
                dataTransaction = {
                    payload: {
                        hash: dataTransaction.payload.txid,
                        status: "0x1",
                        to: dataTransaction.payload.txouts[indexAddress].addresses[0],
                        from: dataTransaction.payload.txins[0].addresses[0],
                        value: parseFloat(dataTransaction.payload.txouts[indexAddress].amount)
                    }
                }
                break;
            default:
                break;
        }
        if (!dataTransaction) { return null }
        params = { ...params, ...dataTransaction };

        let hooks = Array.isArray(params) ? params : [params];
        let data = await Promise.all(hooks.map(async wB => {
            try {
                let user = new User(params);
                return await user.updateWallet();
            } catch (err) {
                console.log(err);
                return err;
            }
        }))
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        // MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
    }
}

export {
    setMaxDeposit,
    getDeposit,
    webhookBitgoDeposit,
    webhookDeposit
}