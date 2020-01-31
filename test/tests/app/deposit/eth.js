import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, updateAppWallet } from '../../../methods';
import { get_app } from '../../../models/apps';
import { globalsTest } from '../../../GlobalsTest';
import { shouldntUpdateWalletWithPendingTransaction } from '../../output/AppTestMethod';
import Numbers from '../../../logic/services/numbers';

const expect = chai.expect;
const ticker = 'ETH';

context(`${ticker}`, async () => {
    var app, currencyWallet, depositAmount, tx;

    before( async () =>  {
        app = (await getAppAuth(get_app(global.test.app.id), global.test.app.bearerToken, {id : global.test.app.id})).data.message;
        currencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        depositAmount = 0.3;
    });

    it('should´nt update wallet with pending transaction', mochaAsync(async () => {
        let bankContract = globalsTest.getCasinoETHContract(currencyWallet.bank_address, global.ownerAccount);
        /* Create Deposit App Transaction - Tokens Sent with not wrong token amount */ 
        tx = await new Promise( async  (resolve, reject) => {
            try{
                await bankContract.sendFundsToCasinoContract(depositAmount, {gasPrice : 1, gas : 23592}, async (tx) => {
                    resolve(tx);
                });
            }catch(err){reject(err)}
        });

        const postData = {
            app : app.id,
            amount : depositAmount,
            transactionHash : tx,
            currency : currencyWallet.currency._id
        };

        let res = await updateAppWallet(postData, app.bearerToken, {id : app.id});
        detectValidationErrors(res);
        shouldntUpdateWalletWithPendingTransaction(res.data, expect);
    }));

    it('should amount > max deposit', mochaAsync(async () => {
        let bankContract = globalsTest.getCasinoETHContract(currencyWallet.bank_address, global.ownerAccount);

        let tx = await bankContract.sendFundsToCasinoContract(0.4);

        const postData = {
            app : app.id,
            amount : 0.4,
            transactionHash : tx.transactionHash,
            currency : currencyWallet.currency._id
        }

        let res = updateAppWallet(postData, app.bearerToken, {id : app.id});

        let ret = await Promise.resolve(await res);

        expect(ret.data.status).to.not.be.null;
        expect(ret.data.status).to.be.equal(47);
    }));


    it('should update Wallet with verified transaction', mochaAsync(async () => {
        let bankContract = globalsTest.getCasinoETHContract(currencyWallet.bank_address, global.ownerAccount);
        
        let tx = await bankContract.sendFundsToCasinoContract(depositAmount);

        const postData = {
            app : app.id,
            amount : depositAmount,
            transactionHash : tx.transactionHash,
            currency : currencyWallet.currency._id
        }

        let res = updateAppWallet(postData, app.bearerToken, {id : app.id});
        let res_replay_atack = await updateAppWallet(postData,  app.bearerToken, {id : app.id});

        let ret = await Promise.resolve(await res);
        let status_1 = ret.data.status;
        const { status } = res_replay_atack.data;

        // Confirm either one or the other tx got phroibited
        if(status_1 == 200){
            expect(status_1).to.be.equal(200);
            expect(status).to.be.equal(14);
        }else{
            expect(status_1).to.be.equal(14);
            expect(status).to.be.equal(200);
        }
        /* Verify if new wallet has that info */
        let res_app = await getAppAuth(get_app(app.id), app.bearerToken, {id : app.id});
        global.test.app = res_app.data.message;
        
        const walletCurrencyApp = global.test.app.wallet.find( c => new String(c.currency.ticker).toLowerCase() == ticker.toLowerCase());
        expect(walletCurrencyApp.playBalance).to.be.equal(parseFloat(depositAmount));
    })); 
});
