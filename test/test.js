import faker from 'faker';
import Web3 from 'web3';
import models from './models';
import chai from 'chai';
import delay from 'delay';
import Mocha from 'mocha';
import account from './logic/eth/models/account';
const app = require('../src/app');
import { globalsTest } from './GlobalsTest';
import Numbers from './logic/services/numbers';

const testConfig = require('./config/config').default;
const expect = chai.expect;
global.mocha = new Mocha({});
global.server = app;
global.web3 = new Web3(new Web3.providers.HttpProvider((testConfig.eth.url)));

export const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));
export const mergeData = (object, addedFields) => Object.assign({}, object, addedFields);

var user_register = genData(faker, models.users.normal_register('0x', '5ceb15f999ba7f496d835178'));

var admin_register = genData(faker, models.admins.admin_normal_register);
var admin_register_2 = genData(faker, models.admins.admin_normal_register);
var admin_register_3 = genData(faker, models.admins.admin_normal_register);
var admin_register_4 = genData(faker, models.admins.admin_normal_register);
var admin_register_5 = genData(faker, models.admins.admin_normal_register);

/* CONST */
const OWNER_PK = testConfig.eth.keys.home;
const USER_PK = testConfig.eth.keys.user;
const MASTER_PK = testConfig.eth.keys.master;

const CONST = {
    pk : OWNER_PK,
    decimals : 18,
    user : {
        DEPOSIT_AMOUNT : 10,
        BET_AMOUNT : 0.2,
        WITHDRAW_AMOUNT : 2,
    },
    currencyTicker : 'DAI',
    maxWithdrawal : 100,
    erc20Address : testConfig.eth.erc20Address,
    maxDeposit : 100,
    tokenTransferAmount : 30,
    ownerAccount : new account(global.web3, global.web3.eth.accounts.privateKeyToAccount(OWNER_PK)),
    userAccount : new account(global.web3, global.web3.eth.accounts.privateKeyToAccount(USER_PK))
}

global.ownerAccount = CONST.ownerAccount;
global.userAccount = CONST.userAccount;
global.masterAccount =  new account(global.web3, global.web3.eth.accounts.privateKeyToAccount(MASTER_PK))

global.managerAccount = '0x22Ee8Ed6a08A7c97ECfDBFeaFF0F868f1b6fF0F4';
global.CONSTANTS = CONST;
global.test = {}
/* BOILERPLATES FOR TYPES */

var BOILERPLATES = {
    users : {
        NORMAL_REGISTER                                 : user_register,
        GENERATE_DEPOSIT_ADDRESS_BTC_EXISTING_USER      : genData(faker, mergeData(models.deposits.normal_btc_generateAddress, user_register)),
        GENERATE_DEPOSIT_ADDRESS_BTC_NEW_USER           : genData(faker, models.deposits.normal_btc_generateAddress),
    },
    admins : {
        NORMAL_REGISTER                                 : admin_register,
        NORMAL_REGISTER_2                               : admin_register_2,
        NORMAL_REGISTER_3                               : admin_register_3,
        NORMAL_REGISTER_4                               : admin_register_4,
        NORMAL_REGISTER_5                               : admin_register_5,
        NORMAL_LOGIN_USER                               : Object.assign({},{ username : admin_register.username, password : admin_register.password}),
        NORMAL_LOGIN_USER_2                             : Object.assign({},{ username : admin_register_2.username, password : admin_register_2.password}),
        NORMAL_LOGIN_USER_3                             : Object.assign({},{ username : admin_register_3.username, password : admin_register_3.password}),
        NORMAL_LOGIN_USER_4                             : Object.assign({},{ username : admin_register_4.username, password : admin_register_4.password}),
        NORMAL_LOGIN_USER_5                             : Object.assign({},{ username : admin_register_5.username, password : admin_register_5.password}),
        WRONG_PASS_LOGIN_USER                           : Object.assign({},{ username : admin_register.username, password : 'null'}),
        UNKNOWN_USER_LOGIN                              : genData(faker, models.admins.admin_unknown_login)
    }
};

global.CONST = CONST;
global.BOILERPLATES = BOILERPLATES;

var mochaAsync = (fn) => {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    };
};

const runTests = async () => {
    await ( async () => {
        /* SETUP TEST */
        context('Setup Ecosystem of the Test', async () =>  {
            it('🍳(setup)🍳', mochaAsync(async () => {
                try{    
                    
                    let USER_ETH_AMOUNT = await global.userAccount.getBalance();
                    let APP_ETH_AMOUNT = await global.ownerAccount.getBalance();
                    let MASTER_ETH_AMOUNT = await global.masterAccount.getBalance();

                    let erc20Contract = globalsTest.getERC20Contract(CONST.erc20Address)

                    let USER_TOKEN_AMOUNT = Numbers.fromDecimals(await erc20Contract.getTokenAmount(global.userAccount.getAddress()), 18);
                    let APP_TOKEN_AMOUNT =  Numbers.fromDecimals(await erc20Contract.getTokenAmount(global.ownerAccount.getAddress()), 18);
                    let MASTER_TOKEN_AMOUNT =  Numbers.fromDecimals(await erc20Contract.getTokenAmount(global.masterAccount.getAddress()), 18);

                    if(USER_ETH_AMOUNT < 0.5){
                        throw new Error(`ETH is less than 0.2 for User \nPlease recharge ETH for Address : ${global.userAccount.getAddress()}`)
                    }

                    if(APP_ETH_AMOUNT < 0.5){
                        throw new Error(`ETH is less than 0.2 for App Owner \nPlease recharge ETH for Address : ${global.ownerAccount.getAddress()}`)
                    }

                    if(MASTER_ETH_AMOUNT < 0.5){
                        throw new Error(`ETH is less than 1 for Master \nPlease recharge ETH for Address : ${global.masterAccount.getAddress()}`)
                    }

                    if(USER_TOKEN_AMOUNT < 50){
                        throw new Error(`Tokens are less than 50 for User \nPlease recharge Tokens for Address : ${global.userAccount.getAddress()}`)
                    }

                    if(APP_TOKEN_AMOUNT < 50){
                        throw new Error(`Tokens are less than 50 for User \nPlease recharge Tokens for Address : ${global.ownerAccount.getAddress()}`)
                    }

                    if(MASTER_TOKEN_AMOUNT < 50){
                        throw new Error(`Tokens are less than 50 for Master \nPlease recharge Tokens for Address : ${global.userAccount.getAddress()}`)
                    }

                    expect(true).to.equal(true);      
                    return;
                }catch(err){
                    console.log(err);
                    process.exit(1);
                }
            }))
        });
    })();
    
    mocha.addFile('./test/tests/AppTest.js');
    mocha.addFile('./test/tests/app');
    mocha.addFile('./test/tests/AffiliatesTest.js');
    mocha.addFile('./test/tests/FunctionalTest.js');
    mocha.addFile('./test/tests/EcosystemTest.js');
    mocha.addFile('./test/tests/AdminTest.js');
    mocha.addFile('./test/tests/BetTest.js');
    mocha.addFile('./test/tests/userTest');
    // mocha.addFile('./test/tests/UserTest.js');
    
    mocha
    .timeout(1000*60*1000)
    .run()
    .on('fail', function(test, err) {
        console.log(err);
        console.log('Test fail');
        process.exit(1);
    })
    .on('end', function() {
        console.log('All done');
        process.exit(0)
    });
};

const test = async () => {
    describe('BetProtocol-API', async () => {
        before(done => {
            describe('tests', async () => {
                // Wait for all Connection on App to bet set
                await delay(5*1000);
                await runTests();
                done()
            })
        })
        it('tests', () => {
        });
    });
}

/* Run Tests */
(process.env.ENV == 'production') ?  process.exit(0) : test();