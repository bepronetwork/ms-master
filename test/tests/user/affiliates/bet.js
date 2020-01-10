import { mochaAsync, getCurrencyWallet } from '../../../utils';
import { getAppAuth, authAdmin } from '../../../methods';
import chai from 'chai';
import { editAppStructure, getApp, getUserInfo, createUserDeposit } from '../../../services';
import { provideFunds } from '../../../utils/env';

const expect = chai.expect;
const ticker = 'dai';
const depositAmount = 1;
const ethDepositAmount = 1;
const betAmount = 0.03;
const metaName = 'linear_dice_simple';

const inputs = {
    structures : [{level : 1, percentageOnLoss : 0.04}, {level : 2, percentageOnLoss : 0.03}, {level : 3, percentageOnLoss : 0.02}]
}


context('Bet', async () => {
    var app, user_1, user_2, user_3, currencyWallet, currency, game, admin;


    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id}, admin.app.bearerToken, {id : admin.app.id})).data.message;
        game = app.games.find( game => game.metaName == metaName);
        currencyWallet = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
        currency = currencyWallet.currency;
    
    });

    it('it should set Bet for user and losts should be sent to parent Users (standard affiliate)', mochaAsync(async () => {
        
        await editAppStructure({app, structures : inputs.structures});
        user_1 = global.test.user_1;
        user_2 = global.test.user_2;
        user_3 = global.test.user_3;
        /* Get Info for User 1 before Bet */
        var user_1_before_info = await getUserInfo({user : user_1.message, app});
        /* Get Info for User 2 before Bet */
        var user_2_before_info = await getUserInfo({user : user_2.message, app});
        /* Get Info for User 2 before Bet */
        var user_3_before_info = await getUserInfo({user : user_3.message, app});
        
        /* Get Info for User3 before Bet */
        const user_1 = {...user_1_before_info, eth_account : user_1.eth_account};
        const user_2 = {...user_2_before_info, eth_account : user_2.eth_account};
        const user_3 = {...user_3_before_info, eth_account : user_3.eth_account};

        /* Get Info for App before Bet */
        const app_data_before = (await getApp({app})).data.message;

        /* Send Tokens to User */
        await provideFunds({account : user_3.eth_account, ethAmount : ethDepositAmount, tokenAmount : depositAmount, erc20Address : currency.address});
        /* Deposit for User */
        await createUserDeposit({user : user_3, tokenAmount : depositAmount, app : app, currency : currency, depositAddress : currencyWallet.bank_address});

        /* Get Info for User 2 before Bet */
        user_3_before_info = await getUserInfo({user : user_3.message, app});
        var wasWon = true;
        /* Creater User Bet */
        while(wasWon){
            var BET_GAME = app_data_before.games.find( game => game.metaName == 'european_roulette_simple');
            var BET_RESULT = [{
                place: 0, value: betAmount
            }];
            /* Verify that was Lost */
            var bet_res = await bet({user : user_3, game : BET_GAME, result : BET_RESULT, app});
            const { message } = bet_res.data;
            wasWon = message.isWon;
        }
        const { status } = bet_res.data;
        /* Confirm Bet was valid */
        expect(status).to.equal(200);
        /* Get Info for User 1 After Bet */
        const user_1_after_info = await getUserInfo({user : user_1.message, app});
        /* Get Info for User 2 After Bet */
        const user_2_after_info = await getUserInfo({user : user_2.message, app});
        /* Get Info for User3 After Bet */
        const user_3_after_info = await getUserInfo({user : user_3.message, app});

        /* Check that Affiliate With Structure x got his amount */
        var { percentageOnLoss : user_1_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_1_after_info.affiliateInfo._id).affiliateStructure;
        var { percentageOnLoss : user_2_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_2_after_info.affiliateInfo._id).affiliateStructure;

        /* Verify Affiliate Balance on User 1,2,3 */
        expect(getCurrencyWallet({wallet : user_1_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(betAmount*user_1_percentageOnLoss);
        expect(getCurrencyWallet({wallet : user_2_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(betAmount*user_2_percentageOnLoss);
        expect(getCurrencyWallet({wallet : user_3_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(0);

        /* Get Info for App After Bet */
        const app_data_after = (await getApp({app})).data.message;
        /* Verify balance on App */
        const affiliateReturns = betAmount*(user_2_percentageOnLoss+user_1_percentageOnLoss);
        expect(parseFloat(getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance+betAmount-affiliateReturns));
        /* Verify Balance on User 3 */
        expect(parseFloat(getCurrencyWallet({wallet : getCurrencyWallet({wallet : user_3_after_info.wallet, ticker}), ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : user_3_before_info.wallet, ticker}).playBalance-betAmount));

    }));

    it('it should set Bet for user and losts should be sent to parent Users (custom affiliate)', mochaAsync(async () => {
        /* Get Info for User 4 before Bet */
        var user_4_before_info = await getUserInfo({user : res_4.message, app});
        /* Get Info for User 5 before Bet */
        var user_5_before_info = await getUserInfo({user : res_5.message, app});
        
        /* Get Info for User3 before Bet */
        const user_4 = {...user_4_before_info, eth_account : res_4.eth_account};
        const user_5 = {...user_5_before_info, eth_account : res_5.eth_account};

        /* Get Info for App before Bet */
        const app_data_before = (await getApp({app})).data.message;

        /* Const */
        const depositAmount = 3;
        const ethDepositAmount = 0.1;
        const betAmount = 0.2;
        const BET_GAME = app_data_before.games.find( game => game.metaName == 'european_roulette_simple');
        const BET_RESULT = [{
            place: 0, value: betAmount
        }];

        /* Send Tokens to User */
        await provideFunds({account : user_5.eth_account, ethAmount : ethDepositAmount, tokenAmount : depositAmount, erc20Address : currency.address});
        /* Deposit for User */
        await createUserDeposit({user : user_5, tokenAmount : depositAmount, app : app_data_before, currency, depositAddress : currencyWallet.bank_address});

        /* Get Info for User 4 before Bet */
        user_5_before_info = await getUserInfo({user : res_5.message, app});
        
        var wasWon = true;
        var bet_res;
        /* Creater User Bet */
        while(wasWon){
            /* Verify that was Lost */
            bet_res = await bet({user : user_5, game : BET_GAME, result : BET_RESULT, app});
            const { message } = bet_res.data;
            wasWon = message.isWon;
        }

        const { status, message } = bet_res.data;
        /* Confirm Bet was valid */
        expect(status).to.equal(200);

        /* Get Info for User 4 After Bet */
        const user_4_after_info = await getUserInfo({user : res_4.message, app});
        /* Get Info for User 5 After Bet */
        const user_5_after_info = await getUserInfo({user : res_5.message, app});

        /* Check that Affiliate With Structure x got his amount */
        var { percentageOnLoss : user_4_percentageOnLoss } = user_5.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_4_after_info.affiliateInfo._id).affiliateStructure;
        
        /* Verify Affiliate Balance on User 4,5 */
        expect(getCurrencyWallet({wallet : user_4_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(betAmount*user_4_percentageOnLoss);
        expect(getCurrencyWallet({wallet : user_4_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(0);

        /* Get Info for App After Bet */
        const app_data_after = (await getApp({app})).data.message;
        const affiliateReturns = betAmount*(user_4_percentageOnLoss);

        /* Verify balance on App */
        expect(parseFloat(getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance+betAmount-affiliateReturns));
        /* Verify Balance on User 5 */
        expect(parseFloat(getCurrencyWallet({wallet : user_5_after_info.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : user_5_before_info.wallet, ticker}).playBalance-betAmount));

    }));

    it('it should change the Structure and remove the return of the previous user structure & bet should succeed', mochaAsync(async () => {
        const structures = [{level : 1, percentageOnLoss : 0.4}]
        let res_editAppStructure = await editAppStructure({app, structures});
        expect(res_editAppStructure.data.status).to.equal(200);

        /* Get Info for User 1 before Bet */
        var user_1_before_info = await getUserInfo({user : user_1.message, app});
        /* Get Info for User 2 before Bet */
        var user_2_before_info = await getUserInfo({user : user_2.message, app});
        /* Get Info for User 2 before Bet */
        var user_3_before_info = await getUserInfo({user : user_3.message, app});

        /* Get Info for User3 before Bet */
        const user_1 = {...user_1_before_info, eth_account : user_1.eth_account};
        const user_2 = {...user_2_before_info, eth_account : user_2.eth_account};
        const user_3 = {...user_3_before_info, eth_account : user_3.eth_account};

        /* Get Info for App before Bet */
        const app_data_before = (await getApp({app})).data.message;

        /* Const */
        const betAmount = 0.2;

        const BET_RESULT = [{
            place: 0, value: betAmount
        }];

        /* Get Info for User 2 before Bet */
        user_3_before_info = await getUserInfo({user : user_3.message, app});
        var wasWon = true;

        /* Creater User Bet */
        while(wasWon){
            /* Verify that was Lost */
            var bet_res = await bet({user : user_3, game : BET_GAME, result : BET_RESULT, app});
            const { message } = bet_res.data;
            wasWon = message.isWon;
        }

        const { status, message } = bet_res.data;
        /* Confirm Bet was valid */
        expect(status).to.equal(200);
        /* Get Info for User 1 After Bet */
        const user_1_after_info = await getUserInfo({user : user_1.message, app});
        /* Get Info for User 2 After Bet */
        const user_2_after_info = await getUserInfo({user : user_2.message, app});
        /* Get Info for User3 After Bet */
        const user_3_after_info = await getUserInfo({user : user_3.message, app});

        /* Check that Affiliate With Structure x got his amount */
        var { percentageOnLoss : user_2_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_2_after_info.affiliateInfo._id).affiliateStructure;
        var { isActive : user_1_isActive } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_1_after_info.affiliateInfo._id).affiliateStructure;
        
        /* Expect the percentage on loss to be equal to new change */
        expect(user_2_percentageOnLoss).to.equal(structures.find(s => s.level == 1).percentageOnLoss);
        /* Verify Affiliate Balance on User 1,2,3 */
        expect(parseFloat(getCurrencyWallet({wallet : user_2_after_info.affiliateInfo.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : user_2_before_info.affiliateInfo.wallet, ticker}).playBalance+betAmount*user_2_percentageOnLoss));
        expect(user_1_isActive).to.equal(false);

        /* Confirm User 1 has the affiliate balance equal to before */
        expect(parseFloat(getCurrencyWallet({wallet : user_1_after_info.affiliateInfo.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : user_1_before_info.affiliateInfo.wallet, ticker}).playBalance));
        expect(getCurrencyWallet({wallet : user_3_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(0);

        /* Get Info for App After Bet */
        const app_data_after = (await getApp({app})).data.message;

        /* Verify balance on App */
        const affiliateReturns = betAmount*(user_2_percentageOnLoss);
        expect(parseFloat(getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance+betAmount-affiliateReturns));

        /* Verify Balance on User 3 */
        expect(parseFloat(getCurrencyWallet({wallet : user_3_after_info.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : user_3_before_info.wallet, ticker}).playBalance-betAmount));
    }));

});

