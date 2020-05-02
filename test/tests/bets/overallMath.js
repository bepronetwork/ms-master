import {
    getUserAuth,
    placeBet,
    authAdmin,
    getAppAuth,
    getBetInfo
} from '../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../utils';
import { getRandom } from '../../utils/math';
import { digestBetResult } from '../../utils/bet';

const expect = chai.expect;
const ethDepositAmount = 0.1;

 const currenciesBetAmount = {
    // add other currencies here
    'eth' : 0.001
}

const constant = {
    admin : {
        id : '5e49621025bc260021571580',
        bearerToken : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU0OTYyMTAyNWJjMjYwMDIxNTcxNTgwIiwidGltZSI6MTU5MTAxMjU4MDI4OSwiaWF0IjoxNTg4NDIwNTgwfQ.OHfSmvrpWdXPAYQ9zkVxBca_t8BWLeWoqoLMx_CJIJpdscCAfgXEFCxXUWDRPlS8oOg3BH6dG99j6AnAXVFq_g'
    },
    app : {
        id : '5e486f7b85e6fa0021c827d7'
    },
    user : {
        id : '5e776d2726c551002172ecd9',
        bearerToken : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU3NzZkMjcyNmM1NTEwMDIxNzJlY2Q5IiwidGltZSI6MTU4ODg4MTI0NDgyNCwiaWF0IjoxNTg2Mjg5MjQ0fQ.BlqROIKMl-NaI_57ylFAsShhH86lzTWS7zDLF6nYlOELf2yYPAB2_-brBKyrUrmUizQ9z6GgUJHWEJN1RJFQ-A'
    }
}

const ticker = 'eth';

Object.keys(currenciesBetAmount).forEach( async key => {
    var app, walletApp, user, admin, betAmount, game, ticker = key, currency, bet;

    before( async () =>  {
        betAmount = 0.001;
        admin = (await authAdmin({ admin : constant.admin.id }, constant.admin.bearerToken, { id : constant.admin.id})).data.message;
        app = (await getAppAuth({app : constant.app.id, admin: constant.admin.id}, constant.admin.bearerToken, {id : constant.admin.id})).data.message;
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
        walletApp = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
    });
  
    it(`${key} - normal bet for the User - Wheel (Win)`, mochaAsync(async () => {
        const metaName = 'wheel_simple';
        game = app.games.find( game => game.metaName == metaName);

        user = (await getUserAuth({user : constant.user.id, app: app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;

        const userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        const appPreBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        let postData = {  
            game: game._id,
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };
        let isWon = false, res;
        
        while(!isWon){
            res = await placeBet(postData, user.bearerToken, {id : user.id});
            isWon = res.data.message.isWon;
        }

        user = (await getUserAuth({user : user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        app = (await getAppAuth({app : app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        const userPosBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        const appPosBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);

        expect(await digestBetResult({
            edge : game.edge, 
            newBalance : userPosBetCurrencyWallet.playBalance, 
            res : res, 
            previousBalance : userPreBetCurrencyWallet.playBalance,
            newBalanceApp : appPosBetCurrencyWallet.playBalance,
            previousBalanceApp : appPreBetCurrencyWallet.playBalance
        }), true);
    }));

    it(`${key} - normal bet for the User - Wheel (Lost)`, mochaAsync(async () => {
        const metaName = 'wheel_simple';
        game = app.games.find( game => game.metaName == metaName);

        user = (await getUserAuth({user : constant.user.id, app: app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;

        const userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        const appPreBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        let postData = {  
            game: game._id,
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };
        let isWon = true, res;
        
        while(isWon){
            res = await placeBet(postData, user.bearerToken, {id : user.id});
            isWon = res.data.message.isWon;
        }

        user = (await getUserAuth({user : user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        app = (await getAppAuth({app : app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        const userPosBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        const appPosBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);

        expect(await digestBetResult({
            edge : game.edge, 
            newBalance : userPosBetCurrencyWallet.playBalance, 
            res : res, 
            previousBalance : userPreBetCurrencyWallet.playBalance,
            newBalanceApp : appPosBetCurrencyWallet.playBalance,
            previousBalanceApp : appPreBetCurrencyWallet.playBalance
        }), true);
    }));
});
