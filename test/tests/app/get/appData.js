import {
    getApp
} from '../../../methods';

import chai from 'chai';
import models from '../../../models';

import {
    GETPopularNumbersShouldAllow,
    GETAppDATAShouldForbidTheAccess,
    GETBESTDATAShouldAllow,
    GETBESTDATAShouldForbidTheAccess,
    GETBiggestBetWinnersShouldAllow,
    GETBiggestUserWinnersShouldAllow,
    GETGAMESDATAShouldAllow,
    GETGAMESDATAShouldForbidTheAccess,
    GETLastBetsShouldAllow,
    GETREVENUEDATAShouldAllow,
    GETREVENUEDATAShouldForbidTheAccess,
    GETUSERSDATAShouldAllow,
    GETUSERSDATAShouldForbidTheAccess,
    shouldGetAppData,
    GETUsersShouldAllow,
    GETWALLETDATAShouldAllow,
    GETWALLETDATAShouldForbidTheAccess
} from '../../output/AppTestMethod';
import { mochaAsync } from '../../../utils';

import {
    getAppAuth,
    getAppSummary,
    getAppLastBets,
    getAppUsers,
    getAppBiggestBetWinners,
    getAppBiggestUserWinners,
    getAppPopularNumbers

} from '../../../methods';
import { getUserInfo } from '../../../services';

const expect = chai.expect;

context('App Data', async () =>  {
    var admin, app;


    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should Get App Data', mochaAsync(async () => {
        let get_app_model = models.apps.get_app(app.id);
        let res = await getApp(get_app_model);
        shouldGetAppData(res.data, expect);
    })); 


    it('GET App DATA - should forbid the access', mochaAsync(async () => {
        let get_app_model = models.apps.get_app(app.id);
        let res = await getAppAuth(get_app_model);
        GETAppDATAShouldForbidTheAccess(res.data, expect);
    })); 


    it('GET USERS DATA - should forbid the access', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'USERS', 'weekly');
        let res = await getAppSummary(users_call_model);
        GETUSERSDATAShouldForbidTheAccess(res.data, expect);
    })); 

    it('GET REVENUE DATA - should forbid the access ', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'REVENUE', 'weekly');
        let res = await getAppSummary(users_call_model);
        GETREVENUEDATAShouldForbidTheAccess(res.data, expect);
    })); 

    it('GET GAMES DATA - should forbid the access ', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'GAMES', 'weekly');
        let res = await getAppSummary(users_call_model);
        GETGAMESDATAShouldForbidTheAccess(res.data, expect);
    })); 

    it('GET BEST DATA - should forbid the access ', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'BETS', 'weekly');
        let res = await getAppSummary(users_call_model);
        GETBESTDATAShouldForbidTheAccess(res.data, expect);
    })); 

    it('GET WALLET DATA - should forbid the access ', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'WALLET');
        let res = await getAppSummary(users_call_model);
        GETWALLETDATAShouldForbidTheAccess(res.data, expect);
    })); 

    
    it('GET users - should allow', mochaAsync(async () => {
        let postData = {
            app : app.id
        };
        let res = await getAppUsers(postData, app.bearerToken, {id : app.id});
        GETUsersShouldAllow(res.data, expect);
    }));

    it('GET last Bets - should allow', mochaAsync(async () => {
        let postData = {
            app : app.id,
            size : 30
        };
        let res = await getAppLastBets(postData);
        GETLastBetsShouldAllow(res.data, expect);
    }));

    it('GET Biggest Bet Winners - should allow', mochaAsync(async () => {
        let postData = {
            app : app.id,
            size : 30
        };
        let res = await getAppBiggestBetWinners(postData);
        GETBiggestBetWinnersShouldAllow(res.data, expect);
    }))

    it('GET Biggest User Winners - should allow', mochaAsync(async () => {
        let postData = {
            app : app.id,
            size : 30
        };
        let res = await getAppBiggestUserWinners(postData);
        GETBiggestUserWinnersShouldAllow(res.data, expect);
    }))

    it('GET Popular Numbers - should allow', mochaAsync(async () => {
        let postData = {
            app : app.id
        };
        let res = await getAppPopularNumbers(postData);
        GETPopularNumbersShouldAllow(res.data, expect);
    }))
            
    it('GET USERS DATA - should allow', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'USERS', 'weekly');
        let res = await getAppSummary(users_call_model, app.bearerToken, {id : app.id});
        GETUSERSDATAShouldAllow(res.data, expect);
    })); 

    it('GET REVENUE DATA - should allow', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'REVENUE');
        let res = await getAppSummary(users_call_model, app.bearerToken, {id : app.id});
        GETREVENUEDATAShouldAllow(res.data, expect);
    })); 

    it('GET GAMES DATA - should allow', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'GAMES', 'weekly');
        let res = await getAppSummary(users_call_model, app.bearerToken, {id : app.id});
        GETGAMESDATAShouldAllow(res.data, expect);
    })); 

    it('GET BEST DATA - should allow', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'BETS', 'weekly');
        let res = await getAppSummary(users_call_model, app.bearerToken, {id : app.id});
        GETBESTDATAShouldAllow(res.data, expect);
    })); 

    it('GET WALLET DATA - should allow', mochaAsync(async () => {
        let users_call_model = models.apps.get_summary(app.id, 'WALLET', 'weekly');
        let res = await getAppSummary(users_call_model, app.bearerToken, {id : app.id});
        GETWALLETDATAShouldAllow(res.data, expect);
    }));
});
