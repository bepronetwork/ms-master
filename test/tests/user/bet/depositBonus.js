import {
    getUserAuth,
    placeBet,
    authAdmin,
    loginUser,
    getAppAuth
} from '../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../utils';
import { getRandom } from '../../utils/math';
import { digestBetResult } from '../../utils/bet';

const expect = chai.expect;

context('After Deposit Bonus sBets (Overall Math)', async () => {
    var app, walletApp, user, admin, betAmount, game, ticker = 'eth',postDataDefault, currency, bet;

    const insideBetFunction = async ({postData}) => {
        user = (await getUserAuth({user : user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        app = (await getAppAuth({app : app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        var userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var appPreBetCurrencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var res = await placeBet(postData, user.bearerToken, {id : user.id});
        var isWon = res.data.message.isWon;
        console.log("Bet is", isWon ? "won" : "false");
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
        user = (await getUserAuth({user : user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        return {
            game, user
        }
    }

    
    before( async () =>  {
        betAmount = 0.00001;
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        user = (await getUserAuth({user : user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
        walletApp = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));

        postDataDefault = {
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
        }
    });
  
    it(`it should do a normal bet for the User - Wheel Classic (Win)`, mochaAsync(async () => {

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

        let __isWon = false, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;
        
        while(!__isWon){
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet : __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet : __userPreBetCurrencyWallet,
            res : __res
        })
    }));

    it(`it should do a normal bet for the User - Wheel Classic (Lost)`, mochaAsync(async () => {

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

        let __isWon = true, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;
        
        while(__isWon){
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet : __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet : __userPreBetCurrencyWallet,
            res : __res
        })
    }));

    it(`it should do a normal bet for the User - Wheel Variation (Win)`, mochaAsync(async () => {

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

        let __isWon = false, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;
        
        while(!__isWon){
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet : __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet : __userPreBetCurrencyWallet,
            res : __res
        })
    }));

    it(`it should do a normal bet for the User - Plinko (Win)`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'plinko_variation_1'
        })

        let postData = {  
            ...postDataDefault,
            game: game._id,
            result: game.resultSpace.map( (r, i) => {return {
                place: i, value: betAmount/(game.resultSpace.length)
            }})
        };

        let __isWon = false, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;
        
        while(!__isWon){
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet : __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet : __userPreBetCurrencyWallet,
            res : __res
        })
    }));


});
