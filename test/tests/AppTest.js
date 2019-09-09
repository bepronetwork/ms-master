import {
    registerApp,
    loginAdmin,
    getApp,
    getAppSummary,
    deployPlatformContract,
    addBlockchainInformation,
    addAppServices,
    registerAdmin,
    getAppBiggestBetWinners,
    getAppBiggestUserWinners,
    updateAppWallet,
    authAdmin,
    loginUser,
    registerUser,
    depositUser,
    getEcosystemCasinoGames,
    updateUserWallet,
    editTableLimit,
    placeBet,
    getGames,
    getAppAuth,
    getAppLastBets,
    addGame,
    getAppPopularNumbers,
    editGameEdge
} from '../methods';

import faker from 'faker';
import chai from 'chai';
const delay = require('delay');
import models from '../models';

import { getNonce } from '../lib';
import { detectValidationErrors } from './utils';
import { getRandom } from '../utils/math';
import Random from '../tools/Random';
import Numbers from '../logic/services/numbers';

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

context('App Testing', async () =>  {
    var ADMIN_ID, APP_ID, BEARER_TOKEN, PLATFORM_TOKEN_ADDRESS, PLATFORM_BLOCKCHAIN, PLATFORM_ADDRESS,ADMIN_BEARER_TOKEN, TOTAL_APP_LIQUIDITY_DEX,
        TRANSACTION_TOKEN_TRANSFER_HASH, GAMES, USER_ID, USER_ADDRESS, USER_BEARER_TOKEN, ECOSYSTEM_GAMES, CASINO_CONTRACT;
    var userPostData;
    it('🍳(setup)🍳', mochaAsync(async () => {
        await (async () => {

            const calls = {
                createAdmin : async () => {
                    await registerAdmin(BOILERPLATES.admins.NORMAL_REGISTER_3);
                    return;
                },
                loginAdmin : async () => {
                    var response_admin = await loginAdmin(BOILERPLATES.admins.NORMAL_REGISTER_3);
                    ADMIN_ID = response_admin.data.message.id;
                    ADMIN_BEARER_TOKEN = response_admin.data.message.bearerToken;
                    return;
                }
            }
            try{
                await runSetup(calls);
                return expect(true).to.equal(true);      
            }catch(err){
                console.log("Error")
            }
        })()
    }));

    context('App Creation', async () => {
        it('should create the App', mochaAsync(async () => {
            let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID));
            var response = await registerApp(app_call_model);
            APP_ID = response.data.message.id;

            userPostData = genData(faker, models.users.normal_register(global.userAccount.getAddress(), APP_ID, {
                username : 'TestUser1' + Random(123123,234523452345234)
            }));
            let response_user_register = await registerUser(userPostData);
            USER_ID = response_user_register.data.message._id;

            let res_user_login =  await loginUser(userPostData);
            USER_ADDRESS = res_user_login.data.message.address;

            expect(response.data.status).to.equal(200);
        }));
        
        it('should get new Bearer Token ', mochaAsync(async () => {
            let res = await authAdmin({
                admin : ADMIN_ID
            }, ADMIN_BEARER_TOKEN, { id : ADMIN_ID});
            expect(res.data.status).to.equal(200);
            BEARER_TOKEN = res.data.message.app.bearerToken;
            expect(res.data.message.app).to.have.property('bearerToken');
        })); 
    
        it('should Get App Data Auth', mochaAsync(async () => {
            let get_app_model = models.apps.get_app(APP_ID);
            let res = await getAppAuth(get_app_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('should Get App Data', mochaAsync(async () => {
            let get_app_model = models.apps.get_app(APP_ID);
            let res = await getApp(get_app_model);
            expect(res.data.status).to.equal(200);
        })); 


        it('should Integrate Services into App', mochaAsync(async () => {
            let service_call_add_model = models.apps.add_services(APP_ID, [101, 201]);
            let res = await addAppServices(service_call_add_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('ETH - should Deploy the Platform Smart Contract & Provide Liquidity', mochaAsync(async () => {
            let tokenAmountWithDecimals = Numbers.toSmartContractDecimals(CONST.tokenTransferAmount, CONST.decimals)
            
            let res_deploy = await deployPlatformContract({
                tokenAddress : CONST.erc20Address, 
                tokenAmount : tokenAmountWithDecimals, 
                maxDeposit : CONST.maxDeposit, 
                maxWithdrawal : CONST.maxWithdrawal, 
                decimals : CONST.decimals,
                authorizedAddress : global.managerAccount
            });

            CASINO_CONTRACT = res_deploy.casinoContract;
            PLATFORM_TOKEN_ADDRESS =  res_deploy.platformTokenAddress;
            PLATFORM_BLOCKCHAIN = res_deploy.platformBlockchain;
            PLATFORM_ADDRESS =  res_deploy.platformAddress;
            TRANSACTION_TOKEN_TRANSFER_HASH = res_deploy.transactionHash;
            expect(res_deploy).to.not.equal(false);
        })); 



        it('should add blockchain Information to App', mochaAsync(async () => {
            let add_blockchain_info_model = models.apps.add_blockchain_information(APP_ID, {
                platformAddress : PLATFORM_ADDRESS,
                decimals : CONST.decimals,
                currencyTicker : CONST.currencyTicker,
                authorizedAddress : global.managerAccount,
                address         : CONST.ownerAccount.getAddress(),
                platformTokenAddress : PLATFORM_TOKEN_ADDRESS,
                platformBlockchain : PLATFORM_BLOCKCHAIN
            });
            let res = await addBlockchainInformation(add_blockchain_info_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 


        it('should´nt update wallet with pending transaction', mochaAsync(async () => {
            let transferTokenAmount = 1;
            /* Create Deposit App Transaction - Tokens Sent with not wrong token amount */ 
            let transactionHash = await new Promise( async  (resolve, reject) => {
                try{
                    await CASINO_CONTRACT.sendTokensToCasinoContract(Numbers.toSmartContractDecimals(transferTokenAmount, CONST.decimals), {gasPrice : 1, gas : 23192}, async ({transactionHash}) => {
                        resolve(transactionHash);
                    });
                }catch(err){reject(err)}
            })
            let wallet_update_app_model = models.apps.update_wallet(APP_ID, transferTokenAmount, transactionHash);
            let res = await updateAppWallet(wallet_update_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            expect(res.data.status).to.equal(10);
        })); 

        it('should update Wallet with verified transaction', mochaAsync(async () => {
            let wallet_update_app_model = models.apps.update_wallet(APP_ID, CONST.tokenTransferAmount, TRANSACTION_TOKEN_TRANSFER_HASH);
            let res = await updateAppWallet(wallet_update_app_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

       
    });

    context('Game Integration - European Roulette', async () => {

        it('should get All Ecosystem Games', mochaAsync(async () => {
            let res = await getEcosystemCasinoGames();
            detectValidationErrors(res);
            ECOSYSTEM_GAMES = res.data.message;
            expect(res.data.status).to.equal(200);
        })); 

        it('should add ecosystem game', mochaAsync(async () => {
            var GAME = ECOSYSTEM_GAMES.find( game => game.metaName == 'european_roulette_simple');

            let get_app_model = {
                game : GAME._id,
                app : APP_ID
            }
            let res = await addGame(get_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            expect(res.data.status).to.equal(200);
        })); 

        it('should get All App Games', mochaAsync(async () => {
            let get_app_model = models.apps.get_app(APP_ID);
            let res = await getGames(get_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            GAMES = res.data.message;
            expect(res.data.status).to.equal(200);
        })); 

        it('should change game Table Limit', mochaAsync(async () => {
            var GAME = GAMES.find( game => game.metaName == 'european_roulette_simple');

            let postData = {
                app : APP_ID,
                game : GAME._id,
                tableLimit : 30
            }
            let res = await editTableLimit(postData, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('should change game Edge', mochaAsync(async () => {
            var GAME = GAMES.find( game => game.metaName == 'european_roulette_simple');

            let postData = {
                app : APP_ID,
                game : GAME._id,
                edge : 3
            }
            let res = await editGameEdge(postData, BEARER_TOKEN, {id : APP_ID});
            let get_app_model = models.apps.get_app(APP_ID);
            let games_res = await getGames(get_app_model, BEARER_TOKEN, {id : APP_ID});
            let new_edge = games_res.data.message[0].edge;
            expect(res.data.status).to.equal(200);
            expect(new_edge).to.equal(postData.edge);
        })); 

    });


    context('Game Integration - CoinFlip Simple', async () => {

        it('should get All Ecosystem Games', mochaAsync(async () => {
            let res = await getEcosystemCasinoGames();
            detectValidationErrors(res);
            ECOSYSTEM_GAMES = res.data.message;
            expect(res.data.status).to.equal(200);
        })); 
        
        it('should add ecosystem game', mochaAsync(async () => {
            var GAME = ECOSYSTEM_GAMES.find( game => game.metaName == 'coinflip_simple');

            let get_app_model = {
                game : GAME._id,
                app : APP_ID
            }
            let res = await addGame(get_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            expect(res.data.status).to.equal(200);
        })); 

        it('should get All App Games', mochaAsync(async () => {
            let get_app_model = models.apps.get_app(APP_ID);
            let res = await getGames(get_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            GAMES = res.data.message;
            expect(res.data.status).to.equal(200);
        })); 

        it('should change game Table Limit', mochaAsync(async () => {
            var GAME = GAMES.find( game => game.metaName == 'coinflip_simple');

            let postData = {
                app : APP_ID,
                game : GAME._id,
                tableLimit : 30
            }
            let res = await editTableLimit(postData, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('should change game Edge', mochaAsync(async () => {
            var GAME = GAMES.find( game => game.metaName == 'coinflip_simple');

            let postData = {
                app : APP_ID,
                game : GAME._id,
                edge : 3
            }
            let res = await editGameEdge(postData, BEARER_TOKEN, {id : APP_ID});
            let get_app_model = models.apps.get_app(APP_ID);
            let games_res = await getGames(get_app_model, BEARER_TOKEN, {id : APP_ID});
            let new_edge = games_res.data.message[0].edge;
            expect(res.data.status).to.equal(200);
            expect(new_edge).to.equal(postData.edge);
        })); 

    });

    context('Game Integration - Linear Dice Simple', async () => {

        it('should get All Ecosystem Games', mochaAsync(async () => {
            let res = await getEcosystemCasinoGames();
            detectValidationErrors(res);
            ECOSYSTEM_GAMES = res.data.message;
            expect(res.data.status).to.equal(200);
        })); 

        it('should add ecosystem game', mochaAsync(async () => {
            var GAME = ECOSYSTEM_GAMES.find( game => game.metaName == 'linear_dice_simple');

            let get_app_model = {
                game : GAME._id,
                app : APP_ID
            }
            let res = await addGame(get_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            expect(res.data.status).to.equal(200);
        })); 

        it('should get All App Games', mochaAsync(async () => {
            let get_app_model = models.apps.get_app(APP_ID);
            let res = await getGames(get_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            GAMES = res.data.message;
            expect(res.data.status).to.equal(200);
        })); 

        it('should change game Table Limit', mochaAsync(async () => {
            var GAME = GAMES.find( game => game.metaName == 'linear_dice_simple');

            let postData = {
                app : APP_ID,
                game : GAME._id,
                tableLimit : 30
            }
            let res = await editTableLimit(postData, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        }));
        
        it('should change game Edge', mochaAsync(async () => {
            var GAME = GAMES.find( game => game.metaName == 'linear_dice_simple');

            let postData = {
                app : APP_ID,
                game : GAME._id,
                edge : 3
            }
            let res = await editGameEdge(postData, BEARER_TOKEN, {id : APP_ID});
            let get_app_model = models.apps.get_app(APP_ID);
            let games_res = await getGames(get_app_model, BEARER_TOKEN, {id : APP_ID});
            let new_edge = games_res.data.message[0].edge;
            expect(res.data.status).to.equal(200);
            expect(new_edge).to.equal(postData.edge);
        })); 
    });


    context('User Integration - User 1', async () => {

        it('should get All App Games', mochaAsync(async () => {
            let get_app_model = models.apps.get_app(APP_ID);
            let res = await getGames(get_app_model, BEARER_TOKEN, {id : APP_ID});
            detectValidationErrors(res);
            GAMES = res.data.message;
            expect(res.data.status).to.equal(200);
        })); 

        context('Deposit', async () => {

            it('should allow deposit for the User', mochaAsync(async () => {

                let res_user_login =  await loginUser(userPostData);
                USER_BEARER_TOKEN = res_user_login.data.message.bearerToken;
                USER_ID = res_user_login.data.message.id;

                const USER_DEPOSIT_AMOUNT = CONST.user.DEPOSIT_AMOUNT;
                const NONCE = getNonce();

                let resEthereum = await depositUser({
                    amount : USER_DEPOSIT_AMOUNT,
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
                expect(res.data.status).to.equal(200);

            }));
        });

        context('Bets - Roulette', async () => {


            it('should allow bet for the User - Game Roulette -> Simple Bet', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'european_roulette_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);

                let create_bet_model = { 
                    game: GAME._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123, 2384723),
                    result: [{
                        place: 0, value: BET_VALUE
                    }]
                }
                
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));


            it('should allow bet for the User - Game Roulette -> Double Bet', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'european_roulette_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);

                let create_bet_model = { 
                    game: GAME._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123, 2384723),
                    result: [{
                        place: 0, value: BET_VALUE/3,
                        place: 4, value: BET_VALUE/2,

                    }]
                }

                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));
        });

        context('Bets - CoinFlip', async () => {

            it('should allow bet for the User - Game CoinFlip -> Simple Bet', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'coinflip_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);

                let create_bet_model = { 
                    game: GAME._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123,2384723),
                    result: [{
                        place: 0, value: BET_VALUE
                    }]
                }
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));


            it('should allow bet for the User - Game CoinFlip -> Simple Bet', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'coinflip_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);


                let create_bet_model = { 
                    game: GAME._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123,2384723),
                    result: [{
                        place: 1, value: BET_VALUE
                    }]
                }
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));

        });

        context('Bets - Linear Dice', async () => {

            it('should allow bet for the User - Game Linear Dice -> Simple Bet (Continue Betting)', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'linear_dice_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);
    
                let create_bet_model = { 
                    game: GAME ._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123,2384723),
                    result: [{
                        place: 0, value: BET_VALUE
                    }]
                }
    
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));
    
            it('should allow bet for the User - Game Linear Dice -> 3 Places Consecutive // Same Value', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'linear_dice_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);
    
    
                let create_bet_model = { 
                    game: GAME ._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123,2384723),
                    result: [{
                        place: 0, value: BET_VALUE,
                        place: 1, value: BET_VALUE,
                        place: 2, value: BET_VALUE
                    }]
                }
    
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));
    
            it('should allow bet for the User - Game Linear Dice -> 2 Places Limit // Same Value', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'linear_dice_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);
    
    
                let create_bet_model = { 
                    game: GAME ._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123,2384723),
                    result: [{
                        place: 0, value: BET_VALUE,
                        place: 99, value: BET_VALUE
                    }]
                }
    
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));
    
            it('should allow bet for the User - Game Linear Dice -> 3 Places Not Consecutive // Same Value', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'linear_dice_simple');
    
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);
    
                let create_bet_model = { 
                    game: GAME ._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123,2384723),
                    result: [{
                        place: 0, value: BET_VALUE,
                        place: 10, value: BET_VALUE,
                        place: 45, value: BET_VALUE
                    }]
                }
    
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(200);
                expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
            }));
        });

        context('Bets - Errors', async () => {
                
            it('should change game Table Limit', mochaAsync(async () => {
                var GAME = GAMES.find( game => game.metaName == 'coinflip_simple');

                let postData = {
                    app : APP_ID,
                    game : GAME._id,
                    tableLimit : 0.03
                }
                let res = await editTableLimit(postData, BEARER_TOKEN, {id : APP_ID});
                expect(res.data.status).to.equal(200);
            })); 

            it('shouldn´t allow Bet - Limit Table Passed', mochaAsync(async () => {
                const BET_VALUE = CONST.user.BET_AMOUNT;
                var GAME = GAMES.find( game => game.metaName == 'coinflip_simple');
                let { USER_BALANCE, USER_BEARER_TOKEN, USER_ID } = await getUserAuth(userPostData);
    
                let create_bet_model = { 
                    game: GAME ._id,
                    user: USER_ID,
                    app: APP_ID,
                    nonce: getRandom(123,2384723),
                    result: [{
                        place: 0, value: BET_VALUE
                    }]
                }
    
                var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
                detectValidationErrors(res);
                expect(res.data.status).to.equal(29);
            }));
        })
    });
    
    context('GET - Forbiden Access (no Bearer Token)', mochaAsync( async () => {

        it('GET App DATA - should forbid the access', mochaAsync(async () => {
            let get_app_model = models.apps.get_app(APP_ID);
            let res = await getAppAuth(get_app_model);
            expect(res.data.status).to.equal(304);
        })); 


        it('GET USERS DATA - should forbid the access', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'USERS', 'weekly');
            let res = await getAppSummary(users_call_model);
            expect(res.data.status).to.equal(304);
        })); 

        it('GET REVENUE DATA - should forbid the access ', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'REVENUE', 'weekly');
            let res = await getAppSummary(users_call_model);
            expect(res.data.status).to.equal(304);
        })); 

        it('GET GAMES DATA - should forbid the access ', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'GAMES', 'weekly');
            let res = await getAppSummary(users_call_model);
            expect(res.data.status).to.equal(304);
        })); 

        it('GET BEST DATA - should forbid the access ', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'BETS', 'weekly');
            let res = await getAppSummary(users_call_model);
            expect(res.data.status).to.equal(304);
        })); 

        it('GET WALLET DATA - should forbid the access ', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'WALLET');
            let res = await getAppSummary(users_call_model);
            expect(res.data.status).to.equal(304);
        })); 

    }));


    context('GET - App Data', mochaAsync( async () => {
        it('GET last Bets - should allow', mochaAsync(async () => {
            let postData = {
                app : APP_ID,
                size : 30
            };
            let res = await getAppLastBets(postData);
            expect(res.data.status).to.equal(200);
        }));

        it('GET Biggest Bet Winners - should allow', mochaAsync(async () => {
            let postData = {
                app : APP_ID,
                size : 30
            };
            let res = await getAppBiggestBetWinners(postData);
            expect(res.data.status).to.equal(200);
        }))

        it('GET Biggest User Winners - should allow', mochaAsync(async () => {
            let postData = {
                app : APP_ID,
                size : 30
            };
            let res = await getAppBiggestUserWinners(postData);
            expect(res.data.status).to.equal(200);
        }))

        it('GET Popular Numbers - should allow', mochaAsync(async () => {
            let postData = {
                app : APP_ID
            };
            let res = await getAppPopularNumbers(postData);
            expect(res.data.status).to.equal(200);
        }))
                
        it('GET USERS DATA - should allow', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'USERS', 'weekly');
            let res = await getAppSummary(users_call_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('GET REVENUE DATA - should allow', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'REVENUE');
            let res = await getAppSummary(users_call_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('GET GAMES DATA - should allow', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'GAMES', 'weekly');
            let res = await getAppSummary(users_call_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('GET BEST DATA - should allow', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'BETS', 'weekly');
            let res = await getAppSummary(users_call_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        })); 

        it('GET WALLET DATA - should allow', mochaAsync(async () => {
            let users_call_model = models.apps.get_summary(APP_ID, 'WALLET', 'weekly');
            let res = await getAppSummary(users_call_model, BEARER_TOKEN, {id : APP_ID});
            expect(res.data.status).to.equal(200);
        }));

        /* 
        it('All Data', mochaAsync(async () => {
            console.log("\nApp ID : " + APP_ID);
            console.log("Admin ID : " + ADMIN_ID);
            console.log("Platform Owner : " + CONST.ownerAccount.getAddress());
            console.log("Platform Address : " + PLATFORM_ADDRESS);
            console.log("Token Address : " + PLATFORM_TOKEN_ADDRESS);
        }));
        */
    }));   
});


async function digestBetResult({user, res, previousBalance}){
    const { winAmount, betAmount, fee, isWon, outcomeResultSpace, result, delta} = res.data.message;
    let { USER_BALANCE } = await getUserAuth(user);

    if(isWon){
        // Confirm delta is positive
        expect(delta).to.be.greaterThan(0);
        // Confirm Win Amount is Positive
        expect(winAmount).to.be.greaterThan(0);
        // Confirm Win Amount equals BetAmount*odd - edge
        expect(Numbers.toFloat((betAmount*(1/parseFloat(parseFloat(outcomeResultSpace.probability).toFixed(4)))) - fee)).to.be.equal(Numbers.toFloat(winAmount));
        // Confirm New User Balance is equal to previous plus delta
        expect(USER_BALANCE).to.be.equal(Numbers.toFloat(previousBalance+delta));
    }else{
        // Confirm delta is negative
        expect(delta).to.be.lessThan(0);
        // Confirm Win Amount is 0
        expect(winAmount).to.be.equal(0);
        // Confirm New User Balance is equal to previous plus delta
        expect(USER_BALANCE).to.be.equal(Numbers.toFloat(previousBalance+delta));
    }
    return true;
}

async function getUserAuth({username, password, app}){
    let res = await loginUser({username, password, app});
    detectValidationErrors(res);
    let USER_BEARER_TOKEN = res.data.message.bearerToken;
    let USER_ID = res.data.message.id;
    let USER_ADDRESS = res.data.message.address;
    let WITHDRAWS = res.data.message.withdraws;
    let USER_BALANCE = Numbers.toFloat(res.data.message.wallet.playBalance);
    return { USER_ID, USER_BEARER_TOKEN, USER_BALANCE, USER_ADDRESS, WITHDRAWS };
}

async function getWithdrawAmount({casinoContract, address, decimals}){
    return await casinoContract.getApprovedWithdrawAmount({address, decimals});
} 

async function getAllContractLiquidity({casinoContract}){
    return await casinoContract.getTotalLiquidity();
} 
