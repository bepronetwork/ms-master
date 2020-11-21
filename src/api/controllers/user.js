import {
    User, Jackpot, FreeCurrency
} from '../../models';
import MiddlewareSingleton from '../helpers/middleware';
import SecuritySingleton from '../helpers/security';
import PusherSingleton from '../../logic/third-parties/pusher';
import { cryptoEth, cryptoBtc } from '../../logic/third-parties/cryptoFactory';
import { SearchSingleton } from '../../logic/utils/search';
import { UsersRepository } from '../../db/repos';
import { throwError } from '../../controllers/Errors/ErrorManager';
import { LogOwlSingleton } from '../../logic/third-parties';

/**
 * Description of the function.
 *
 * @class
 * @memberof api.controllers.users.postUser
 * @requires lodash
 * @requires helpers/apiError
 * @requires helpers/swagger.generateParamsErrorObject
 * @todo Add description of UsersController
 */

async function registUser(req, res) {
    try {
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.register();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function resendEmail(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.resendEmail();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function loginUser(req, res) {
    try {
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.login();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function setPassword(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.setPassword();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function confirmEmail(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.confirmEmail();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function resetPassword(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.resetPassword();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function setUser2FA(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.set2FA();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function loginUser2FA(req, res) {
    try {
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.login2FA();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function authUser(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.auth();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getUserInfo(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let user = new User(params);
        let data = await user.getInfo();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function userGetBets(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.userGetBets();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getPotJackpot(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let jackpot = new Jackpot(params);
        let data = await jackpot.getPotJackpot();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function userSummary(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.summary();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getBets(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.getBets();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function providerToken(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.providerToken();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}
async function getDepositAddress(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.getDepositAddress();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function pusherNotificationsAuth(req, res) {
    try {
        let params = req.body;

        let data = PusherSingleton.authenticate({
            socketId: params.socket_id,
            channel: params.channel_name
        });

        res.send(data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function pingPushNotifications(req, res) {
    try {
        let params = req.body;
        let isPrivate = params.user ? true : false;

        let data = PusherSingleton.trigger({
            channel_name: isPrivate ? params.user : 'general',
            isPrivate,
            message: "Ping",
            eventType: "PING"
        });

        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err, req);
    }
}

/**
 *
 * @param {*} req
 * @param {*} res
 */

async function webhookDeposit(req, res) {
    try {
        LogOwlSingleton.pushError((new Error(`WebhookDeposit. User ID: ${req.query.id}`)), {
            admin: !req.body ? '' : req.body.admin,
            user: !req.query.id ? '' : req.query.id,
            app: !req.body.app ? '' : req.body.app,
            route: req.originalUrl
        })
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
                LogOwlSingleton.pushError(err, {
                    admin: !req.body ? '' : req.body.admin,
                    user: !req.body.user ? '' : req.body.user,
                    app: !req.body.app ? '' : req.body.app,
                    route: req.originalUrl 
                })
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

async function getAddonFreeCurrency(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let body = req.body;
        let freeCurrency = new FreeCurrency(body);
        let data = await freeCurrency.getAddonFreeCurrency();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}


export {
    webhookDeposit,
    registUser,
    loginUser,
    getUserInfo,
    userSummary,
    pusherNotificationsAuth,
    pingPushNotifications,
    getBets,
    setUser2FA,
    loginUser2FA,
    getDepositAddress,
    authUser,
    resetPassword,
    setPassword,
    confirmEmail,
    resendEmail,
    userGetBets,
    getPotJackpot,
    providerToken,
    getAddonFreeCurrency
}