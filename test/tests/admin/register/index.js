import {
    registerAdmin,
    loginAdmin,
    authAdmin,
    loginAdmin2FA,
    setAdmin2FA,
    getAppUsersBets
} from '../../../methods';

import chai from 'chai';
import Security from '../../../../src/controllers/Security/Security';
import { detectValidationErrors, mochaAsync } from '../../../utils';
import { mail } from "../../../../src/mocks";

import {
    shouldRegisterTheAdmin,
    shouldLoginTheAdmin,
    shouldSet2FAForTheAdmin,
    shouldLoginTheAdminFA,
    shouldAuthForAdminBearerToken,
    shouldntLoginTheAdminWRONGTOKEN,
    shouldntLoginTheAdminNOTOKEN,
    shouldntLoginTheAdminAndNoticeTheUserDoesNotExist,
    shouldntLoginTheAdmin
} from '../../output/AdminTestMethod'
import { SendinBlueSingleton } from '../../../../src/logic/third-parties/sendInBlue';

const expect = chai.expect;

/* TESTS */
const BOILERPLATES = global.BOILERPLATES;

// Admin Normal Registering
context('Register', async () => {

    var ADMIN_ID, BEARER_TOKEN, SECRET;

    it('should register the Admin', mochaAsync(async () => {
        var res = await registerAdmin(BOILERPLATES.admins.NORMAL_REGISTER);
        detectValidationErrors(res);
        shouldRegisterTheAdmin(res.data, expect);
    }));

    it('shouldnt register the Admin - Email Already Exists', mochaAsync(async () => {
        var res = await registerAdmin(BOILERPLATES.admins.NORMAL_REGISTER);
        detectValidationErrors(res);
        expect(res.data.status).to.equal(8);
    }));

    it('shouldnt register the Admin - Username Already Exists', mochaAsync(async () => {
        BOILERPLATES.admins.NORMAL_REGISTER.email = `${new Date().getTime()}be@gmail.com`;
        var res = await registerAdmin(BOILERPLATES.admins.NORMAL_REGISTER);
        detectValidationErrors(res);
        expect(res.data.status).to.equal(54);
    }));

    it('Shouldnt create a contact that already exists', mochaAsync(async () => {
        try {
            let admin = BOILERPLATES.admins.NORMAL_REGISTER;
            const email = admin.email;
            const attributes = {
                NAME: admin.name
            };
            let listIds = mail.registerAdmin.listIds;
            await SendinBlueSingleton.createContact(email, attributes, listIds);
        } catch (err) {
            expect(err.status).to.equal(400);
        }
    }));

    it('should login the Admin with username', mochaAsync(async () => {
        let admin = BOILERPLATES.admins.NORMAL_LOGIN_USER;
        let res = await loginAdmin({username : admin.username, password : admin.password});
        detectValidationErrors(res);
        shouldLoginTheAdmin(res.data, expect);
        global.test.admin = res.message;
    }));

    it('should login the Admin with email', mochaAsync(async () => {
        let admin = BOILERPLATES.admins.NORMAL_LOGIN_USER;
        let res = await loginAdmin({username : admin.email, password : admin.password});
        detectValidationErrors(res);
        shouldLoginTheAdmin(res.data, expect);
        global.test.admin = res.message;
    }));

    it('should set 2FA for the Admin', mochaAsync(async () => {
        let res_login = await loginAdmin(BOILERPLATES.admins.NORMAL_LOGIN_USER);
        ADMIN_ID = res_login.data.message.id;
        BEARER_TOKEN = res_login.data.message.bearerToken;
        let secret = Security.prototype.generateSecret2FA({ name: 'BetProtocol', account_id: ADMIN_ID });
        SECRET = secret;
        let token = Security.prototype.generateToken2FA(secret);
        var res = await setAdmin2FA({
            '2fa_secret': secret,
            '2fa_token': token,
            admin: ADMIN_ID
        }, BEARER_TOKEN, { id: ADMIN_ID });
        detectValidationErrors(res);
        shouldSet2FAForTheAdmin(res.data, expect);
    }));

    it('should login the Admin', mochaAsync(async () => {
        let token = Security.prototype.generateToken2FA(SECRET);
        let res = await loginAdmin2FA({
            ...BOILERPLATES.admins.NORMAL_LOGIN_USER,
            '2fa_token': token
        });
        ADMIN_ID = res.data.message.id;
        detectValidationErrors(res);
        shouldLoginTheAdminFA(res.data, expect);
    }));


    it('should auth for Admin - BearerToken', mochaAsync(async () => {
        let token = Security.prototype.generateToken2FA(SECRET);
        let res = await loginAdmin2FA({
            ...BOILERPLATES.admins.NORMAL_LOGIN_USER,
            '2fa_token': token
        });
        ADMIN_ID = res.data.message.id;
        BEARER_TOKEN = res.data.message.bearerToken;
        res = await authAdmin({
            admin: ADMIN_ID
        }, BEARER_TOKEN, { id: ADMIN_ID });
        detectValidationErrors(res);
        global.test.admin = res.data.message;
        shouldAuthForAdminBearerToken(res.data, expect);
    }));

    it('shouldn´t login the Admin - WRONG TOKEN', mochaAsync(async () => {
        let res = await loginAdmin2FA({
            ...BOILERPLATES.admins.NORMAL_LOGIN_USER,
            '2fa_token': '345633',
            'admin_id': ADMIN_ID
        });
        detectValidationErrors(res);
        shouldntLoginTheAdminWRONGTOKEN(res.data, expect);
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

    it('should get All App Bets', mochaAsync(async () => {
        let res = await getAppUsersBets({"app": "5e48d6a928c1af0021c366d6", "admin": "5e48d69228c1af0021c366c2"}, "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU0OGQ2OTIyOGMxYWYwMDIxYzM2NmMyIiwidGltZSI6MTU4OTIzNTk4NzEzOSwiaWF0IjoxNTg2NjQzOTg3fQ.oo_fjK3BaD98Gl6xQFgw3zeyQL9GnIQhPInq_MFUDs_yMsNaDYYvmjAwvf3n21w1DOhHAA8FcVk76blWrixKjw", {"id" : "5e48d69228c1af0021c366c2"});
        detectValidationErrors(res);
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));

    it('should Get User Bets', mochaAsync(async () => {
        let res = await getUserBetsByPipeline({"user": "5e5bfd189517230021a8c99a"}, "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkF1dGgvNWU1YmZkMTg5NTE3MjMwMDIxYThjOTlhIiwidGltZSI6MTU4ODg2MjIxMzUwOCwiaWF0IjoxNTg2MjcwMjEzfQ.ctt_9Mh00ymId6h7xhJ1jyvMZ7vnufeiZ1nv7OXhKbS15SNIXK5CHn2dLcfGumJTdsakOFMJXzn4XqHQfgfUyQ", {"id" : "5e5bfd189517230021a8c99a"});
        expect(res.data.status).to.not.null;
        expect(res.data.status).to.equal(200);
    }));
})
