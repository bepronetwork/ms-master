import {
    getUserAuth,
    placeBet,
    authAdmin,
    loginUser,
    getAppAuth
} from '../../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getRandom } from '../../../utils/math';
import { digestBetBonusResult } from '../../../utils/bet';
import WalletsRepository from '../../../../src/db/repos/wallet';

const expect = chai.expect;

context('After Deposit Bonus sBets (Overall Math)', async () => {
    var app, walletApp, user, admin, betAmount, game, ticker = 'eth',postDataDefault, currency, bet, userWallet;

    const insideBetFunction = async ({postData}) => {
        user = (await getUserAuth({user : user.id, app: app.id}, user.bearerToken, {id : user.id})).data.message;
        app = (await getAppAuth({app : app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        var userPreBetCurrencyWallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        console.log("userPreBetCurrencyWallet:: ",userPreBetCurrencyWallet)
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

        expect(await digestBetBonusResult({
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
        user = global.test.user
        app = global.test.app
        console.log("user:: ",user)
        console.log("app:: ",app)
        betAmount = 0.000001;
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        console.log("admin:: ",admin)
        await loginUser({username : user.username, password : user.password, app : app._id}).data.message;
        user = (await getUserAuth({user : user._id, app: app._id}, user.bearerToken, {id : user._id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        currency = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
        walletApp = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
        userWallet = (user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
        console.log("userWallet:: ",userWallet)

        postDataDefault = {
            user: user.id,
            app: app.id,
            currency : currency._id,
            nonce: getRandom(123,2384723),
        }
    });
  
    it(`it should do a normal bet for the User - Coin Flip (Win)`, mochaAsync(async () => {

        // await WalletsRepository.prototype.updateBonusAndAmount({})

        await beforeBetFunction({
            metaName : 'coinflip_simple'
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

    it(`it should do a normal bet for the User - Coin Flip (Lost)`, mochaAsync(async () => {

        await beforeBetFunction({
            metaName : 'coinflip_simple'
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

});
