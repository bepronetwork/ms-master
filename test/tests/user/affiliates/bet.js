import { mochaAsync, getCurrencyWallet, detectValidationErrors } from '../../../utils';
import { getAppAuth, authAdmin, setMaxBet } from '../../../methods';
import chai from 'chai';
import { editAppStructure, getApp, getUserInfo, bet } from '../../../services';
import { provideFunds } from '../../../utils/env';
import { digestBetResult } from '../../../utils/bet';
import { WalletsRepository } from '../../../../src/db/repos';
const perf = require('execution-time')();

const expect = chai.expect;
const ticker = 'ETH';
const ethDepositAmount = 0.1;
const betAmount = 0.01;
const metaName = 'european_roulette_simple';

const inputs = {
    structures : [{level : 1, percentageOnLoss : 0.04}, {level : 2, percentageOnLoss : 0.03}, {level : 3, percentageOnLoss : 0.02}]
}


context('Bet', async () => {
    var app, user_1, user_2, user_3, user_4, user_5, currencyWallet, currency, game, admin, jackpotAmount, fee, betAmountWithoutJackpotAndFee, res;


    before( async () =>  {
        admin = (await authAdmin({ admin : global.test.admin.id }, global.test.admin.security.bearerToken, { id : global.test.admin.id})).data.message;
        app = (await getAppAuth({app : admin.app.id, admin: admin.id}, admin.security.bearerToken, {id : admin.id})).data.message;
        game = app.games.find( game => game.metaName == metaName);
        currencyWallet = (app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
        currency = currencyWallet.currency;
    });

    it('it should Set Maximum Bet - Affiliates', mochaAsync(async () => {
        let postData = {
            app : admin.app.id,
            game : game._id,
            maxBet : 0.2
        }
        let res = await setMaxBet({...postData, admin: admin.id}, admin.security.bearerToken, {id : admin.id});
        expect(res.data.status).to.equal(200);
    }));

    it('it should set Bet for user and losts should be sent to parent Users (standard affiliate)', mochaAsync(async () => {
        
        await editAppStructure({app, admin, structures : inputs.structures});

        user_1 = global.test.user_1;
        user_2 = global.test.user_2;
        user_3 = global.test.user_3;
        user_4 = global.test.user_4;
        user_5 = global.test.user_5;
        /* Get Info for User 1 before Bet */
        var user_1_before_info = await getUserInfo({user : user_1, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 2 before Bet */
        var user_2_before_info = await getUserInfo({user : user_2, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 2 before Bet */
        var user_3_before_info = await getUserInfo({user : user_3, app, currency:"5e108498049eba079930ae1c"});
        
        /* Get Info for User3 before Bet */
        user_1 = {...user_1_before_info, eth_account : user_1.eth_account};
        user_2 = {...user_2_before_info, eth_account : user_2.eth_account};
        user_3 = {...user_3_before_info, eth_account : user_3.eth_account};

        /* Get Info for App before Bet */
        let app_data_before = (await getApp({app, admin})).data.message;

        var user_3_currrencyWallet = (user_3.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
        /* Send Tokens to User */
        await provideFunds({wallet : user_3_currrencyWallet._id, amount : ethDepositAmount});

        /* Get Info for User 2 before Bet */
        user_3_before_info = await getUserInfo({user : user_3 , app, currency:"5e108498049eba079930ae1c"});
        var wasWon = true;
        console.log("TESTE-HERE ", '1');


        let walletApp = app_data_before.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
        await WalletsRepository.prototype.updatePlayBalance(walletApp._id, 10);

        app_data_before = (await getApp({app, admin})).data.message;

        /* Creater User Bet */
        while(wasWon){
            console.log(1);
            var BET_RESULT = [{
                place: 1, value: betAmount
            }];
            global.test.pot = ((!global.test.pot) ? 0 : global.test.pot) + (global.test.jackpotEdge * betAmount);
            /* Verify that was Lost */
            var bet_res = await bet({user : user_3, game : game, result : BET_RESULT, app, currency});
            detectValidationErrors(bet_res);

            const { message } = bet_res.data;
            console.log("TESTE-HERE ", message);
            res = bet_res;
            wasWon = message.isWon;
            jackpotAmount = message.jackpotAmount;
            fee = message.fee;
            betAmountWithoutJackpotAndFee = message.betAmount;
            console.log(2);
        }
        const { status } = bet_res.data;
        /* Confirm Bet was valid */
        expect(status).to.equal(200);
        /* Get Info for User 1 After Bet */
        const user_1_after_info = await getUserInfo({user : user_1, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 2 After Bet */
        const user_2_after_info = await getUserInfo({user : user_2, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User3 After Bet */
        const user_3_after_info = await getUserInfo({user : user_3, app, currency:"5e108498049eba079930ae1c"});

        /* Check that Affiliate With Structure x got his amount */
        var { percentageOnLoss : user_1_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_1_after_info.affiliateInfo._id).affiliateStructure;
        var { percentageOnLoss : user_2_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_2_after_info.affiliateInfo._id).affiliateStructure;

        /* Verify Affiliate Balance on User 1,2,3 */
        expect(getCurrencyWallet({wallet : user_1_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal((betAmount - jackpotAmount - fee)*user_1_percentageOnLoss);
        expect(getCurrencyWallet({wallet : user_2_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal((betAmount - jackpotAmount - fee)*user_2_percentageOnLoss);
        expect(getCurrencyWallet({wallet : user_3_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(0);

        /* Get Info for App After Bet */
        const app_data_after = (await getApp({app, admin})).data.message;
        /* Verify balance on App */
        const affiliateReturns = (betAmount - jackpotAmount - fee)*(user_2_percentageOnLoss+user_1_percentageOnLoss);

        expect(parseFloat(getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance).toFixed(6)).to.equal(parseFloat(getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance+betAmountWithoutJackpotAndFee-affiliateReturns+jackpotAmount+fee).toFixed(6));
        /* Verify Balance on User 3 */
        expect(parseFloat(getCurrencyWallet({wallet : user_3_after_info.wallet, ticker}).playBalance).toFixed(6)).to.equal(parseFloat(getCurrencyWallet({wallet : user_3_before_info.wallet, ticker}).playBalance-(betAmountWithoutJackpotAndFee+fee+jackpotAmount)).toFixed(6));

        await digestBetResult({
            res,
            edge : game.edge, 
            newBalance : getCurrencyWallet({wallet : user_3_after_info.wallet, ticker}).playBalance,
            previousBalance : getCurrencyWallet({wallet : user_3_before_info.wallet, ticker}).playBalance,
            previousBalanceApp : getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance,
            newBalanceApp : getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance
        })
    }));

    it('it should set Bet for user and losts should be sent to parent Users (custom affiliate)', mochaAsync(async () => {
        user_4 = global.test.user_4;
        user_5 = global.test.user_5;

        /* Get Info for User 4 before Bet */
        var user_4_before_info = await getUserInfo({user : user_4, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 5 before Bet */
        var user_5_before_info = await getUserInfo({user : user_5, app, currency:"5e108498049eba079930ae1c"});
        
        /* Get Info for User3 before Bet */
        user_4 = {...user_4_before_info, eth_account : user_4.eth_account};
        user_5 = {...user_5_before_info, eth_account : user_5.eth_account};

        /* Get Info for App before Bet */
        const app_data_before = (await getApp({app, admin})).data.message;

        /* Const */
        const BET_RESULT = [{
            place: 1, value: betAmount
        }];


        var user_5_currrencyWallet = (user_5.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase()));
        /* Send Tokens to User */
        await provideFunds({wallet : user_5_currrencyWallet._id, amount : ethDepositAmount});

        /* Get Info for User 4 before Bet */
        user_5_before_info = await getUserInfo({user : user_5, app, currency:"5e108498049eba079930ae1c"});
        
        var wasWon = true;
        /* Creater User Bet */
        while(wasWon){
            /* Verify that was Lost */
            global.test.pot = ((!global.test.pot) ? 0 : global.test.pot) + (global.test.jackpotEdge * betAmount);
            var bet_res = await bet({user : user_5, game : game, result : BET_RESULT, app, currency});
            const { message } = bet_res.data;
            res = bet_res;
            wasWon = message.isWon;
            jackpotAmount = message.jackpotAmount;
            fee = message.fee;
            betAmountWithoutJackpotAndFee = message.betAmount;
        }

        const { status, message } = bet_res.data;
        /* Confirm Bet was valid */
        expect(status).to.equal(200);

        /* Get Info for User 4 After Bet */
        const user_4_after_info = await getUserInfo({user : user_4, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 5 After Bet */
        const user_5_after_info = await getUserInfo({user : user_5, app, currency:"5e108498049eba079930ae1c"});

        /* Check that Affiliate With Structure x got his amount */
        var { percentageOnLoss : user_4_percentageOnLoss } = user_5.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_4_after_info.affiliateInfo._id).affiliateStructure;
        
        /* Verify Affiliate Balance on User 4,5 */
        expect(getCurrencyWallet({wallet : user_4_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal((betAmount - jackpotAmount - fee)*user_4_percentageOnLoss);
        expect(getCurrencyWallet({wallet : user_5_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(0);
        /* Get Info for App After Bet */
        const app_data_after = (await getApp({app, admin})).data.message;
        const affiliateReturns = (betAmount - jackpotAmount - fee)*(user_4_percentageOnLoss);

        /* Verify balance on App */
        expect(parseFloat(getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance).toFixed(6)).to.equal(parseFloat(getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance+betAmountWithoutJackpotAndFee-affiliateReturns+jackpotAmount+fee).toFixed(6));
        /* Verify Balance on User 5 */
        expect(parseFloat(getCurrencyWallet({wallet : user_5_after_info.wallet, ticker}).playBalance).toFixed(6)).to.equal(parseFloat(getCurrencyWallet({wallet : user_5_before_info.wallet, ticker}).playBalance-(betAmountWithoutJackpotAndFee+fee+jackpotAmount)).toFixed(6));

        await digestBetResult({
            res,
            edge : game.edge, 
            newBalance : getCurrencyWallet({wallet : user_5_after_info.wallet, ticker}).playBalance,
            previousBalance : getCurrencyWallet({wallet : user_5_before_info.wallet, ticker}).playBalance,
            previousBalanceApp : getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance,
            newBalanceApp : getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance
        })
    }));

    it('it should change the Structure and remove the return of the previous user structure & bet should succeed', mochaAsync(async () => {
        const structures = [{level : 1, percentageOnLoss : 0.4}]
        let res_editAppStructure = await editAppStructure({app, admin, structures});
        expect(res_editAppStructure.data.status).to.equal(200);

        /* Get Info for User 1 before Bet */
        var user_1_before_info = await getUserInfo({user : user_1, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 2 before Bet */
        var user_2_before_info = await getUserInfo({user : user_2, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 2 before Bet */
        var user_3_before_info = await getUserInfo({user : user_3, app, currency:"5e108498049eba079930ae1c"});

        /* Get Info for User3 before Bet */
        user_1 = {...user_1_before_info, eth_account : user_1.eth_account};
        user_2 = {...user_2_before_info, eth_account : user_2.eth_account};
        user_3 = {...user_3_before_info, eth_account : user_3.eth_account};

        /* Get Info for App before Bet */
        const app_data_before = (await getApp({app, admin})).data.message;

        /* Const */

        const BET_RESULT = [{
            place: 1, value: betAmount
        }];

        /* Get Info for User 2 before Bet */
        user_3_before_info = await getUserInfo({user : user_3, app, currency:"5e108498049eba079930ae1c"});
        var wasWon = true;

        /* Creater User Bet */
        while(wasWon){
            global.test.pot = ((!global.test.pot) ? 0 : global.test.pot) + (global.test.jackpotEdge * betAmount);
            /* Verify that was Lost */
            var bet_res = await bet({user : user_3, game : game, result : BET_RESULT, app, currency});
            const { message } = bet_res.data;
            res = bet_res;
            wasWon = message.isWon;
            console.log("was Won", wasWon);
            jackpotAmount = message.jackpotAmount;
            fee = message.fee;
            betAmountWithoutJackpotAndFee = message.betAmount;
        }

        const { status, message } = bet_res.data;
        /* Confirm Bet was valid */
        expect(status).to.equal(200);
        /* Get Info for User 1 After Bet */
        const user_1_after_info = await getUserInfo({user : user_1, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User 2 After Bet */
        const user_2_after_info = await getUserInfo({user : user_2, app, currency:"5e108498049eba079930ae1c"});
        /* Get Info for User3 After Bet */
        const user_3_after_info = await getUserInfo({user : user_3, app, currency:"5e108498049eba079930ae1c"});

        /* Check that Affiliate With Structure x got his amount */
        var { percentageOnLoss : user_2_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_2_after_info.affiliateInfo._id).affiliateStructure;
        var { isActive : user_1_isActive } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_1_after_info.affiliateInfo._id).affiliateStructure;
        
        /* Expect the percentage on loss to be equal to new change */
        expect(user_2_percentageOnLoss).to.equal(structures.find(s => s.level == 1).percentageOnLoss);
        /* Verify Affiliate Balance on User 1,2,3 */
        expect(parseFloat(getCurrencyWallet({wallet : user_2_after_info.affiliateInfo.wallet, ticker}).playBalance)).to.equal(parseFloat(getCurrencyWallet({wallet : user_2_before_info.affiliateInfo.wallet, ticker}).playBalance+(betAmount - jackpotAmount - fee)*user_2_percentageOnLoss));
        expect(user_1_isActive).to.equal(false);

        /* Confirm User 1 has the affiliate balance equal to before */
        expect(parseFloat(getCurrencyWallet({wallet : user_1_after_info.affiliateInfo.wallet, ticker}).playBalance).toFixed(6)).to.equal(parseFloat(getCurrencyWallet({wallet : user_1_before_info.affiliateInfo.wallet, ticker}).playBalance).toFixed(6));
        expect(getCurrencyWallet({wallet : user_3_after_info.affiliateInfo.wallet, ticker}).playBalance).to.equal(0);

        /* Get Info for App After Bet */
        const app_data_after = (await getApp({app, admin})).data.message;         
        /* Verify balance on App */
        const affiliateReturns = (betAmount - jackpotAmount - fee)*(user_2_percentageOnLoss);
        /* Verify balance on App */
        expect(parseFloat(getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance).toFixed(6)).to.equal(parseFloat(getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance+betAmountWithoutJackpotAndFee-affiliateReturns+jackpotAmount+fee).toFixed(6));
        /* Verify Balance on User 5 */
        expect(parseFloat(getCurrencyWallet({wallet : user_3_after_info.wallet, ticker}).playBalance).toFixed(6)).to.equal(parseFloat(getCurrencyWallet({wallet : user_3_before_info.wallet, ticker}).playBalance-(betAmountWithoutJackpotAndFee+fee+jackpotAmount)).toFixed(6));
    
        await digestBetResult({
            res,
            edge : game.edge, 
            newBalance : getCurrencyWallet({wallet : user_3_after_info.wallet, ticker}).playBalance,
            previousBalance : getCurrencyWallet({wallet : user_3_before_info.wallet, ticker}).playBalance,
            previousBalanceApp : getCurrencyWallet({wallet : app_data_before.wallet, ticker}).playBalance,
            newBalanceApp : getCurrencyWallet({wallet : app_data_after.wallet, ticker}).playBalance
        })
    }));

});

