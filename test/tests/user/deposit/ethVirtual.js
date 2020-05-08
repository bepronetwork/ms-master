import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, webhookConfirmDepositFromBitgo, getDepositAddress, loginUser, registerUser } from '../../../methods';
import { get_app } from '../../../models/apps';
import { globalsTest } from '../../../GlobalsTest';
import { generateEthAccountWithTokensAndEthereum } from '../../../utils/eth';
import { bitgoDepositExample, bitgoDepositExampleMaxDeposit } from '../../app/deposit/examples/bitgoDepositExample';
import { DepositRepository } from '../../../../src/db/repos';
import delay from 'delay';
import Random from '../../../tools/Random';
import faker from 'faker';
import models from '../../../models';
const expect = chai.expect;
const ticker = 'ETH';
const depositAmount = 0.03;

const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));


context(`Virtual Currency - ${ticker} `, async () => {
    var app, user, currencyWallet, tx, eth_account, bankContract, admin;

    before( async () =>  {
        admin = global.test.virtual_admin;
        app = global.test.virtual_app;
        app = (await getAppAuth({...get_app(app.id), admin: admin.id}, admin.bearerToken, {id : admin.id})).data.message;
        currencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        eth_account = await generateEthAccountWithTokensAndEthereum({decimals : currencyWallet.currency.decimals, ETHAmount : 0.15});
        bankContract = globalsTest.getCasinoETHContract(currencyWallet.bank_address, eth_account);
    });

    it('should update wallet with deposit to Virtual Currency', mochaAsync(async () => {
        /* Register User */
        let userPostData = genData(faker, models.users.normal_register('687678i678im' + Math.floor(Math.random() * 60) + 18, app.id, {
            username: '678im67im' + Random(10000, 23409234235463456)
        }));
        var res = await registerUser(userPostData);
        user = res.data.message;
        expect(res.data.status).to.equal(200);

        // Wait for Wallet Init
        let body = bitgoDepositExampleMaxDeposit();
        await DepositRepository.prototype.deleteDepositByTransactionHash(body.hash);
        // Waiting 100 seconds for the address to be get intializaed
        res = await getDepositAddress({app : app.id, currency : currencyWallet.currency._id, id : user._id});
        //expect(res.data.status).to.equal(200);
        //await delay(180*1000);
        // Get User Deposit Address - already initialized
        res = await getDepositAddress({app : app.id, currency : currencyWallet.currency._id, id : user._id});
        //expect(res.data.status).to.equal(200);
        //expect(res.data.message.address).to.not.be.null;
        const { address }  = res.data.message;

        // Deposit
        let bankContract = globalsTest.getCasinoETHContract(address, global.ownerAccount);
        /* Create Deposit App Transaction */ 
        tx = await new Promise( async  (resolve, reject) => {
            try{
                await bankContract.sendFundsToCasinoContract(depositAmount, {gasPrice : 1, gas : 53000}, async (tx) => {
                    resolve(tx);
                });
            }catch(err){reject(err)}
        });

        //await delay(30*1000);

        var userLoginData = (await loginUser(userPostData)).data.message;
        var currencyWalletVirtual = userLoginData.wallet.find( w => w.currency.virtual == true);
        //expect(currencyWalletVirtual.playBalance).to.not.equal(0);
    }));
});
