const _ = require('lodash');
import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';
import { AppRepository, ProviderRepository } from '../db/repos';
import { Security } from '../controllers/Security';
import { GoogleStorageSingleton } from './third-parties';
import axios from 'axios';
var md5 = require('md5');

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
    __register: async (params) => {
        return params;
    },
    __getGamesProvider: async (params) => {
        let listProviders = await ProviderRepository.prototype.findByApp(params.app);
        console.log("listProviders:: ", listProviders)
        let res = listProviders.map(async (provider) => {
            let listGames = await axios.get(`${provider.api_url}/GetListGames`, {
                partner_id: provider.partner_id,
                type: "web_slot",
                hash: md5("GetListGames/" + provider.partner_id + "web_slot" + provider.api_key)
            });
            console.log("ListGames:: ", listGames);
            return { name: provider.name, list: listGames };
        })
        return await Promise.all(res);
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
    __register: async (params) => {
        try {
            let logoURL;
            if (params.logo.includes("https")) {
                /* If it is a link already */
                logoURL = params.logo;
            } else {
                /* Does not have a Link and is a blob encoded64 */
                logoURL = await GoogleStorageSingleton.uploadFile({ bucketName: 'betprotocol-apps', file: params.logo });
            }
            params.api_key = Security.prototype.encryptData(params.api_key);
            params.logo = logoURL;
            let Provider = await self.save(params);
            await AppRepository.prototype.pushProvider(params.app, Provider);
            return {
                ...Provider,
                type: 'provider'
            };
        } catch (err) {
            throw err;
        }
    },
    __getGamesProvider: async (params) => {
        return params;
    }
}

/**
 * Main Provider logic.
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
 * @property {Provider_model} model
 * @property {Provider_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class ProviderLogic extends LogicComponent {
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
	 * Validates Provider schema.
	 *
	 * @param {Provider} Provider
	 * @returns {Provider} Provider
	 * @throws {string} On schema.validate failure
	 */
    async objectNormalize(params, processAction) {
        try {
            switch (processAction) {
                case 'Register': {
                    return await library.process.__register(params); break;
                };
                case 'GetGamesProvider': {
                    return await library.process.__getGamesProvider(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }

    /**
    * Tests Provider schema.
    *
    * @param {Provider} Provider
    * @returns {Provider} Provider
    * @throws {string} On schema.validate failure
    */

    testParams(params, action) {
        try {
            error.provider(params, action);
        } catch (err) {
            throw err;
        }
    }

    async progress(params, progressAction) {
        try {
            switch (progressAction) {
                case 'Register': {
                    return await library.progress.__register(params); break;
                };
                case 'GetGamesProvider': {
                    return await library.progress.__getGamesProvider(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }
}

// Export Default Module
export default ProviderLogic;