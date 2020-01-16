import {
    getUserAuth,
    editTableLimit,
    placeBet,
    authAdmin,
    getAppAuth
} from '../../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getRandom } from '../../../utils/math';
import { digestBetResult } from '../../../utils/bet';
const expect = chai.expect;

 const currenciesBetAmount = {
    'SAI' : 0.2,
    'eth' : 0.001
}

const limitTableBetAmount = {
    'SAI' : 0.1,
    'eth' : 0.0006
}

const metaName = 'coinflip_simple';

Object.keys(currenciesBetAmount).forEach( async key => {
    var app, user, admin, betAmount = currenciesBetAmount[key], game, ticker = key, currency;

    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id}, admin.app.bearerToken, {id : admin.app.id})).data.message;
        game = app.games.find( game => game.metaName == metaName);
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
    });

  
    it(`${metaName} - ${key} - should allow bet for the User - Simple Bet (Tails)`, mochaAsync(async () => {
        user = (await getUserAuth({user : global.test.user.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        const userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        let postData = {  
            game: game._id,
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
            result: [{
                place: 0, value: betAmount
            }]
        };
        var res = await placeBet(postData, user.bearerToken, {id : user.id});
        user = (await getUserAuth({user : user.id}, user.bearerToken, {id : user.id})).data.message;
        const userPosBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);
        expect(await digestBetResult({newBalance : userPosBetCurrencyWallet.playBalance, res : res, previousBalance : userPreBetCurrencyWallet.playBalance}), true);
    }));


    it( `${metaName} - ${key} - should allow bet for the User - Simple Bet (Heads)`, mochaAsync(async () => {
        user = (await getUserAuth({user : global.test.user.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        const userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        let postData = { 
            game: game._id,
            user: user.id,
            currency : currency._id,
            app: app.id,
            nonce: getRandom(123,2384723),
            result: [{
                place: 1, value: betAmount
            }]
        };
        var res = await placeBet(postData, user.bearerToken, {id : user.id});
        user = (await getUserAuth({user : user.id}, user.bearerToken, {id : user.id})).data.message;

        const userPosBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);
        expect(await digestBetResult({newBalance : userPosBetCurrencyWallet.playBalance, res : res, previousBalance : userPreBetCurrencyWallet.playBalance}), true);
    }));
    
    it(`${metaName} - ${key} - shouldn´t allow Bet - Limit Table Passed`, mochaAsync(async () => {
        user = (await getUserAuth({user : global.test.user.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        /* 1 - Change app Table Limit */
        let postData = {
            app : app.id,
            game : game._id,
            tableLimit : limitTableBetAmount[key]
        }
        let res = await editTableLimit(postData, app.bearerToken, {id : app.id});
        expect(res.data.status).to.equal(200);

        /* 2 - Test Bet with table limit change */
        postData = { 
            game: game._id,
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
            result: [{
                place: 0, value: betAmount
            }]
        };

        res = await placeBet(postData, user.bearerToken, {id : user.id});
        detectValidationErrors(res);
        expect(res.data.status).to.equal(29);
    }));
    
});
