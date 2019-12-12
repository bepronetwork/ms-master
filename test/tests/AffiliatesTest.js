import chai from 'chai';
import { createEthAccount, provideFunds } from '../utils/env';
import { mochaAsync } from '../utils';
import { createUser, editAppStructure, getApp, createUserDeposit, getUserInfo, bet, addCustomAffiliateStructureToUser } from '../services';
import Numbers from '../logic/services/numbers';
const expect = chai.expect;

const inputs = {
    structures : [{level : 1, percentageOnLoss : 0.04}, {level : 2, percentageOnLoss : 0.03}, {level : 3, percentageOnLoss : 0.02}]
}

context('Affiliates Testing', async () =>  {
    var app;
    var res_1, res_2, res_3, res_4, res_5;

    before( async () =>  {
        app = global.test.app;
        /* Set App */
        await editAppStructure({app, structures : inputs.structures});
    });

    context('user register', async () => {

        it('it should register with affiliates with no parent User', mochaAsync(async () => {
            res_1 = await createUser({app_id : app.id});
            const { status, message } = res_1;
            expect(status).to.equal(200);
            expect(message.affiliateId).to.not.be.null;
            expect(message.affiliateInfo.userAffiliated).to.equal(message._id);
            expect(message.affiliateInfo.userAffiliate).to.equal(undefined);
            expect(message.affiliateInfo.wallet.playBalance).to.equal(0);
            expect(message.affiliateInfo.parentAffiliatedLinks).to.equal(undefined);
            
            expect(message.affilateLinkInfo.affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);

        }));

        it('it should register with affiliates for link for parent user only', mochaAsync(async () => {
            const { affiliateId, id } = res_1.message;
            res_2 = await createUser({app_id : app.id, affiliateLink : affiliateId});
            const { status, message } = res_2;
            expect(status).to.equal(200);
            expect(message.affiliateId).to.not.be.null;

            //expect(message.affilateLinkInfo.userAffiliate).to.equal(id);
            expect(message.affiliateInfo.wallet.playBalance).to.equal(0);
            expect(message.affilateLinkInfo.parentAffiliatedLinks.length).to.equal(1);

            expect(message.affilateLinkInfo.affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);

            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);


        }));

        it('it should register with affiliates for link for parent and its parent levels', mochaAsync(async () => {

            const { affiliateId, id } = res_2.message;
            res_3 = await createUser({app_id : app.id, affiliateLink : affiliateId});
            const { status, message } = res_3;
            expect(status).to.equal(200);
            expect(message.affiliateId).to.not.be.null;

            //expect(message.affilateLinkInfo.userAffiliate).to.equal(id);
            expect(message.affiliateInfo.wallet.playBalance).to.equal(0);
            expect(message.affilateLinkInfo.parentAffiliatedLinks.length).to.equal(2);

            expect(message.affilateLinkInfo.affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.level).to.equal(inputs.structures[1].level);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.percentageOnLoss).to.equal(inputs.structures[1].percentageOnLoss);

            expect(message.affilateLinkInfo.parentAffiliatedLinks[1].affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[1].affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);
        }));


        it('it should register with affiliates for link for parent and its parent levels', mochaAsync(async () => {

            const { status, message } = res_3;
            expect(status).to.equal(200);
            expect(message.affiliateId).to.not.be.null;

            //expect(message.affilateLinkInfo.userAffiliate).to.equal(id);
            expect(message.affiliateInfo.wallet.playBalance).to.equal(0);
            expect(message.affilateLinkInfo.parentAffiliatedLinks.length).to.equal(2);

            expect(message.affilateLinkInfo.affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);

            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.level).to.equal(inputs.structures[1].level);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.percentageOnLoss).to.equal(inputs.structures[1].percentageOnLoss);

            expect(message.affilateLinkInfo.parentAffiliatedLinks[1].affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[1].affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);
        }));

        it('it should allow create user 4', mochaAsync(async () => {

            res_4 = await createUser({app_id : app.id});
            const { status, message } = res_4;
            expect(status).to.equal(200);
            expect(message.affiliateId).to.not.be.null;

            expect(message.affiliateInfo.wallet.playBalance).to.equal(0);
            expect(message.affilateLinkInfo.parentAffiliatedLinks.length).to.equal(0);
        }));


        it('it should allow app to give custom affiliate percentage (%) to desired user', mochaAsync(async () => {
            const postData = {
                user : res_4.message.id,
                affiliatePercentage : 0.3,
                app : app
            };

            let res = await addCustomAffiliateStructureToUser(postData);
            const { status } = res.data;
            expect(status).to.equal(200);

            let app_data_after = await getApp({app});
            const { message : data_after } = app_data_after.data;

            /* Test if they are 1 */
            expect(data_after.affiliateSetup.customAffiliateStructures.length).to.equal(1);
        }));

        it('it should allow create user 5', mochaAsync(async () => {
        
            const { affiliateId, id } = res_4.message;
            res_5 = await createUser({app_id : app.id, affiliateLink : affiliateId});
            const { status, message } = res_5;

            let app_data = await getApp({app});
            const { message : app_data_after } = app_data.data;

            expect(status).to.equal(200);
            expect(message.affiliateId).to.not.be.null;

            //expect(message.affilateLinkInfo.userAffiliate).to.equal(id);
            expect(message.affiliateInfo.wallet.playBalance).to.equal(0);
            expect(message.affilateLinkInfo.parentAffiliatedLinks.length).to.equal(1);

            expect(message.affilateLinkInfo.affiliateStructure.level).to.equal(inputs.structures[0].level);
            expect(message.affilateLinkInfo.affiliateStructure.percentageOnLoss).to.equal(inputs.structures[0].percentageOnLoss);
            expect(message.affilateLinkInfo.parentAffiliatedLinks.length).to.equal(1);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.level).to.equal(app_data_after.affiliateSetup.customAffiliateStructures[0].level);
            expect(message.affilateLinkInfo.parentAffiliatedLinks[0].affiliateStructure.percentageOnLoss).to.equal(app_data_after.affiliateSetup.customAffiliateStructures[0].percentageOnLoss);

        }));
    });

    context('edit structures', async () => {

        it('it should throw error on empty structure', mochaAsync(async () => {
            const structures = []
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(42);
        }));

        it('it should throw error on structure without percentageOnLoss', mochaAsync(async () => {
            const structures = [{level : 1}]
            let res = await editAppStructure({app, structures});
            const { message } = res;
            expect(message).to.equal('Validation errors');
        }));

        it('it should throw error on structure without level', mochaAsync(async () => {
            const structures = [{percentageOnLoss : 0.04}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(42);
        }));

        it('it should throw error on structure with same level', mochaAsync(async () => {
            const structures = [{level : 1, percentageOnLoss : 0.04}, {level : 2, percentageOnLoss : 0.03}, {level : 3, percentageOnLoss : 0.02}, {level : 3, percentageOnLoss : 0.01}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(42);
        }));

        it('it should throw error on structure with level negative', mochaAsync(async () => {
            const structures = [{level : -1, percentageOnLoss : 0.04}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(42);
        }));


        it('it should throw error on structure with percentageOnLoss Negative', mochaAsync(async () => {
            const structures = [{level : 1, percentageOnLoss : -0.04}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(42);
        }));

        it('it should throw error on structure with level 0', mochaAsync(async () => {
            const structures = [{level : 0, percentageOnLoss : 0.04}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(42);
        }));

        it('it should throw error on structure with percentageOnLoss 0', mochaAsync(async () => {
            const structures = [{level : 1, percentageOnLoss : 0}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(42);
        }));

        it('it should allow app to add structures and keep the old ones ids', mochaAsync(async () => {
            let app_data_before = await getApp({app});
            const { message : data_before } = app_data_before.data;

            const structures = [{level : 1, percentageOnLoss : 0.03}, {level : 2, percentageOnLoss : 0.02}, {level : 3, percentageOnLoss : 0.01}, {level : 4, percentageOnLoss : 0.01}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(200);

            let app_data_after = await getApp({app});
            const { message : data_after } = app_data_after.data;
            /* Test if they are 4 */
            expect(data_after.affiliateSetup.affiliateStructures.length).to.equal(structures.length);
            
            /* Test if the pre-existing structures kept intacted */
            const known_similar_structures = detectEqualFieldValueOccurences(structures, data_before.affiliateSetup.affiliateStructures, 'level');
            const post_change_similar_structures = detectEqualFieldValueOccurences(data_after.affiliateSetup.affiliateStructures, data_before.affiliateSetup.affiliateStructures, 'level');

            expect(known_similar_structures).to.equal(post_change_similar_structures);
            for( var i = 0; i < data_after.affiliateSetup.affiliateStructures.length; i++){
                const structure = data_after.affiliateSetup.affiliateStructures[i];
                /* Test if there is only one of each per level [1,2,3,4] */
                const structure_post = structures.find( s => s.level == structure.level);
                expect(structure.level).to.be.equal(structure_post.level);
            
                /* Test if ID keep the same for previous ones */
                const before_structure = data_before.affiliateSetup.affiliateStructures.find( a => a.level == structure.level);
                if(before_structure){
                    expect(before_structure._id).to.be.equal(structure._id);
                }

                /* Test if Percentage on Loss is right */
                expect(structure.percentageOnLoss).to.equal(structure_post.percentageOnLoss);
                /* Test if is Active */
                expect(structure.isActive).to.equal(true);
            }

        }));

        it('it should allow app to change structures keeping the old users info ids', mochaAsync(async () => {
            let app_data_before = await getApp({app});
            const { message : data_before } = app_data_before.data;

            const structures = [{level : 1, percentageOnLoss : 0.06}, {level : 2, percentageOnLoss : 0.04}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(200);

            let app_data_after = await getApp({app});
            const { message : data_after } = app_data_after.data;
            /* Test if they are 4 */
            expect(data_after.affiliateSetup.affiliateStructures.length).to.equal(data_before.affiliateSetup.affiliateStructures.length);
            
            /* Test if the pre-existing structures kept intacted */
            const known_similar_structures = detectEqualFieldValueOccurences(structures, data_before.affiliateSetup.affiliateStructures, 'level');
            const post_change_similar_structures = detectEqualFieldValueOccurences(data_after.affiliateSetup.affiliateStructures, data_before.affiliateSetup.affiliateStructures, 'level');

            expect(known_similar_structures).to.equal(post_change_similar_structures);

            for( var i = 0; i < data_after.affiliateSetup.affiliateStructures.length; i++){
                const structure = data_after.affiliateSetup.affiliateStructures[i];
                /* Test if there is only one of each per level [1,2,3,4] */
                const structure_requested = structures.find( s => s.level == structure.level);
                const before_structure = data_before.affiliateSetup.affiliateStructures.find( a => a.level == structure.level);

                if(structure_requested){
                    expect(before_structure._id).to.be.equal(structure._id);
                    /* Test if All current info has changed */
                    expect(structure.level).to.be.equal(structure_requested.level);
                    /* Test if Percentage on Loss is right */
                    expect(structure.percentageOnLoss).to.equal(structure_requested.percentageOnLoss);
                    /* Test if is Active */
                    expect(structure.isActive).to.equal(true);
                }else{
                    /* Test if All previous info is the same */
                    expect(before_structure.level).to.be.equal(structure.level);
                    /* Test if Id is equal*/
                    expect(before_structure._id).to.be.equal(structure._id);
                    /* Test if Percentage on Loss is right */
                    expect(before_structure.percentageOnLoss).to.be.equal(structure.percentageOnLoss);
                    /* Test if is Active is false */
                    expect(structure.isActive).to.equal(false);

                }
            }
        }));


        it('it should allow app to keep structures with same variables', mochaAsync(async () => {
            /* Get Before Data */
            let app_data_before = await getApp({app});
            const { message : data_before } = app_data_before.data;

            const structures = [{level : 1, percentageOnLoss : 0.06}, {level : 2, percentageOnLoss : 0.04}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(200);

            let app_data_after = await getApp({app});
            const { message : data_after } = app_data_after.data;
            /* Test if they are 4 */
            expect(data_after.affiliateSetup.affiliateStructures.length).to.equal(data_before.affiliateSetup.affiliateStructures.length);
            
            /* Test if the pre-existing structures kept intacted */
            const known_similar_structures = detectEqualFieldValueOccurences(structures, data_before.affiliateSetup.affiliateStructures, 'level');
            const post_change_similar_structures = detectEqualFieldValueOccurences(data_after.affiliateSetup.affiliateStructures, data_before.affiliateSetup.affiliateStructures, 'level');

            expect(known_similar_structures).to.equal(post_change_similar_structures);
            for( var i = 0; i < data_after.affiliateSetup.affiliateStructures.length; i++){
                const structure = data_after.affiliateSetup.affiliateStructures[i];
                const before_structure = data_before.affiliateSetup.affiliateStructures.find( a => a.level == structure.level);
                const structure_post = structures.find( s => s.level == structure.level);
                if(structure_post){
                    /* Test if there is only one of each per level [1,2,3,4] */
                    expect(structure.level).to.be.equal(structure_post.level);
                    /* Test if ID keep the same for previous ones */
                    expect(structure._id).to.be.equal(before_structure._id);
                    /* Test if Percentage on Loss is right */
                    expect(structure.percentageOnLoss).to.equal(structure_post.percentageOnLoss);
                    /* Test if is Active */
                    expect(structure.isActive).to.equal(true);
                }else{
                    /* Test if there is only one of each per level [1,2,3,4] */
                    expect(before_structure.level).to.be.equal(structure.level);
                    /* Test if ID keep the same for previous ones */
                    expect(before_structure._id).to.be.equal(structure._id);
                    /* Test if Percentage on Loss is right */
                    expect(before_structure.percentageOnLoss).to.equal(structure.percentageOnLoss);
                    /* Test if is Active */
                    expect(structure.isActive).to.equal(false);
                }
            }
        }));


        it('it should allow app to keep structures with different variables', mochaAsync(async () => {
            /* Get Before Data */
            let app_data_before = await getApp({app});
            const { message : data_before } = app_data_before.data;

            const structures = [{level : 1, percentageOnLoss : 0.03}, {level : 2, percentageOnLoss : 0.02}]
            let res = await editAppStructure({app, structures});
            const { status } = res.data;
            expect(status).to.equal(200);

            let app_data_after = await getApp({app});
            const { message : data_after } = app_data_after.data;
            /* Test if they are 4 */
            expect(data_after.affiliateSetup.affiliateStructures.length).to.equal(data_before.affiliateSetup.affiliateStructures.length);
            
            /* Test if the pre-existing structures kept intacted */
            const known_similar_structures = detectEqualFieldValueOccurences(structures, data_before.affiliateSetup.affiliateStructures, 'level');
            const post_change_similar_structures = detectEqualFieldValueOccurences(data_after.affiliateSetup.affiliateStructures, data_before.affiliateSetup.affiliateStructures, 'level');

            expect(known_similar_structures).to.equal(post_change_similar_structures);
            for( var i = 0; i < data_after.affiliateSetup.affiliateStructures.length; i++){
                const structure = data_after.affiliateSetup.affiliateStructures[i];
                const before_structure = data_before.affiliateSetup.affiliateStructures.find( a => a.level == structure.level);
                const structure_post = structures.find( s => s.level == structure.level);
                if(structure_post){
                    /* Test if there is only one of each per level [1,2,3,4] */
                    expect(structure.level).to.be.equal(structure_post.level);
                    /* Test if ID keep the same for previous ones */
                    expect(structure._id).to.be.equal(before_structure._id);
                    /* Test if Percentage on Loss is right */
                    expect(structure.percentageOnLoss).to.equal(structure_post.percentageOnLoss);
                    /* Test if is Active */
                    expect(structure.isActive).to.equal(true);
                }else{
                    /* Test if there is only one of each per level [1,2,3,4] */
                    expect(before_structure.level).to.be.equal(structure.level);
                    /* Test if ID keep the same for previous ones */
                    expect(before_structure._id).to.be.equal(structure._id);
                    /* Test if Percentage on Loss is right */
                    expect(before_structure.percentageOnLoss).to.equal(structure.percentageOnLoss);
                    /* Test if is Active */
                    expect(structure.isActive).to.equal(false);
                }
            }
        }));
    });

    context('POST Bet', async () => {
        it('it should set Bet for user and losts should be sent to parent Users (standard affiliate)', mochaAsync(async () => {
            /* Get Info for User 1 before Bet */
            var user_1_before_info = await getUserInfo({user : res_1.message, app});
            /* Get Info for User 2 before Bet */
            var user_2_before_info = await getUserInfo({user : res_2.message, app});
            /* Get Info for User 2 before Bet */
            var user_3_before_info = await getUserInfo({user : res_3.message, app});
            
            /* Get Info for User3 before Bet */
            const user_1 = {...user_1_before_info, eth_account : res_1.eth_account};
            const user_2 = {...user_2_before_info, eth_account : res_2.eth_account};
            const user_3 = {...user_3_before_info, eth_account : res_3.eth_account};

            /* Get Info for App before Bet */
            const app_data_before = (await getApp({app})).data.message;

            /* Const */
            const TOKEN_DEPOSIT_AMOUNT = 3;
            const ETH_DEPOSIT_AMOUNT = 0.1;
            const BET_AMOUNT = 0.2;
           

            /* Send Tokens to User */
            await provideFunds({account : user_3.eth_account, ethAmount : ETH_DEPOSIT_AMOUNT, tokenAmount : TOKEN_DEPOSIT_AMOUNT});
            /* Deposit for User */
            await createUserDeposit({user : user_3, tokenAmount : TOKEN_DEPOSIT_AMOUNT, app : app_data_before});

            /* Get Info for User 2 before Bet */
            user_3_before_info = await getUserInfo({user : res_3.message, app});
            var wasWon = true;
            /* Creater User Bet */
            while(wasWon){
                var BET_GAME = app_data_before.games.find( game => game.metaName == 'european_roulette_simple');
                var BET_RESULT = [{
                    place: 0, value: BET_AMOUNT
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
            const user_1_after_info = await getUserInfo({user : res_1.message, app});
            /* Get Info for User 2 After Bet */
            const user_2_after_info = await getUserInfo({user : res_2.message, app});
            /* Get Info for User3 After Bet */
            const user_3_after_info = await getUserInfo({user : res_3.message, app});

            /* Check that Affiliate With Structure x got his amount */
            var { percentageOnLoss : user_1_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_1_after_info.affiliateInfo._id).affiliateStructure;
            var { percentageOnLoss : user_2_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_2_after_info.affiliateInfo._id).affiliateStructure;
    
            /* Verify Affiliate Balance on User 1,2,3 */
            expect(user_1_after_info.affiliateInfo.wallet.playBalance).to.equal(BET_AMOUNT*user_1_percentageOnLoss);
            expect(user_2_after_info.affiliateInfo.wallet.playBalance).to.equal(BET_AMOUNT*user_2_percentageOnLoss);
            expect(user_3_after_info.affiliateInfo.wallet.playBalance).to.equal(0);
            /* Get Info for App After Bet */
            const app_data_after = (await getApp({app})).data.message;
            /* Verify balance on App */
            const affiliateReturns = BET_AMOUNT*(user_2_percentageOnLoss+user_1_percentageOnLoss);
            expect(parseFloat(app_data_after.wallet.playBalance).toFixed(6)).to.equal(parseFloat(app_data_before.wallet.playBalance+BET_AMOUNT-affiliateReturns).toFixed(6));
            /* Verify Balance on User 3 */
            expect(parseFloat(user_3_after_info.wallet.playBalance).toFixed(6)).to.equal(parseFloat(user_3_before_info.wallet.playBalance-BET_AMOUNT).toFixed(6));

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
            const TOKEN_DEPOSIT_AMOUNT = 3;
            const ETH_DEPOSIT_AMOUNT = 0.1;
            const BET_AMOUNT = 0.2;
            const BET_GAME = app_data_before.games.find( game => game.metaName == 'european_roulette_simple');
            const BET_RESULT = [{
                place: 0, value: BET_AMOUNT
            }];

            /* Send Tokens to User */
            await provideFunds({account : user_5.eth_account, ethAmount : ETH_DEPOSIT_AMOUNT, tokenAmount : TOKEN_DEPOSIT_AMOUNT});
            /* Deposit for User */
            await createUserDeposit({user : user_5, tokenAmount : TOKEN_DEPOSIT_AMOUNT, app : app_data_before});

            /* Get Info for User 4 before Bet */
            user_5_before_info = await getUserInfo({user : res_5.message, app});
            
            var wasWon = true;

            /* Creater User Bet */
            while(wasWon){
                /* Verify that was Lost */
                var bet_res = await bet({user : user_5, game : BET_GAME, result : BET_RESULT, app});
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
            expect(user_4_after_info.affiliateInfo.wallet.playBalance).to.equal(BET_AMOUNT*user_4_percentageOnLoss);
            expect(user_5_after_info.affiliateInfo.wallet.playBalance).to.equal(0);
            
            /* Get Info for App After Bet */
            const app_data_after = (await getApp({app})).data.message;
            const affiliateReturns = BET_AMOUNT*(user_4_percentageOnLoss);

            /* Verify balance on App */
            expect(parseFloat(app_data_after.wallet.playBalance).toFixed(6)).to.equal(parseFloat(app_data_before.wallet.playBalance+BET_AMOUNT-affiliateReturns).toFixed(6));
            /* Verify Balance on User 5 */
            expect(parseFloat(user_5_after_info.wallet.playBalance).toFixed(6)).to.equal(parseFloat(user_5_before_info.wallet.playBalance-BET_AMOUNT).toFixed(6));

        }));

        it('it should change the Structure and remove the return of the previous user structure & bet should succeed', mochaAsync(async () => {
            const structures = [{level : 1, percentageOnLoss : 0.4}]
            let res_editAppStructure = await editAppStructure({app, structures});
            expect(res_editAppStructure.data.status).to.equal(200);

            /* Get Info for User 1 before Bet */
            var user_1_before_info = await getUserInfo({user : res_1.message, app});
            /* Get Info for User 2 before Bet */
            var user_2_before_info = await getUserInfo({user : res_2.message, app});
            /* Get Info for User 2 before Bet */
            var user_3_before_info = await getUserInfo({user : res_3.message, app});

            /* Get Info for User3 before Bet */
            const user_1 = {...user_1_before_info, eth_account : res_1.eth_account};
            const user_2 = {...user_2_before_info, eth_account : res_2.eth_account};
            const user_3 = {...user_3_before_info, eth_account : res_3.eth_account};

            /* Get Info for App before Bet */
            const app_data_before = (await getApp({app})).data.message;

            /* Const */
            const BET_AMOUNT = 0.2;
            const BET_GAME = app_data_before.games.find( game => game.metaName == 'european_roulette_simple');
            const BET_RESULT = [{
                place: 0, value: BET_AMOUNT
            }];

            /* Get Info for User 2 before Bet */
            user_3_before_info = await getUserInfo({user : res_3.message, app});
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
            const user_1_after_info = await getUserInfo({user : res_1.message, app});
            /* Get Info for User 2 After Bet */
            const user_2_after_info = await getUserInfo({user : res_2.message, app});
            /* Get Info for User3 After Bet */
            const user_3_after_info = await getUserInfo({user : res_3.message, app});

            /* Check that Affiliate With Structure x got his amount */
            var { percentageOnLoss : user_2_percentageOnLoss } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_2_after_info.affiliateInfo._id).affiliateStructure;
            var { isActive : user_1_isActive } = user_3.affilateLinkInfo.parentAffiliatedLinks.find( paf => paf.affiliate._id == user_1_after_info.affiliateInfo._id).affiliateStructure;
            
            /* Expect the percentage on loss to be equal to new change */
            expect(user_2_percentageOnLoss).to.equal(structures.find(s => s.level == 1).percentageOnLoss);
            /* Verify Affiliate Balance on User 1,2,3 */
            expect(Numbers.toFloat(user_2_after_info.affiliateInfo.wallet.playBalance)).to.equal(Numbers.toFloat(user_2_before_info.affiliateInfo.wallet.playBalance+BET_AMOUNT*user_2_percentageOnLoss));
            expect(user_1_isActive).to.equal(false);

            /* Confirm User 1 has the affiliate balance equal to before */
            expect(user_1_after_info.affiliateInfo.wallet.playBalance).to.equal(user_1_before_info.affiliateInfo.wallet.playBalance);
            expect(user_3_after_info.affiliateInfo.wallet.playBalance).to.equal(0);

            /* Get Info for App After Bet */
            const app_data_after = (await getApp({app})).data.message;

            /* Verify balance on App */
            const affiliateReturns = BET_AMOUNT*(user_2_percentageOnLoss);
            expect(parseFloat(app_data_after.wallet.playBalance).toFixed(6)).to.equal(parseFloat(app_data_before.wallet.playBalance+BET_AMOUNT-affiliateReturns).toFixed(6));

            /* Verify Balance on User 3 */
            expect(parseFloat(user_3_after_info.wallet.playBalance).toFixed(6)).to.equal(parseFloat(user_3_before_info.wallet.playBalance-BET_AMOUNT).toFixed(6));
        }));
    });

    
});


function detectEqualFieldValueOccurences(arr1, arr2, field){
    return arr1.reduce( (acc, a) => {
        const b = arr2.find( s => {  ((s[field] == a[field]) && (s.isActive)) });
        if(b){ return acc+1 }
        else{ return acc }
    }, 0)
}