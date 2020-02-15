import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, webhookConfirmDepositFromBitgo, setAppMaxDeposit } from '../../../methods';
import { get_app } from '../../../models/apps';
import { globalsTest } from '../../../GlobalsTest';
import { shouldntUpdateWalletWithAlreadyPresentTransaction, shouldntUpdateWalletWithMaxDepositOverflow } from '../../output/AppTestMethod';
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
        await DepositRepository.prototype.deleteDepositByTransactionHash(body.hash)

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

    it('shouldnt update Wallet with already checked tx', mochaAsync(async () => {
        let body = bitgoDepositExample();

        let res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);
        detectValidationErrors(res);
        shouldntUpdateWalletWithAlreadyPresentTransaction(res.data, expect);
    }));

    it('should amount > max deposit APP', mochaAsync(async () => {

        let dataMaxDeposit = await setAppMaxDeposit({
            app: app.id,
            wallet_id: currencyWallet._id,
            amount: 0.1,
        }, app.bearerToken, {id : app.id});

        let body = bitgoDepositExample();
        // Remove Test Wallet Transaction Example
        await DepositRepository.prototype.deleteDepositByTransactionHash(body.hash)

        // User master address of app to work as the Bank Address
        let bankContract = globalsTest.getCasinoETHContract(currencyWallet.bank_address, global.ownerAccount);
        /* Create Deposit App Transaction - Tokens Sent with not wrong token amount */ 
        tx = await new Promise( async  (resolve, reject) => {
            try{
                await bankContract.sendFundsToCasinoContract(depositAmount, {gasPrice : 1, gas : 23593}, async (tx) => {
                    resolve(tx);
                });
            }catch(err){reject(err)}
        });

        let res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);
        const { status } = res.data;
        await setAppMaxDeposit({
            app: app.id,
            wallet_id: currencyWallet._id,
            amount: 0.4,
        }, app.bearerToken, {id : app.id});
        expect(status).to.not.be.null;
        expect(status).to.equal(200);
        shouldntUpdateWalletWithMaxDepositOverflow(res.data, expect);
        expect(dataMaxDeposit.data.status).to.be.equal(200);
        expect(dataMaxDeposit.data.status).to.not.be.null;
        detectValidationErrors(res);
    }));

});
