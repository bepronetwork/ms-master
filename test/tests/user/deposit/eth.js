import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, webhookConfirmDepositFromBitgo, getDepositAddress, setAppMaxDeposit } from '../../../methods';
import { get_app } from '../../../models/apps';
import { globalsTest } from '../../../GlobalsTest';
import { generateEthAccountWithTokensAndEthereum } from '../../../utils/eth';
import { getNonce } from '../../../lib';
import { bitgoDepositExample, bitgoDepositExampleMaxDeposit } from '../../app/deposit/examples/bitgoDepositExample';
import { DepositRepository } from '../../../../src/db/repos';
import delay from 'delay';
const expect = chai.expect;
const ticker = 'ETH';
const depositAmount = 0.03;

context(`${ticker}`, async () => {
    var app, user, currencyWallet, tx, eth_account, bankContract;

    before( async () =>  {
        app = (await getAppAuth(get_app(global.test.app.id), global.test.app.bearerToken, {id : global.test.app.id})).data.message;
        user = global.test.user;
        currencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        eth_account = await generateEthAccountWithTokensAndEthereum({decimals : currencyWallet.currency.decimals, ETHAmount : 0.15});
        bankContract = globalsTest.getCasinoETHContract(currencyWallet.bank_address, eth_account);
    });


    it('should amount > max deposit', mochaAsync(async () => {
        let dataMaxDeposit = await setAppMaxDeposit({
            app: app.id,
            wallet_id: currencyWallet._id,
            amount: 0.1,
        }, app.bearerToken, {id : app.id});
        // Wait for Wallet Init
        await delay(180*1000);
        let body = bitgoDepositExampleMaxDeposit();
        await DepositRepository.prototype.deleteDepositByTransactionHash(body.hash)
        // Get User Deposit Address - create deposit address on bitgo
        var res = await getDepositAddress({app : app.id, currency : currencyWallet.currency._id, id : user.id});
        expect(res.data.status).to.equal(200);
        expect(res.data.message.address).to.be.undefined;
        // Waiting 100 seconds for the address to be get intializaed
        console.log("Waiting for 3 minutes seconds for wallet init...");
        await delay(180*1000);
        // Get User Deposit Address - already initialized
        res = await getDepositAddress({app : app.id, currency : currencyWallet.currency._id, id : user.id});
        expect(res.data.status).to.equal(200);
        expect(res.data.message.address).to.not.be.null;
        expect(res.data.status).to.equal(200);
        const { address }  = res.data.message;

        // Deposit
        let bankContract = globalsTest.getCasinoETHContract(address, global.ownerAccount);
        /* Create Deposit App Transaction - Tokens Sent with not wrong token amount */ 
        tx = await new Promise( async  (resolve, reject) => {
            try{
                await bankContract.sendFundsToCasinoContract(depositAmount, {gasPrice : 1, gas : 23592}, async (tx) => {
                    resolve(tx);
                });
            }catch(err){reject(err)}
        });
        res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);
        await setAppMaxDeposit({
            app: app.id,
            wallet_id: currencyWallet._id,
            amount: 0.4,
        }, app.bearerToken, {id : app.id});
        console.log(res.data.message);
        expect(res.data.status).to.not.be.null;
        expect(res.data.message[0].code).to.equal(51);

        expect(dataMaxDeposit.data.status).to.be.equal(200);
        expect(dataMaxDeposit.data.status).to.not.be.null;
        detectValidationErrors(res);


    }));


    it('should update wallet with deposit (webhook)', mochaAsync(async () => {
        // Wait for Wallet Init
        await delay(180*1000);
        
        let body = bitgoDepositExample();
        await DepositRepository.prototype.deleteDepositByTransactionHash(body.hash)
        // Get User Deposit Address - create deposit address on bitgo
        var res = await getDepositAddress({app : app.id, currency : currencyWallet.currency._id, id : user.id});
        expect(res.data.status).to.equal(200);
        expect(res.data.message.address).to.be.undefined;
        // Waiting 100 seconds for the address to be get intializaed
        console.log("Waiting for 3 minutes seconds for wallet init...");
        await delay(180*1000);
        // Get User Deposit Address - already initialized
        res = await getDepositAddress({app : app.id, currency : currencyWallet.currency._id, id : user.id});
        expect(res.data.status).to.equal(200);
        expect(res.data.message.address).to.not.be.null;
        expect(res.data.status).to.equal(200);
        const { address }  = res.data.message;

        // Deposit
        let bankContract = globalsTest.getCasinoETHContract(address, global.ownerAccount);
        /* Create Deposit App Transaction - Tokens Sent with not wrong token amount */ 
        tx = await new Promise( async  (resolve, reject) => {
            try{
                await bankContract.sendFundsToCasinoContract(depositAmount, {gasPrice : 1, gas : 23592}, async (tx) => {
                    resolve(tx);
                });
            }catch(err){reject(err)}
        });

              
        res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);
        const { status } = res.data;
        detectValidationErrors(res);
        expect(status).to.equal(200);
    })); 

    it('should not allow double deposit after first confirmed', mochaAsync(async () => {
        let body = bitgoDepositExample();
        let res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);
        expect(res.data.message[0].code).to.equal(11);

    }));

    // it('should amount > max deposit', mochaAsync(async () => {

    //     let dataMaxDeposit = await setAppMaxDeposit({
    //         app: app.id,
    //         wallet_id: currencyWallet._id,
    //         amount: 0.1,
    //     }, app.bearerToken, {id : app.id});

    //     let body = bitgoDepositExample();

    //     // Deposit
    //     let res = await webhookConfirmDepositFromBitgo(body, app.id, currencyWallet.currency._id);

    //     await setAppMaxDeposit({
    //         app: app.id,
    //         wallet_id: currencyWallet._id,
    //         amount: 0.4,
    //     }, app.bearerToken, {id : app.id});

    //     expect(res.data.status).to.not.be.null;
    //     expect(res.data.message[0].code).to.equal(51);

    //     expect(dataMaxDeposit.data.status).to.be.equal(200);
    //     expect(dataMaxDeposit.data.status).to.not.be.null;
    //     detectValidationErrors(res);

    // }));

});
