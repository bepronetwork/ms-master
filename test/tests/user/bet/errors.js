    
 

import {
    getApp
} from '../../../methods';

import chai from 'chai';
import models from '../../../models';

import {

} from '../../output/AppTestMethod';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('Errors', async () =>  {
    var admin, app;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.app;
        games = (await getGames(get_app_model, null, {id : APP_ID})).res.data.message;
    });

    it('shoudn´t be able to bet - lacks payload', mochaAsync(async () => {
        let create_bet_model = create_bet({
            user_id : USER_ID, app_id : APP_ID, 
            game : GAMES[0], betAmount : 10, 
            user_address : USER_ADDRESS
        })
        var res = await placeBet(create_bet_model, USER_BEARER_TOKEN);
        detectValidationErrors(res);
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
        shoudntBeAbleToBetLacksBearerToken(res.data, expect);
    }));


    it('shouldn´t be able to bet - insufficient liquidity', mochaAsync(async () => {
        let create_bet_model = create_bet({
            user_id : USER_ID, app_id : APP_ID, 
            game : GAMES[0], betAmount : 10, 
            user_address : USER_ADDRESS
        })
        var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
        detectValidationErrors(res);
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
        shouldntBeAbleToBetNegativeValue(res.data, expect);
    }));

});

    