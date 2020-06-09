import {
    getUserAuth,
    placeBet,
    authAdmin,
    editTableLimit,
    getAppAuth,
    editEdgeJackpot,
    editAddonTxFee
} from '../../../methods';

import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getRandom } from '../../../utils/math';
import { digestBetBonusResult } from '../../../utils/bet';
import WalletsRepository from '../../../../src/db/repos/wallet';

const expect = chai.expect;

context('After Deposit Bonus Bets (Overall Math)', async () => {
    var app, walletApp, user, admin, game, ticker = 'eth', postDataDefault, currency, userWallet, betAmount;

    const insideBetFunction = async ({ postData }) => {
        user = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
        app = (await getAppAuth({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id })).data.message;
        var userPreBetCurrencyWallet = user.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var appPreBetCurrencyWallet = app.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        var res = await placeBet(postData, user.bearerToken, { id: user.id });
        var isWon = res.data.message.isWon;
        console.log("Bet is", isWon ? "won" : "false");
        return {
            isWon, res, userPreBetCurrencyWallet, appPreBetCurrencyWallet
        }
    }

    const afterBetFunction = async ({ res, appPreBetCurrencyWallet, userPreBetCurrencyWallet }) => {
        user = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
        app = (await getAppAuth({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id })).data.message;
        const userPosBetCurrencyWallet = user.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        const appPosBetCurrencyWallet = app.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());

        detectValidationErrors(res);
        expect(res.data.status).to.equal(200);

        expect(await digestBetBonusResult({
            res: res,
            newBalance: userPosBetCurrencyWallet.playBalance,
            previousBalance: userPreBetCurrencyWallet.playBalance,
            newBalanceApp: appPosBetCurrencyWallet.playBalance,
            previousBalanceApp: appPreBetCurrencyWallet.playBalance,
            previousBonusBalance: userPreBetCurrencyWallet.bonusAmount,
            newBonusBalance: userPosBetCurrencyWallet.bonusAmount
        }), true);
    }

    const beforeBetFunction = async ({ metaName }) => {
        game = app.games.find(game => game.metaName == metaName);
        user = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
        return {
            game, user
        }
    }


    before(async () => {
        user = global.test.user
        app = global.test.app
        admin = (await authAdmin({ admin: global.test.admin.id }, global.test.admin.security.bearerToken, { id: global.test.admin.id })).data.message;
        user = (await getUserAuth({ user: user.id, app: app.id }, user.bearerToken, { id: user.id })).data.message;
        app = (await getAppAuth({ app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id })).data.message;
        currency = (app.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase())).currency;
        walletApp = (app.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
        userWallet = (user.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));

        postDataDefault = {
            user: user.id,
            app: app.id,
            currency: currency._id,
            nonce: getRandom(123, 2384723),
        }
    });

    it(`Coin Flip (Win) - User PlayBalance: 0.001; User BonusAmount: 0 and AppBalance: 0.002`, mochaAsync(async () => {
        await beforeBetFunction({
            metaName: 'coinflip_simple'
        })

        let tableLimit = {
            app: app.id,
            game: game._id,
            tableLimit: 1,
            wallet: walletApp._id
        }
        await editTableLimit({ ...tableLimit, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        await editEdgeJackpot({ edge: 0, app: app.id, admin: admin.id }, admin.security.bearerToken, { id: admin.id });
        await editAddonTxFee({ app: app.id, admin: admin.id, currency: currency._id, txFeeParams: { isTxFee: false, deposit_fee: 0, withdraw_fee: 0 } }, admin.security.bearerToken, { id: admin.id });

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.001 }
            ]
        };

        let __isWon = false, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (!__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.001, bonusAmount: 0 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));


    it(`Coin Flip (Lost) - User PlayBalance: 0.001; User BonusAmount: 0 and AppBalance: 0.002`, mochaAsync(async () => {

        await beforeBetFunction(
            { metaName: 'coinflip_simple' }
        )

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.001 }
            ]
        };

        let __isWon = true, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.001, bonusAmount: 0 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));

    it(`Coin Flip (Win) - User PlayBalance: 0.001; User BonusAmount: 0.001 and AppBalance: 0.002`, mochaAsync(async () => {

        await beforeBetFunction(
            { metaName: 'coinflip_simple' }
        )

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.002 }
            ]
        };

        let __isWon = false, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (!__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.001, bonusAmount: 0.001 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));


    it(`Coin Flip (Lost) - User PlayBalance: 0.001; User BonusAmount: 0.001 and AppBalance: 0.002`, mochaAsync(async () => {

        await beforeBetFunction(
            { metaName: 'coinflip_simple' }
        )

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.002 }
            ]
        };

        let __isWon = true, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.001, bonusAmount: 0.001 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));

    it(`Coin Flip (Win) - User PlayBalance: 0.0015; User BonusAmount: 0.0005 and AppBalance: 0.002`, mochaAsync(async () => {

        await beforeBetFunction(
            { metaName: 'coinflip_simple' }
        )

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.002 }
            ]
        };

        let __isWon = false, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (!__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.0015, bonusAmount: 0.0005 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));


    it(`Coin Flip (Win) - User PlayBalance: 0.0005; User BonusAmount: 0.0015 and AppBalance: 0.002`, mochaAsync(async () => {

        await beforeBetFunction(
            { metaName: 'coinflip_simple' }
        )

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.002 }
            ]
        };

        let __isWon = false, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.0005, bonusAmount: 0.0015 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));

    it(`Coin Flip (Lost) - User PlayBalance: 0.0015; User BonusAmount: 0.0005 and AppBalance: 0.002`, mochaAsync(async () => {

        await beforeBetFunction(
            { metaName: 'coinflip_simple' }
        )

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.002 }
            ]
        };

        let __isWon = true, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (!__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.0015, bonusAmount: 0.0005 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));


    it(`Coin Flip (Lost) - User PlayBalance: 0.0005; User BonusAmount: 0.0015 and AppBalance: 0.002`, mochaAsync(async () => {

        await beforeBetFunction(
            { metaName: 'coinflip_simple' }
        )

        let postData = {
            ...postDataDefault,
            game: game._id,
            result: [
                { place: 1, value: 0.002 }
            ]
        };

        let __isWon = true, __res;
        var __appPreBetCurrencyWallet, __userPreBetCurrencyWallet;

        while (__isWon) {
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: userWallet._id, playBalance: 0.0005, bonusAmount: 0.0015 });
            await WalletsRepository.prototype.updateBonusAndAmount({ wallet_id: walletApp._id, playBalance: 0.002, bonusAmount: 0 });
            var { isWon, res, appPreBetCurrencyWallet, userPreBetCurrencyWallet } = await insideBetFunction({
                postData
            });
            console.log("RESSS:: ", res)
            __isWon = isWon;
            __res = res;
            __appPreBetCurrencyWallet = appPreBetCurrencyWallet;
            __userPreBetCurrencyWallet = userPreBetCurrencyWallet;
        }

        await afterBetFunction({
            appPreBetCurrencyWallet: __appPreBetCurrencyWallet,
            userPreBetCurrencyWallet: __userPreBetCurrencyWallet,
            res: __res
        })
    }));
});
