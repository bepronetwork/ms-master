import {
    getUserAuth,
    editTableLimit,
    placeBet,
    authAdmin,
    getAppAuth,
    setMaxBet
} from '../../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getRandom } from '../../../utils/math';
import { digestBetResult } from '../../../utils/bet';
const expect = chai.expect;

 const currenciesBetAmount = {
    // add other currencies here
    'eth' : 0.001
}

const limitTableBetAmount = {
    // add other currencies here
    'eth' : 0.0006
}

const metaName = 'european_roulette_simple';

Object.keys(currenciesBetAmount).forEach( async key => {
    var app, walletApp, user, admin, betAmount = currenciesBetAmount[key], game, ticker = key, currency, userPreBetCurrencyWallet, appPreBetCurrencyWallet;

    const afterBetFunction = async ({res}) => {
        user = (await getUserAuth({user : user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        app = (await getAppAuth({app : app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        const userPosBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        const appPosBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);

        expect(await digestBetResult({
            edge : game.edge, 
            res : res, 
            newBalance : userPosBetCurrencyWallet.playBalance, 
            previousBalance : userPreBetCurrencyWallet.playBalance,
            newBalanceApp : appPosBetCurrencyWallet.playBalance,
            previousBalanceApp : appPreBetCurrencyWallet.playBalance
        }), true);
    }

    const beforeBetFunction = async () => {
        app = (await getAppAuth({app : app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        user = (await getUserAuth({user : global.test.user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        appPreBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
    }

    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id })).data.message;
        app = (await getAppAuth({ app : admin.app.id, admin: admin.id }, admin.security.bearerToken, { id : admin.id })).data.message;
        game = app.games.find( game => game.metaName == metaName);
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
        walletApp = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
    });

    it('it should Set Maximum Bet - European Roulette', mochaAsync(async () => {
        user = (await getUserAuth({user : global.test.user.id, app: app.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        let postData = {
            app : admin.app.id,
            game : game._id,
            maxBet : 0.2
        }
        let res = await setMaxBet({...postData, admin: admin.id}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equal(200);
    }));
  
    it(`${metaName} - ${key} - should allow bet for the User - Simple Bet (Tails)`, mochaAsync(async () => {
        await beforeBetFunction();
        
        let postData = {  
            game: game._id,
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
            result: [
                { place: 0, value: betAmount/3},
                {place: 4, value: betAmount/2}
            ]
        };

        global.test.pot = ((!global.test.pot) ? 0 : global.test.pot) + (global.test.jackpotEdge * ( (betAmount/4) + (betAmount/2) ));
        var res = await placeBet(postData, user.bearerToken, {id : user.id});
    
        await afterBetFunction({res});
    }));


    it( `${metaName} - ${key} - should allow bet for the User - Simple Bet (Heads)`, mochaAsync(async () => {
        await beforeBetFunction();


        let postData = { 
            game: game._id,
            user: user.id,
            currency : currency._id,
            app: app.id,
            nonce: getRandom(123,2384723),
            result: [{
                place: 0, value: betAmount/2
            }]
        };
        global.test.pot = ((!global.test.pot) ? 0 : global.test.pot) + (global.test.jackpotEdge * (betAmount/2));
        var res = await placeBet(postData, user.bearerToken, {id : user.id});

        await afterBetFunction({res});

    }));
    
    it(`${metaName} - ${key} - shouldn´t allow Bet - Limit Table Passed`, mochaAsync(async () => {
        user = (await getUserAuth({user : global.test.user.id, app: app.id}, global.test.user.bearerToken, {id : global.test.user.id})).data.message;
        /* 1 - Change app Table Limit */
        let postData = {
            app : app.id,
            game : game._id,
            tableLimit : limitTableBetAmount[key],
            wallet : walletApp._id
        }
        let res = await editTableLimit({...postData, admin: admin.id}, admin.security.bearerToken, {id : admin.id});
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
