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
import {saveOutputTest} from '../outputTest/configOutput';


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
            saveOutputTest("AdminTesting","shouldRegisterTheAdmin",res.data);
            expect(res.data.status).to.equal(200);
        }));

        it('should login the Admin', mochaAsync(async () => {
            let res = await loginAdmin(BOILERPLATES.admins.NORMAL_LOGIN_USER);
            ADMIN_ID = res.data.message.id;
            saveOutputTest("AdminTesting","shouldLoginTheAdmin",res.data);
            expect(res.data.status).to.equal(200);
        }));

        it('should create the App', mochaAsync(async () => {
            let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID));
            var response = await registerApp(app_call_model);
            APP_ID = response.data.message.id;
            saveOutputTest("AdminTesting","shouldCreateTheApp",response.data);
            expect(response.data.status).to.equal(200);
            
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
            saveOutputTest("AdminTesting","shouldSet2FAForTheAdmin",res.data);
            expect(res.data.status).to.equal(200);
        }));

        it('should login the Admin', mochaAsync(async () => {
            let token = Security.prototype.generateToken2FA(SECRET);
            let res = await loginAdmin2FA({...BOILERPLATES.admins.NORMAL_LOGIN_USER,
                '2fa_token' : token
            });
            ADMIN_ID = res.data.message.id;
            saveOutputTest("AdminTesting","shouldLoginTheAdminFA",res.data);
            expect(res.data.status).to.equal(200);
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
            saveOutputTest("AdminTesting","shouldAuthForAdminBearerToken",res.data);
            expect(res.data.status).to.equal(200);
        }));

    
    });

    context('POST - Forbidden', async () => {

        it('shouldn´t login the Admin - WRONG TOKEN', mochaAsync(async () => {
            let res = await loginAdmin2FA({...BOILERPLATES.admins.NORMAL_LOGIN_USER,
                '2fa_token' : '345633',
                'admin_id' : ADMIN_ID
            });
            detectValidationErrors(res);
            saveOutputTest("AdminTesting","shouldntLoginTheAdminWRONGTOKEN",res.data);
            expect(res.data.status).to.equal(36);
        }));


        it('shouldn´t create an App for existing App on Admin', mochaAsync(async () => {
            let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID));
            var response = await registerApp(app_call_model);
            APP_ID = response.data.message.id;
            saveOutputTest("AdminTesting","shouldntCreateAnAppForExistingAppOnAdmin",response.data);
            expect(response.data.status).to.equal(38);
            
        }));

        it('shouldn´t login the Admin - NO TOKEN', mochaAsync(async () => {
            let res = await loginAdmin(BOILERPLATES.admins.NORMAL_LOGIN_USER);
            detectValidationErrors(res);
            saveOutputTest("AdminTesting","shouldntLoginTheAdminNOTOKEN",res.data);
            expect(res.data.status).to.equal(37);
        }));

        it('shouldn´t Login the Admin and notice the user does not exist', mochaAsync(async () => {
            var res = await loginAdmin(BOILERPLATES.admins.UNKNOWN_USER_LOGIN);
            detectValidationErrors(res);
            saveOutputTest("AdminTesting","shouldntLoginTheAdminAndNoticeTheUserDoesNotExist",res.data);
            expect(res.data.status).to.equal(4);
        }));
        it('shouldn´t Login the Admin', mochaAsync(async () => {
            var res = await loginAdmin(BOILERPLATES.admins.WRONG_PASS_LOGIN_USER);
            detectValidationErrors(res);
            saveOutputTest("AdminTesting","shouldntLoginTheAdmin",res.data);
            expect(res.data.status).to.equal(5);
        }));
    });
})
