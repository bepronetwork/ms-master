


const _ = require('lodash');
import { Security } from '../controllers/Security';
import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';
import { AdminsRepository, SecurityRepository, AppRepository } from '../db/repos';
import { throwError } from '../controllers/Errors/ErrorManager';
import MiddlewareSingleton from '../api/helpers/middleware';
import { mail } from '../mocks';
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
        if (!admin.security) { throwError() };
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
        if (!admin.security) { throwError() };

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
    __auth: async (params) => {
        // Get User by Username
        let admin = await __private.db.findAdminById(params.admin);
        if (!admin) { throwError('USER_NOT_EXISTENT') };
        if (!admin.security) { throwError() };
        let normalized = admin;
        return normalized;
    },
    __set2FA: async (params) => {
        // Get User by Username
        let admin = await __private.db.findAdminById(params.admin);

        if (!admin) { throwError('USER_NOT_EXISTENT') };
        if (!admin.security) { throwError() };

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
    __register: (params) => {
        // TO DO : Hash Password on Client Side
        let password = new Security(params.password).hash();
        let normalized = {
            username: params.username,
            name: params.name,
            hash_password: password,
            security: params.security,
            email: params.email
        }

        return normalized;
    }
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
        let bearerToken;
        if (params.app) {
            /* Create BearerToken for App */
            bearerToken = MiddlewareSingleton.sign(params.app._id);
            await AppRepository.prototype.createAPIToken(params.app._id, bearerToken);
        }

        return { ...params, app: { ...params.app, bearerToken } };
    },
    __login2FA: async (params) => {
        await SecurityRepository.prototype.setBearerToken(params.security_id, params.bearerToken);
        let bearerToken;
        if (params.app) {
            /* Create BearerToken for App */
            bearerToken = MiddlewareSingleton.sign(params.app._id);
            await AppRepository.prototype.createAPIToken(params.app._id, bearerToken);
        }
        return { ...params, app: { ...params.app, bearerToken } };
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
        let user = await self.save(params);
        let email = user.email;
        let attributes = {
            NOME: user.name
        }
        for (let templateJson of mail) {
            if (templateJson.template === "registerAdmin") {
                let templateId = templateJson.templateId;
                let listIds = templateJson.listIds;
                await SendInBlue.prototype.createContact(email, attributes, listIds);
                await SendInBlue.prototype.sendTemplate(templateId, [email]);
            }
        }
        return user
    }
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
                    return library.process.__register(params); break;
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


            }
        } catch (error) {
            throw error;
        }
    }
}

// Export Default Module
export default AdminLogic;