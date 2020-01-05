import {
    registerUser,
    registerApp,
    loginAdmin,
    registerAdmin,
    loginUser,
    setUser2FA,
    loginUser2FA,
    authUser
} from '../../../methods';

import Security from '../../../../src/controllers/Security/Security';
import { detectValidationErrors } from '../../../utils';

import faker from 'faker';
import chai from 'chai';
import models from '../../../models';
import Random from '../../../tools/Random';
import {
    shouldntRegisterTheUser
} from "../../output/UserTestMethod"

const expect = chai.expect;

const genData = (faker, data) => JSON.parse(faker.fake(JSON.stringify(data)));

/* UTILS FUNCTIONS */

const runSetup = async (calls) => {
    for (const key of Object.values(calls)) {
        await key()
    }
}

var mochaAsync = (fn) => {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    };
};


const BOILERPLATES = global.BOILERPLATES;
const CONST = global.CONST;

context('Login & Register', async () => {
    var ADMIN_ID, APP_ID, userPostData, USER_ID, USER_ADDRESS, USER_BEARER_TOKEN, SECRET;

    it('🍳(setup)🍳', mochaAsync(async () => {

        await (async () => {

            const calls = {
                registerAdmin: async () => {
                    var res = await registerAdmin(BOILERPLATES.admins.NORMAL_REGISTER_2);
                    expect(res.data.status).to.equal(200);
                },
                loginAdmin: async () => {
                    var response_admin = await loginAdmin(BOILERPLATES.admins.NORMAL_REGISTER_2);
                    ADMIN_ID = response_admin.data.message.id;
                    return;
                },
                createApp: async () => {
                    let app_call_model = genData(faker, models.apps.app_normal_register(ADMIN_ID, CONST.ownerAccount.getAddress()));
                    var response = await registerApp(app_call_model);
                    APP_ID = response.data.message.id;
                    userPostData = genData(faker, models.users.normal_register('0x345634563456345', APP_ID));
                    return;
                },
                registerUser: async () => {
                    userPostData = genData(faker, models.users.normal_register('33y345345', APP_ID, {
                        username: 'Jac3messs234tss' + Math.floor(Math.random() * 34) + 18
                    }));
                    let response = await registerUser(userPostData);
                    USER_ID = response.data.message._id;
                    return;
                }
            }
            try {
                await runSetup(calls);
                expect(true).to.equal(true);
                return true;
            } catch (err) {
                console.log(err)
                console.log("Error")
            }
        })()
    }));

    it('should register the User', mochaAsync(async () => {
        userPostData = genData(faker, models.users.normal_register('687678i678im' + Math.floor(Math.random() * 60) + 18, APP_ID, {
            username: '678im67im' + Random(10000, 23409234235463456)
        }));
        var res = await registerUser(userPostData);
        USER_ID = res.data.message._id;
        expect(res.data.status).to.equal(200);
    }));

    it('should´nt register the user', mochaAsync(async () => {
        var res = await registerUser(userPostData);
        shouldntRegisterTheUser(res.data, expect);
    }));

    it('should login the User', mochaAsync(async () => {
        var res = await loginUser(userPostData);
        USER_BEARER_TOKEN = res.data.message.bearerToken;
        expect(res.data.status).to.equal(200);
    }));

    it('should set 2FA for the User', mochaAsync(async () => {
        let res_login = await loginUser(userPostData);
        USER_ID = res_login.data.message.id;
        USER_BEARER_TOKEN = res_login.data.message.bearerToken;
        let secret = Security.prototype.generateSecret2FA({ name: 'BetProtocol', account_id: USER_ID });
        SECRET = secret;
        let token = Security.prototype.generateToken2FA(secret);
        var res = await setUser2FA({
            '2fa_secret': secret,
            '2fa_token': token,
            user: USER_ID
        }, USER_BEARER_TOKEN, { id: USER_ID });
        expect(res.data.status).to.equal(200);
    }));


    it('should´t login the User with password without 2FA Login', mochaAsync(async () => {
        var res = await loginUser(userPostData);
        expect(res.data.status).to.equal(37);
    }));

    it('should login the User2FA', mochaAsync(async () => {
        let token = Security.prototype.generateToken2FA(SECRET);
        let res = await loginUser2FA({
            ...userPostData,
            '2fa_token': token
        });
        USER_ID = res.data.message._id;
        expect(res.data.status).to.equal(200);
    }));

    it('should auth for User - BearerToken', mochaAsync(async () => {
        let token = Security.prototype.generateToken2FA(SECRET);
        let res = await loginUser2FA({...userPostData,
            '2fa_token' : token
        });
        USER_ID = res.data.message.id;
        USER_BEARER_TOKEN = res.data.message.bearerToken;

        res = await authUser({
            user : USER_ID
        }, USER_BEARER_TOKEN, { id : USER_ID});

        expect(res.data.status).to.equal(200);
    }));

    it('shouldn´t login the User - WRONG TOKEN', mochaAsync(async () => {
        let res = await loginUser2FA({...userPostData,
            '2fa_token' : '345633',
            'user_id' : USER_ID
        });
        detectValidationErrors(res);
        expect(res.data.status).to.equal(36);
    }));

    it('shouldn´t login the User - NO TOKEN', mochaAsync(async () => {
        let res = await loginUser2FA({...userPostData,
            '2fa_token' : 'null',
            'user_id' : USER_ID
        });
        detectValidationErrors(res);
        expect(res.data.status).to.equal(36);
    }));

    it('shouldn´t Login the User and notice the user does not exist', mochaAsync(async () => {
        var res = await loginUser(BOILERPLATES.users.UNKNOWN_USER_LOGIN);
        detectValidationErrors(res);
        expect(res.data.status).to.equal(4);
    }));

    it('shouldn´t Login the User - WRONG PASSWORD', mochaAsync(async () => {
        let res = await loginUser({...userPostData,
            'password' : 'null',
            'user_id' : USER_ID
        });
        detectValidationErrors(res);
        expect(res.data.status).to.equal(37);
    }));
});

