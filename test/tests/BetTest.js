import {
    registerUser,
    registerApp,
    loginAdmin,
    getGames,
    loginUser,
    registerAdmin,
    placeBet,
    addAppServices
} from '../methods';

import faker from 'faker';
import chai from 'chai';
import models from '../models';
import { create_bet } from '../models/bets';
import { detectValidationErrors } from '../utils';
import { getRandom } from '../utils/math';
import {saveOutputTest} from '../outputTest/configOutput';
import { 
    shoudntBeAbleToBetLacksPayload,
    shoudntBeAbleToBetLacksBearerToken,
    shouldntBeAbleToBetInsufficientLiquidity,
    shouldntBeAbleToBetBadGame,
    shouldntBeAbleToBetBadUser,
    shouldntBeAbleToBetBadApp,
    shouldntBeAbleToBetEmptyResult,
    shouldntBeAbleToBetZeroValue,
    shouldntBeAbleToBetNegativeValue
} from './output/BetTestMethod';

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

context('Bet Testing', async () =>  {
    var ADMIN_ID, USER_ID, APP_ID, userPostData, USER_ADDRESS, GAMES, BEARER_TOKEN , USER_BEARER_TOKEN;

    it('🍳(setup)🍳', mochaAsync(async () => {

        await (async () => {

            const calls = {
                loginAdmin : async () => {
                    var res = await loginAdmin(BOILERPLATES.admins.NORMAL_REGISTER_3);
                    ADMIN_ID = res.data.message.id;
                    BEARER_TOKEN = res.data.message.app.bearerToken;
                    APP_ID = res.data.message.app.id;
                    return;
                },
                registerUser : async () => {
                    userPostData = genData(faker, models.users.normal_register('0x345634563456345', APP_ID));
                    let response = await registerUser(userPostData);
                    USER_ID = response.data.message._id;
                    return;
                },
                loginUser : async () => {
                    let res =  await loginUser(userPostData);
                    USER_ADDRESS = res.data.message.address;
                    USER_BEARER_TOKEN = res.data.message.bearerToken;
                },
                getGames : async () => {
                    try{
                        let get_app_model = models.apps.get_app(APP_ID);
                        let res = await getGames(get_app_model, null, {id : APP_ID});
                        GAMES = res.data.message;
                        return;
                    }catch(err){
                        console.log(err)
                    }
                },
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
    
    context('POST - Forbidden', async () => {
        it('shoudn´t be able to bet - lacks payload', mochaAsync(async () => {
            let create_bet_model = create_bet({
                user_id : USER_ID, app_id : APP_ID, 
                game : GAMES[0], betAmount : 10, 
                user_address : USER_ADDRESS
            })
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN);
            detectValidationErrors(res);
            saveOutputTest("BetTest","shoudntBeAbleToBetLacksPayload",res.data);
            shoudntBeAbleToBetLacksPayload(res.data, expect);
        }));

        it('shoudn´t be able to bet - lacks Bearer Token', mochaAsync(async () => {
            let create_bet_model = create_bet({
                user_id : USER_ID, app_id : APP_ID, 
                game : GAMES[0], betAmount : 10, 
                user_address : USER_ADDRESS
            })
            var res = await placeBet(create_bet_model, null, {user : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shoudntBeAbleToBetLacksBearerToken",res.data);
            shoudntBeAbleToBetLacksBearerToken(res.data, expect);
        }));
    });
    
    context('POST - Errors', async () => {
        it('shouldn´t be able to bet - insufficient liquidity', mochaAsync(async () => {
            let create_bet_model = create_bet({
                user_id : USER_ID, app_id : APP_ID, 
                game : GAMES[0], betAmount : 10, 
                user_address : USER_ADDRESS
            })
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shouldntBeAbleToBetInsufficientLiquidity",res.data);
            shouldntBeAbleToBetInsufficientLiquidity(res.data, expect);
        }));

        it('shouldn´t be able to bet - bad game', mochaAsync(async () => {
            let create_bet_model = { 
                game: 'sdfsgsdfg',
                user: USER_ID,
                app: APP_ID,
                nonce: getRandom(123,2384723),
                result: [{
                    place: 0, value: 0.01
                }]
            }
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shouldntBeAbleToBetBadGame",res.data);
            shouldntBeAbleToBetBadGame(res.data, expect);
        }));

        it('shouldn´t be able to bet - bad user', mochaAsync(async () => {
            let create_bet_model = { 
                game: GAMES[0]._id,
                user: 'wgergwerg',
                app: APP_ID,
                nonce: getRandom(123,2384723),
                result: [{
                    place: 0, value: 0.01
                }]
            }
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shouldntBeAbleToBetBadUser",res.data);
            shouldntBeAbleToBetBadUser(res.data, expect);
        }));

        it('shouldn´t be able to bet - bad app', mochaAsync(async () => {
            let create_bet_model = { 
                game: GAMES[0]._id,
                user: USER_ID,
                app: '45334',
                nonce: getRandom(123, 2384723),
                result: [{
                    place: 0, value: 0.01
                }]
            }
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shouldntBeAbleToBetBadApp",res.data);
            shouldntBeAbleToBetBadApp(res.data, expect);
        }));

        it('shouldn´t be able to bet - empty result', mochaAsync(async () => {
            let create_bet_model = { 
                game: GAMES[0]._id,
                user: USER_ID,
                app: APP_ID,
                nonce: getRandom(123,2384723),
                result: []
            }
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shouldntBeAbleToBetEmptyResult",res.data);
            shouldntBeAbleToBetEmptyResult(res.data, expect);
        }));

        it('shouldn´t be able to bet - Zero Value', mochaAsync(async () => {
            let create_bet_model = { 
                game: GAMES[0]._id,
                user: USER_ID,
                app: APP_ID,
                nonce: getRandom(123,2384723),
                result: [{
                    place: 0, value: 0
                }]
            }
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shouldntBeAbleToBetZeroValue",res.data);
            shouldntBeAbleToBetZeroValue(res.data, expect);
        }));

        it('shouldn´t be able to bet - Negative Value', mochaAsync(async () => {
            let create_bet_model = { 
                game: GAMES[0]._id,
                user: USER_ID,
                app: APP_ID,
                nonce: getRandom(123,2384723),
                result: [{
                    place: 0, value: -1
                }]
            }
            var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
            detectValidationErrors(res);
            saveOutputTest("BetTest","shouldntBeAbleToBetNegativeValue",res.data);
            shouldntBeAbleToBetNegativeValue(res.data, expect);
        }));
    });
});


