import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, webhookConfirmDepositFromBitgo } from '../../../methods';
import { get_app } from '../../../models/apps';
import { globalsTest } from '../../../GlobalsTest';
import { shouldntUpdateWalletWithAlreadyPresentTransaction } from '../../output/AppTestMethod';
import Numbers from '../../../logic/services/numbers';
import { bitgoDepositExample } from './examples/bitgoDepositExample';
import { DepositRepository } from '../../../../src/db/repos';

const expect = chai.expect;
const ticker = 'ETH';

context(`${ticker}`, async () => {
    var app, currencyWallet, depositAmount, tx;

    before( async () =>  {
        app = (await getAppAuth(get_app(global.test.app.id), global.test.app.bearerToken, {id : global.test.app.id})).data.message;
        currencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        depositAmount = 0.2;
    });

    it('should update wallet with deposit (webhook)', mochaAsync(async () => {
        let body = bitgoDepositExample();
        // Remove Test Wallet Transaction Example
        await DepositRepository.prototype.deleteDepositByTransactionHash(body.webhookNotifications[0].hash)

        // User master address of app to work as the Bank Address
        let bankContract = globalsTest.getCasinoETHContract(currencyWallet.bank_address, global.ownerAccount);
        /* Create Deposit App Transaction - Tokens Sent with not wrong token amount */ 
        tx = await new Promise( async  (resolve, reject) => {
            try{
                await bankContract.sendFundsToCasinoContract(depositAmount, {gasPrice : 1, gas : 23592}, async (tx) => {
                    resolve(tx);
                });
            }catch(err){reject(err)}
        });
             
        let res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);
        const { status } = res.data;
        detectValidationErrors(res);
        expect(status).to.equal(200);
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


    it('shouldnt update Wallet with already checked tx', mochaAsync(async () => {
        let body = bitgoDepositExample();

        let res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);
        detectValidationErrors(res);
        shouldntUpdateWalletWithAlreadyPresentTransaction(res.data, expect);
    })); 
});
