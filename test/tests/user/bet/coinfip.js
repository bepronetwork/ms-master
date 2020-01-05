import {
    getApp
} from '../../../methods';

import chai from 'chai';
import models from '../../../models';

import {

} from '../../output/AppTestMethod';
import { mochaAsync } from '../../../utils';

const expect = chai.expect;

context('Bet - CoinFlip', async () =>  {
    var admin, app;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.app;
    });

  
    
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

        console.log(USER_BALANCE)

        var res = await placeBet(create_bet_model, USER_BEARER_TOKEN, {id : USER_ID});
        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);
        expect(await digestBetResult({res, user : userPostData, previousBalance : USER_BALANCE}), true);
    }));
    
    it('shouldn´t allow Bet - Limit Table Passed', mochaAsync(async () => {

        var GAME = GAMES.find( game => game.metaName == 'coinflip_simple');

        let postData = {
            app : APP_ID,
            game : GAME._id,
            tableLimit : 0.03
        }
        let res = await editTableLimit(postData, BEARER_TOKEN, {id : APP_ID});
        expect(res.data.status).to.equal(200);


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
});

