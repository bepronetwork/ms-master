import {
    getUserAuth,
    placeBet,
    authAdmin,
    getAppAuth
} from '../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../utils';
import { getRandom } from '../../utils/math';
import { digestBetResult } from '../../utils/bet';

const expect = chai.expect;

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

Object.keys(currenciesBetAmount).forEach( async key => {
    var app, walletApp, user, admin, betAmount, game, ticker = key,postDataDefault, currency, bet;

    const insideBetFunction = async ({postData}) => {
        user = (await getUserAuth({user : constant.user.id, app: app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;
        app = (await getAppAuth({app : constant.app.id, admin: constant.admin.id}, constant.admin.bearerToken, {id : constant.admin.id})).data.message;
        var userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var appPreBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var res = await placeBet(postData, user.bearerToken, {id : user.id});
        var isWon = res.data.message.isWon;
        return {
            isWon, res, userPreBetCurrencyWallet, appPreBetCurrencyWallet
        }
    }

    const afterBetFunction = async ({res, appPreBetCurrencyWallet, userPreBetCurrencyWallet}) => {
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

    const beforeBetFunction = async ({metaName}) => {
        game = app.games.find( game => game.metaName == metaName);
        user = (await getUserAuth({user : constant.user.id, app: app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;
        return {
            game, user
        }
    }

    before( async () =>  {
        betAmount = 0.001;
        admin = (await authAdmin({ admin : constant.admin.id }, constant.admin.bearerToken, { id : constant.admin.id})).data.message;
        user = (await getUserAuth({user : constant.user.id, app: constant.app.id}, constant.user.bearerToken, {id : constant.user.id})).data.message;
        app = (await getAppAuth({app : constant.app.id, admin: constant.admin.id}, constant.admin.bearerToken, {id : constant.admin.id})).data.message;
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
        walletApp = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));

        postDataDefault = {
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
        }
    });

    it(`${key} - Double Bets - Wheel Classic double`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };

        await beforeBetFunction({
            metaName : 'wheel_simple'
        })
        let postData_1 = {
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };

        const res = await Promise.all([
            placeBet(postData, user.bearerToken, {id : user.id}),
            placeBet(postData_1, user.bearerToken, {id : user.id})
        ]);

        if(res[0].data.status == 200) {
            expect(res[1].data.status).to.equal(14);
        }else if(res[0].data.status == 14){
            expect(res[1].data.status).to.equal(200);
        }else{
            expect(true).to.equal(false);
        }

    }));

    it(`${key} - Double Bets - Wheel Variation double`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };

        await beforeBetFunction({
            metaName : 'wheel_variation_1'
        })
        let postData_1 = {
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };

        const res = await Promise.all([
            placeBet(postData, user.bearerToken, {id : user.id}),
            placeBet(postData_1, user.bearerToken, {id : user.id})
        ]);

        if(res[0].data.status == 200) {
            expect(res[1].data.status).to.equal(14);
        }else if(res[0].data.status == 14){
            expect(res[1].data.status).to.equal(200);
        }else{
            expect(true).to.equal(false);
        }
    }));
});