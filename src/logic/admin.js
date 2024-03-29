const _ = require('lodash');
import { Security } from '../controllers/Security';
import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';
import { SecurityRepository, AppRepository, PermissionRepository, AdminsRepository, TokenRepository } from '../db/repos';
import { throwError } from '../controllers/Errors/ErrorManager';
import MiddlewareSingleton from '../api/helpers/middleware';
import { mail } from '../mocks';
import { SENDINBLUE_EMAIL_TO } from '../config';
import { SendinBlueSingleton } from './third-parties/sendInBlue';
import { GenerateLink } from '../helpers/generateLink';
import { Token } from '../models';
let error = new ErrorManager();


// Private fields
let self; // eslint-disable-line no-unused-vars
let library;
let modules;

let __private = {};


/**
 * Login logic.
 *
 * @class
 * @memberof logic
 * @param {function} params - Function Params
 **/


const processActions = {
    __login: async (params) => {
        // Get User by Username
        let admin = await __private.db.findAdmin(params.username);
        if (!admin) { throwError('USER_NOT_EXISTENT') };
        if (admin.registered === false) { throwError('UNKNOWN') };
        if (!admin.security) { throwError('UNKNOWN') };
        let has2FASet = admin.security['2fa_set'];
        let bearerToken = MiddlewareSingleton.sign(admin._id);
        let normalized = {
            has2FASet,
            bearerToken,
            username: admin.username,
            password: params.password,
            security_id: admin.security._id,
            verifiedAccount: Security.prototype.unhashPassword(params.password, admin.hash_password),
            ...admin
        }

        return normalized;
    },
    __login2FA: async (params) => {
        // Get User by Username
        let admin = await __private.db.findAdmin(params.username);

        if (!admin) { throwError('USER_NOT_EXISTENT') };
        if (!admin.security) { throwError('UNKNOWN') };

        var has2FASet = admin.security['2fa_set'];
        var secret2FA = admin.security['2fa_secret'];

        // is 2FA not Setup
        if ((!has2FASet) || (!secret2FA)) { throwError('USER_HAS_2FA_DEACTIVATED') }

        let isVerifiedToken2FA = (new Security()).isVerifiedToken2FA({
            secret: secret2FA,
            token: params['2fa_token']
        });

        let bearerToken = MiddlewareSingleton.sign(admin._id);

        let normalized = {
            has2FASet,
            secret2FA,
            bearerToken,
            isVerifiedToken2FA,
            username: admin.username,
            password: params.password,
            security_id: admin.security._id,
            verifiedAccount: Security.prototype.unhashPassword(params.password, admin.hash_password),
            ...admin
        }

        return normalized;
    },
    __getAdminAll: async (params) => {
        let app = await AppRepository.prototype.findAppById(params.app, "simple");
        let res = await __private.db.findAdminByApp(app._id);
        return res;
    },
    __auth: async (params) => {
        // Get User by Username
        let admin = await __private.db.findAdminById(params.admin);

        if (!admin) { throwError('USER_NOT_EXISTENT') };
        if (!admin.security) { throwError('UNKNOWN') };
        let normalized = admin;
        return normalized;
    },
    __set2FA: async (params) => {
        // Get User by Username
        let admin = await __private.db.findAdminById(params.admin);

        if (!admin) { throwError('USER_NOT_EXISTENT') };
        if (!admin.security) { throwError('UNKNOWN') };

        let isVerifiedToken2FA = (new Security()).isVerifiedToken2FA({
            secret: params['2fa_secret'],
            token: params['2fa_token']
        })


        let normalized = {
            newSecret: params['2fa_secret'],
            username: admin.username,
            isVerifiedToken2FA,
            admin_id: params.admin,
            security_id: admin.security._id,
            ...admin
        }

        return normalized;
    },
    __register: async (params) => {

        let admin = await __private.db.findAdminEmail(params.email);
        let adminUsername = await __private.db.findAdminUsername(params.username);
        let registered = false;
        let newBearerToken;
        if (!admin && !adminUsername) { registered = true }
        if (admin && admin.registered === true) { throwError('ALREADY_EXISTING_EMAIL') }
        if (adminUsername && adminUsername.registered === true) { throwError('USERNAME_ALREADY_EXISTS') }
        if (admin != null && admin.security != null && admin.security != undefined) {
            const payload = MiddlewareSingleton.resultTokenDate(params.bearerToken);
            if (!payload) {
                throwError('TOKEN_EXPIRED');
            }
            if (Number((new Date()).getTime()) > Number(payload.time)) {
                throwError('TOKEN_EXPIRED');
            }
            if (String(admin.security.bearerToken) !== String(params.bearerToken)) {
                throwError('TOKEN_INVALID');
            }
            newBearerToken = MiddlewareSingleton.sign(admin._id);
            params.permission.super_admin = false;
        }
        let password = new Security(params.password).hash();

        let normalized = {
            newBearerToken,
            username: params.username,
            name: params.name,
            hash_password: password,
            security: params.security,
            email: params.email,
            registered: registered,
            permission: params.permission
        }
        return normalized;
    },
    __addAdmin: async (params) => {
        let admin = await __private.db.findAdminById(params.admin);
        if (!admin) { throwError('USER_NOT_EXISTENT') };
        let app = await AppRepository.prototype.findAppById(admin.app._id, "simple");
        if (!app) { throwError('USER_NOT_EXISTENT') };
        if (String(app._id) !== String(params.app)) { throwError('APP_INVALID') };
        let adminEmail = (await __private.db.findAdminEmail(params.email));
        if (adminEmail && adminEmail.registered === true) { throwError('UNKNOWN') }
        let bearerToken = MiddlewareSingleton.generateTokenDate((new Date(((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000))).getTime());
        let password = new Security(String((new Date()).getTime())).hash();
        let permissionObject = await PermissionRepository.prototype.findById(params.permission)
        let normalized = {
            adminEmail: adminEmail,
            username: `user${params.admin}${String((new Date()).getTime())}`,
            name: 'nameTMP',
            hash_password: password,
            security: params.security,
            email: params.email,
            app: admin.app,
            bearerToken: bearerToken,
            registered: false,
            permission: permissionObject
        }
        return normalized;
    },

    __editAdminType: async (params) => {
        let admin = await __private.db.findAdminById(params.admin);
        if (!admin) { throwError('USER_NOT_EXISTENT') };
        let app = await AppRepository.prototype.findAppById(admin.app._id, "simple");
        if (!app) { throwError('APP_NOT_EXISTENT') };
        const adminFind = app.listAdmins.find(a => new String(a).toString() == new String(params.adminToModify).toString())
        let adminToChangeType = await __private.db.findAdminById(adminFind);
        if (!adminFind) { throwError('USER_NOT_EXISTENT') };
        let permissionObject = {
            ...params.permission,
            _id: adminToChangeType.permission._id
        }
        let normalized = {
            admin: adminFind,
            permission: permissionObject
        }
        return normalized;
    },
    __resetAdminPassword: async (params) => {
        try {
            const admin = await __private.db.findAdmin(params.username_or_email);
            if (!admin) { throwError("USERNAME_OR_EMAIL_NOT_EXISTS"); }

            var app = await AppRepository.prototype.findAppById(admin.app, "simple");
            if (!app) { throwError("APP_NOT_EXISTENT"); }


            let normalized = {
                name: admin.name,
                admin: admin,
                app: app,
                admin_id: admin._id,
                url: SENDINBLUE_EMAIL_TO
            };
            return normalized;
        } catch (error) {
            throw error;
        }
    },
    __setAdminPassword: async (params) => {
        const payload = MiddlewareSingleton.resultTokenDate(params.token);
        if (!payload) {
            throwError('TOKEN_INVALID');
        }

        if (Number((new Date()).getTime()) > Number(payload.time)) {
            throwError('TOKEN_EXPIRED');
        }
        const findToken = await TokenRepository.prototype.findByToken(params.token);

        if (!findToken || (String(findToken.admin) !== String(params.admin_id))) {
            throwError('TOKEN_INVALID');
        }

        let hash_password = new Security(params.password).hash();

        let normalized = {
            admin_id: params.admin_id,
            hash_password
        }

        return normalized;
    },
}

/**
 * Login logic.
 *
 * @class progressActions
 * @memberof logic
 * @param {function} params - Function Params
 **/

const progressActions = {
    __login: async (params) => {
        await SecurityRepository.prototype.setBearerToken(params.security_id, params.bearerToken);
        return { ...params, app: { ...params.app, bearerToken: params.bearerToken } };
    },
    __login2FA: async (params) => {
        await SecurityRepository.prototype.setBearerToken(params.security_id, params.bearerToken);
        return { ...params, app: { ...params.app, bearerToken: params.bearerToken } };
    },
    __getAdminAll: async (params) => {
        return params;
    },
    __auth: async (params) => {
        return params;
    },
    __set2FA: async (params) => {
        let {
            newSecret,
            security_id
        } = params;
        //Add new Secret
        await SecurityRepository.prototype.addSecret2FA(security_id, newSecret);
        return params;
    },
    __register: async (params) => {
        let admin = null;
        let email = params.email;
        let listIds = mail.registerAdmin.listIds;
        let templateId = mail.registerAdmin.templateId;
        let attributes = {
            NOME: params.name
        };
        if (params.registered === true) {
            admin = await self.save(params);
            SendinBlueSingleton.createContact(email, attributes, listIds);
        } else {
            delete params["security"];
            params.registered = true;
            admin = await __private.db.updateAdmin(params);
            await AppRepository.prototype.addAdmin(String(admin.app._id), admin);
            await SecurityRepository.prototype.setBearerToken(admin.security._id, params.newBearerToken);
        }
        SendinBlueSingleton.sendTemplate(templateId, [email]);
        return admin
    },
    __addAdmin: async (params) => {
        let attributes = {
            NOME: params.name,
            TOKEN: params.bearerToken,
            APP: params.app._id,
            URL: SENDINBLUE_EMAIL_TO
        };
        let resultAdmin;
        let email = params.email;
        let templateId = mail.multiplesAdmins.templateId;
        let listIds = mail.multiplesAdmins.listIds;
        let securityId;

        if (!params.adminEmail) {
            delete params['adminEmail'];
            resultAdmin = await self.save(params);
            securityId = String(resultAdmin.security);
            SendinBlueSingleton.createContact(email, attributes, listIds);
        } else {
            resultAdmin = params.adminEmail;
            securityId = String(resultAdmin.security._id);
            SendinBlueSingleton.updateContact(email, attributes);
        }
        await SecurityRepository.prototype.setBearerToken(securityId, params.bearerToken);
        let admin = await __private.db.findAdminById(resultAdmin._id);
        SendinBlueSingleton.sendTemplate(templateId, [email]);
        return admin
    },
    __editAdminType: async (params) => {
        await PermissionRepository.prototype.findByIdAndUpdate(params.permission._id, params.permission);
        return params;
    },
    __resetAdminPassword: async (params) => {
        const { admin_id, url, admin } = params;
        let email = admin.email;
        let templateId = mail.resetPassword.templateId;
        //expires in 1 days
        let bearerToken = MiddlewareSingleton.generateTokenDate((new Date(((new Date()).getTime() + 1 * 24 * 60 * 60 * 1000))).getTime());

        await (new Token({ admin: admin._id, token: bearerToken })).register();

        let attributes = {
            TOKEN: bearerToken,
            URL: GenerateLink.resetAdminPassword([url, bearerToken, admin_id])
        };
        SendinBlueSingleton.updateContact(email, attributes);
        SendinBlueSingleton.sendTemplate(templateId, [email]);
        return true;
    },
    __setAdminPassword: async (params) => {
        const { admin_id, hash_password } = params;

        let updatePassword = await AdminsRepository.prototype.updatePasswordAdmin({ id: admin_id, param: { hash_password } });

        if (!updatePassword) {
            throwError('UNKNOWN');
        }
        return true;
    },
}

/**
 * Main user logic.
 *
 * @class
 * @memberof logic
 * @see Parent: {@link logic}
 * @requires lodash
 * @requires helpers/sort_by
 * @requires helpers/bignum
 * @requires logic/block_reward
 * @param {Database} db
 * @param {ZSchema} schema
 * @param {Object} logger
 * @param {function} cb - Callback function
 * @property {user_model} model
 * @property {user_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class AdminLogic extends LogicComponent {
    constructor(scope) {
        super(scope);
        self = this;
        __private = {
            //ADD
            db: scope.db,
            __normalizedSelf: null
        };

        library = {
            process: processActions,
            progress: progressActions
        }
    }


    /**
	 * Validates user schema.
	 *
	 * @param {user} user
	 * @returns {user} user
	 * @throws {string} On schema.validate failure
	 */
    async objectNormalize(params, processAction) {
        try {
            switch (processAction) {
                case 'Login': {
                    return await library.process.__login(params); break;
                };
                case 'Login2FA': {
                    return await library.process.__login2FA(params);
                };
                case 'Auth': {
                    return await library.process.__auth(params);
                };
                case 'Set2FA': {
                    return await library.process.__set2FA(params);
                };
                case 'Register': {
                    return await library.process.__register(params); break;
                };
                case 'AddAdmin': {
                    return await library.process.__addAdmin(params); break;
                };
                case 'EditAdminType': {
                    return await library.process.__editAdminType(params); break;
                };
                case 'GetAdminAll': {
                    return await library.process.__getAdminAll(params); break;
                };
                case 'ResetAdminPassword': {
                    return await library.process.__resetAdminPassword(params); break;
                };
                case 'SetAdminPassword': {
                    return await library.process.__setAdminPassword(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }

    /**
    * Tests user schema.
    *
    * @param {user} user
    * @returns {user} user
    * @throws {string} On schema.validate failure
    */

    testParams(params, action) {
        try {
            error.admin(params, action);
        } catch (err) {
            throw err;
        }
    }


    async progress(params, progressAction) {
        try {
            switch (progressAction) {
                case 'Login': {
                    return await library.progress.__login(params);
                };
                case 'Login2FA': {
                    return await library.progress.__login2FA(params);
                };
                case 'Auth': {
                    return await library.progress.__auth(params);
                };
                case 'Set2FA': {
                    return await library.progress.__set2FA(params);
                };
                case 'Register': {
                    return await library.progress.__register(params);
                };
                case 'AddAdmin': {
                    return await library.progress.__addAdmin(params);
                };
                case 'EditAdminType': {
                    return await library.progress.__editAdminType(params); break;
                };
                case 'GetAdminAll': {
                    return await library.progress.__getAdminAll(params);
                };
                case 'ResetAdminPassword': {
                    return await library.progress.__resetAdminPassword(params); break;
                };
                case 'SetAdminPassword': {
                    return await library.progress.__setAdminPassword(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }
}

// Export Default Module
export default AdminLogic;