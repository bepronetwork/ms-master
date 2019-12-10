import {
    registerAdmin,
    loginAdmin,
    authAdmin,
    registerApp,
    loginAdmin2FA, 
    setAdmin2FA
} from '../methods';

import faker from 'faker';
import chai from 'chai';
import Security from '../../src/controllers/Security/Security';
import models from '../models';
import { detectValidationErrors } from '../utils';
import {
    shouldRegisterTheAdmin,
    shouldLoginTheAdmin,
    shouldCreateTheApp,
    shouldSet2FAForTheAdmin,
    shouldLoginTheAdminFA,
    shouldAuthForAdminBearerToken,
    shouldntLoginTheAdminWRONGTOKEN,
    shouldntCreateAnAppForExistingAppOnAdmin,
    shouldntLoginTheAdminNOTOKEN,
    shouldntLoginTheAdminAndNoticeTheUserDoesNotExist,
    shouldntLoginTheAdmin
} from './output/AdminTestMethod'


const expect = chai.expect;
const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

/* UTILS FUNCTIONS */ 

var mochaAsync = (fn) => {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    };
};
/* TESTS */
const BOILERPLATES = global.BOILERPLATES;

// Admin Normal Registering
context('Admin Testing', async () => {
    var ADMIN_ID, APP_ID, BEARER_TOKEN, SECRET;

    context('POST', async () => {
        it('should register the Admin', mochaAsync(async () => {
            var res = await registerAdmin(BOILERPLATES.admins.NORMAL_REGISTER);
            shouldRegisterTheAdmin(res.data, expect);
        }));

        it('should login the Admin', mochaAsync(async () => {
            let res = await loginAdmin(BOILERPLATES.admins.NORMAL_LOGIN_USER);
            ADMIN_ID = res.data.message.id;
            shouldLoginTheAdmin(res.data, expect);
        }));

        it('should create the App', mochaAsync(async () => {
            let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID));
            var response = await registerApp(app_call_model);
            APP_ID = response.data.message.id;
            shouldCreateTheApp(response.data, expect);
            
        }));

        it('should set 2FA for the Admin', mochaAsync(async () => {
            let res_login = await loginAdmin(BOILERPLATES.admins.NORMAL_LOGIN_USER);
            ADMIN_ID = res_login.data.message.id;
            BEARER_TOKEN = res_login.data.message.bearerToken;
            let secret = Security.prototype.generateSecret2FA({name : 'BetProtocol', account_id : ADMIN_ID});
            SECRET = secret;
            let token = Security.prototype.generateToken2FA(secret);
            var res = await setAdmin2FA({
                '2fa_secret' : secret,
                '2fa_token' : token,
                admin : ADMIN_ID
            }, BEARER_TOKEN, { id : ADMIN_ID});
            shouldSet2FAForTheAdmin(res.data, expect);
        }));

        it('should login the Admin', mochaAsync(async () => {
            let token = Security.prototype.generateToken2FA(SECRET);
            let res = await loginAdmin2FA({...BOILERPLATES.admins.NORMAL_LOGIN_USER,
                '2fa_token' : token
            });
            ADMIN_ID = res.data.message.id;
            shouldLoginTheAdminFA(res.data, expect);
        }));


        it('should auth for Admin - BearerToken', mochaAsync(async () => {

            let token = Security.prototype.generateToken2FA(SECRET);
            let res = await loginAdmin2FA({...BOILERPLATES.admins.NORMAL_LOGIN_USER,
                '2fa_token' : token
            });
            ADMIN_ID = res.data.message.id;
            BEARER_TOKEN = res.data.message.bearerToken;
            res = await authAdmin({
                admin : ADMIN_ID
            }, BEARER_TOKEN, { id : ADMIN_ID});
            shouldAuthForAdminBearerToken(res.data, expect);
        }));

    
    });

    context('POST - Forbidden', async () => {

        it('shouldn´t login the Admin - WRONG TOKEN', mochaAsync(async () => {
            let res = await loginAdmin2FA({...BOILERPLATES.admins.NORMAL_LOGIN_USER,
                '2fa_token' : '345633',
                'admin_id' : ADMIN_ID
            });
            detectValidationErrors(res);
            shouldntLoginTheAdminWRONGTOKEN(res.data, expect);
        }));


        it('shouldn´t create an App for existing App on Admin', mochaAsync(async () => {
            let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID));
            var response = await registerApp(app_call_model);
            APP_ID = response.data.message.id;
            shouldntCreateAnAppForExistingAppOnAdmin(response.data, expect);
            
        }));

        it('shouldn´t login the Admin - NO TOKEN', mochaAsync(async () => {
            let res = await loginAdmin(BOILERPLATES.admins.NORMAL_LOGIN_USER);
            detectValidationErrors(res);
            shouldntLoginTheAdminNOTOKEN(res.data, expect);
        }));

        it('shouldn´t Login the Admin and notice the user does not exist', mochaAsync(async () => {
            var res = await loginAdmin(BOILERPLATES.admins.UNKNOWN_USER_LOGIN);
            detectValidationErrors(res);
            shouldntLoginTheAdminAndNoticeTheUserDoesNotExist(res.data, expect);
        }));
        it('shouldn´t Login the Admin', mochaAsync(async () => {
            var res = await loginAdmin(BOILERPLATES.admins.WRONG_PASS_LOGIN_USER);
            detectValidationErrors(res);
            shouldntLoginTheAdmin(res.data, expect);
        }));
    });
})
