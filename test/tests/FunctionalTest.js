import {
    registerApp,
    loginAdmin,
    getGames,
    depositUser,
    updateUserWallet,
    registerAdmin,
    getEcosystemCasinoGames,
    deployPlatformContract,
    addGame,
    getAppSummary,
    registerUser,
    loginUser,
    editTableLimit,
    editGameEdge,
    addBlockchainInformation,
    updateAppWallet,
 } from '../methods';

import faker from 'faker';
import chai from 'chai';
import models from '../models';
import { detectValidationErrors } from '../utils';

import { Logger } from '../../src/helpers/logger';
import { getNonce } from '../lib';
import CasinoContract from '../logic/eth/CasinoContract';
import Numbers from '../logic/services/numbers';
import { generateEthAccountWithTokensAndEthereum } from '../utils/eth';

const expect = chai.expect;

const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));


/* UTILS FUNCTIONS */ 

const runSetup = async (calls) => {
    for (const key of Object.values(calls)) { 
        await key()
    }
}

var mochaAsync = (fn) => {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    };
};

const BOILERPLATES = global.BOILERPLATES;
const CONST = global.CONST;

// Test Variables
const ADMIN_TOKEN_INITIAL_BALANCE = 50;
const ETH_OWNER_INITIAL_BALANCE = 0.15;
const ETH_USER_INITIAL_BALANCE = 0.15;
        
const TOKEN_1_USER_INITIAL_BALANCE = 5;
const TOKEN_2_USER_INITIAL_BALANCE = 5;
const TOKEN_3_USER_INITIAL_BALANCE = 5;
const TOKEN_4_USER_INITIAL_BALANCE = 5;

context('Functional Testing', async () =>  {
    var ADMIN_ID,  APP_ID, ADMIN_BEARER_TOKEN, APP_GAMES, ECOSYSTEM_GAMES , APP_BEARER_TOKEN, PLATFORM_TOKEN_ADDRESS, PLATFORM_BLOCKCHAIN, PLATFORM_ADDRESS, TRANSACTION_TOKEN_TRANSFER_HASH, eth_account_0;
    var eth_account_1, eth_account_2, eth_account_3, eth_account_4, user_1, user_2, user_3, user_4;
    var admin = genData(faker, models.admins.admin_normal_register);            

    it('🍳(setup)🍳', mochaAsync(async () => {

        await (async () => {
            const calls = {
                setup : async () => {
                    //eth_account_0 = new account(global.web3, global.web3.eth.accounts.create())
                    // Setup the Eth Accounts for each
                    eth_account_0 = await generateEthAccountWithTokensAndEthereum({tokenAddress :  CONST.erc20Address, decimals : CONST.decimals, ETHAmount : ETH_OWNER_INITIAL_BALANCE, tokenAmount : ADMIN_TOKEN_INITIAL_BALANCE});
                    Logger.info('ETH Account (0)', "SET " + eth_account_0.getAddress());
                    eth_account_1 = await generateEthAccountWithTokensAndEthereum({tokenAddress : CONST.erc20Address, decimals : CONST.decimals, ETHAmount : ETH_USER_INITIAL_BALANCE, tokenAmount : TOKEN_1_USER_INITIAL_BALANCE})
                    Logger.info('ETH Account (1)', "SET " + eth_account_1.getAddress());
                    eth_account_2 = await generateEthAccountWithTokensAndEthereum({tokenAddress : CONST.erc20Address, decimals : CONST.decimals, ETHAmount : ETH_USER_INITIAL_BALANCE, tokenAmount : TOKEN_2_USER_INITIAL_BALANCE})
                    Logger.info('ETH Account (2)', "SET " + eth_account_2.getAddress());
                    /* eth_account_3 = await generateEthAccountWithTokensAndEthereum({tokenAddress : CONST.erc20Address, decimals : CONST.decimals, ETHAmount : ETH_USER_INITIAL_BALANCE, tokenAmount : TOKEN_3_USER_INITIAL_BALANCE})
                    Logger.info('ETH Account (3)', "SET " + eth_account_3.getAddress());
                    eth_account_4 = await generateEthAccountWithTokensAndEthereum({tokenAddress : CONST.erc20Address, decimals : CONST.decimals, ETHAmount : ETH_USER_INITIAL_BALANCE, tokenAmount : TOKEN_4_USER_INITIAL_BALANCE})
                    Logger.info('ETH Account (4)', "SET " + eth_account_4.getAddress());*/
                //loginAdmin : async () => {
                    var res = await registerAdmin(admin);
                    res = await loginAdmin(admin);
                    detectValidationErrors(res)
                    ADMIN_ID = res.data.message.id;
                    ADMIN_BEARER_TOKEN = res.data.message.bearerToken;
                //createApp : async () => {
                    let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID, eth_account_0.getAddress()));
                    var response = await registerApp(app_call_model);
                    detectValidationErrors(response)
                    APP_ID = response.data.message.id;
                //setupUsers : async  () => {
                    //Setup the Four Users (Register Them
                    user_1 = genData(faker, models.users.normal_register(eth_account_1.getAddress(), APP_ID));
                    user_2 = genData(faker, models.users.normal_register(eth_account_2.getAddress(), APP_ID));
                    /*user_3 = genData(faker, models.users.normal_register(eth_account_3.getAddress(), APP_ID));
                    user_4 = genData(faker, models.users.normal_register(eth_account_4.getAddress(), APP_ID));*/
                    await registerUser(user_1);
                    await registerUser(user_2);
                    /*await registerUser(user_3);
                    await registerUser(user_4);*/

                    //loginAdmin : async () => {
                    res = await loginAdmin(admin);
                    APP_BEARER_TOKEN = res.data.message.app.bearerToken;
                    //getEcosystemGames : async () => {
                    res = await getEcosystemCasinoGames();
                    ECOSYSTEM_GAMES = res.data.message;
                    //addAllGAmes : async () => {
                    for(var i = 0; i < ECOSYSTEM_GAMES.length; i++){
                        let get_app_model = {
                            game : ECOSYSTEM_GAMES[i]._id,
                            app : APP_ID
                        }
                        let rese = await addGame(get_app_model, APP_BEARER_TOKEN, {id : APP_ID});
                        detectValidationErrors(rese);
                    }
                //deployTheApplication : async () => {
                    // Has Deposit and Withdraw Integrated
                    let tokenAmountWithDecimals = Numbers.toSmartContractDecimals(CONST.tokenTransferAmount, CONST.decimals)
                    let res_deploy = await deployPlatformContract({
                        tokenAddress : CONST.erc20Address, 
                        tokenAmount : tokenAmountWithDecimals, 
                        maxDeposit : CONST.maxDeposit, 
                        maxWithdrawal : CONST.maxWithdrawal, 
                        acc : eth_account_0,
                        decimals : CONST.decimals,
                        authorizedAddresses : [CONST.ownerAccount.getAddress()],
                        croupierAddress            : global.managerAccount,
                    });

                    PLATFORM_TOKEN_ADDRESS =  res_deploy.platformTokenAddress;
                    PLATFORM_BLOCKCHAIN = res_deploy.platformBlockchain;
                    PLATFORM_ADDRESS =  res_deploy.platformAddress;
                    TRANSACTION_TOKEN_TRANSFER_HASH = res_deploy.transactionHash;
                //addBlockchainInfo : async () => {
                    let add_blockchain_info_model = models.apps.add_blockchain_information(APP_ID, {
                        platformAddress : PLATFORM_ADDRESS,
                        decimals : CONST.decimals,
                        currencyTicker : CONST.currencyTicker,
                        authorizedAddresses : [CONST.ownerAccount.getAddress()],
                        croupierAddress            : global.managerAccount,
                        address         : eth_account_0.getAddress(),
                        platformTokenAddress : PLATFORM_TOKEN_ADDRESS,
                        platformBlockchain : PLATFORM_BLOCKCHAIN
                    });
                    await addBlockchainInformation(add_blockchain_info_model, APP_BEARER_TOKEN, {id : APP_ID});
                //updateAppWallet : async () => {
                    let wallet_update_app_model = models.apps.update_wallet(APP_ID, CONST.tokenTransferAmount, TRANSACTION_TOKEN_TRANSFER_HASH);
                    await updateAppWallet(wallet_update_app_model, APP_BEARER_TOKEN, {id : APP_ID});
                //getAllGames : async () => {
                    let get_app_model = models.apps.get_app(APP_ID);
                    res = await getGames(get_app_model, APP_BEARER_TOKEN, {id : APP_ID});
                    APP_GAMES = res.data.message;
                //changeTableLimits : async () => {
                    for(var i = 0; i < APP_GAMES.length; i++){
                        let postData = {
                            app : APP_ID,
                            game : APP_GAMES[i]._id,
                            tableLimit : 30
                        }
                        await editTableLimit(postData, APP_BEARER_TOKEN, {id : APP_ID});
                    } 
                //changeGameEdges : async () => {
                    for(var i = 0; i < APP_GAMES.length; i++){
                        let postData = {
                            app : APP_ID,
                            game : APP_GAMES[i]._id,
                            edge : 3
                        }
                        await editGameEdge(postData, APP_BEARER_TOKEN, {id : APP_ID});
                    }
                }
            }
            try{
                await runSetup(calls);
                expect(true).to.equal(true);
                return true;
            }catch(err){
                console.log(err)
                console.log("Error")
            }
        })()
    }));
    
    context('Functional Test - 1 User Flow', async () => {
        var postData;

        it('should make user deposit twice and withdrawal with no problem', mochaAsync(async () => {
            postData = {
                "USER_1" : {
                    user : user_1,
                    USER_ACCOUNT : eth_account_1, 
                    PLATFORM_ADDRESS, 
                    APP_ID, 
                    PLATFORM_TOKEN_ADDRESS
                },
                "APP" : {
                    APP_ID,
                    APP_ACCOUNT : eth_account_0,
                    APP_BEARER_TOKEN
                },
                "CASINO_CONTRACT" : new CasinoContract({
                    web3 : global.web3,
                    account : eth_account_0,
                    erc20TokenContract : PLATFORM_TOKEN_ADDRESS,
                    contractAddress: PLATFORM_ADDRESS,
                    decimals: global.CONST.decimals
                })
            }       
        }));
        


        it('should allow user deposit & verify ecosystem balances - 2 Tokens', mochaAsync(async () => {
          
           /**
             * @function Deposit
             * @param User 1
             * @param 1 Tokens 
             */

            let res = await actions.user.deposit({...postData.USER_1, USER_DEPOSIT_AMOUNT : 2});
            let balance = await actions.user.getUserBalance(postData.USER_1);
            expect(res.data.status).to.equal(200);
            let playersBalance = await actions.app.getAllPlayersBalance(postData.APP);
            balance = await actions.user.getUserBalance(postData.USER_1);
            let dexBalance = await actions.smart_contract.getWithdrawAmount({CASINO_CONTRACT : postData.CASINO_CONTRACT, address : postData.USER_1.USER_ACCOUNT.getAddress()})
            expect(balance).to.equal(2);
            expect(playersBalance).to.equal(2);
            expect(dexBalance).to.equal(0);

        }));


        it('should allow user deposit & verify ecosystem balances - 0.01', mochaAsync(async () => {
          
            /**
             * @function Deposit
             * @param User 1
             * @param 1 Tokens
             */

            let res = await actions.user.deposit({...postData.USER_1, USER_DEPOSIT_AMOUNT : 0.01});
            let balance = await actions.user.getUserBalance(postData.USER_1);
            expect(res.data.status).to.equal(200);
            let playersBalance = await actions.app.getAllPlayersBalance(postData.APP);
            balance = await actions.user.getUserBalance(postData.USER_1);
            let dexBalance = await actions.smart_contract.getWithdrawAmount({CASINO_CONTRACT : postData.CASINO_CONTRACT, address : postData.USER_1.USER_ACCOUNT.getAddress()})
            expect(dexBalance).to.equal(0);
            expect(balance).to.equal(2.01);
            expect(playersBalance).to.equal(2.01);

        }));
    });
});


const actions = {
    user : {
        deposit : async ({user, USER_DEPOSIT_AMOUNT, PLATFORM_TOKEN_ADDRESS, PLATFORM_ADDRESS, APP_ID, USER_ACCOUNT}) => {
            var { USER_BEARER_TOKEN, USER_ID, USER_ADDRESS} = await getUserAuth(user);
            const NONCE = getNonce();
            let resEthereum = await depositUser({
                amount : USER_DEPOSIT_AMOUNT,
                acc : USER_ACCOUNT,
                tokenAddress : PLATFORM_TOKEN_ADDRESS,
                platformAddress :  PLATFORM_ADDRESS,
                nonce : NONCE
            });

            let params = {
                user :  USER_ID,
                amount : USER_DEPOSIT_AMOUNT,
                app: APP_ID,
                nonce : NONCE,
                transactionHash: resEthereum.transactionHash
            }
            let res = await updateUserWallet(params, USER_BEARER_TOKEN, {id : USER_ID});
            return res;
        },
        getWithdraws : async ({user}) => {
            const { username, password, app } = user;
            let res = await loginUser({username, password, app});
            detectValidationErrors(res);
            return res.data.message.withdraws;
        },
        getUserBalance : async ({user}) => {
            const { username, password, app } = user;
            let res =  await loginUser({username, password, app});
            detectValidationErrors(res);
            return res.data.message.wallet.playBalance;
        },
        placeBet : async ({user, GAME_ID, NONCE, APP_ID}) => {
           
        }
    },
    app : {
        getAllPlayersBalance : async ({APP_ID, APP_BEARER_TOKEN}) => {
            let res = await getAppSummary(models.apps.get_summary(APP_ID, 'WALLET', 'all'), APP_BEARER_TOKEN, {id : APP_ID});
            return res.data.message.blockchain.allPlayersBalance;
        },
        getGames : async ({}) => {

        }
    },
    smart_contract : {
        getWithdrawAmount : async  ({CASINO_CONTRACT, address}) => {
            return await CASINO_CONTRACT.getApprovedWithdrawAmount({address, decimals : CONST.decimals});
        } 
    }
}
async function getUserAuth({username, password, app}){
    let res = await loginUser({username, password, app});
    detectValidationErrors(res);
    let USER_BEARER_TOKEN = res.data.message.bearerToken;
    let USER_ID = res.data.message.id;
    let USER_ADDRESS = res.data.message.address;
    let USER_BALANCE = res.data.message.wallet.playBalance;
    return { USER_ID, USER_BEARER_TOKEN, USER_BALANCE, USER_ADDRESS };
}
