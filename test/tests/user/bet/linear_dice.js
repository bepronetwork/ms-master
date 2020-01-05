
import {
    getApp
} from '../../../methods';

import chai from 'chai';
import models from '../../../models';

import {

} from '../../output/AppTestMethod';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('European Roulette', async () =>  {
    var admin, app;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.app;
    });

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
                place: 45, value: BET_VALUE,
            }]
        }

        var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);
        expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
    }));
    
});

