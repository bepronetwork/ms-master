const _ = require('lodash');
import { ErrorManager } from '../controllers/Errors';
import { throwError } from '../controllers/Errors/ErrorManager';
import { AppRepository, CurrencyRepository, FreeCurrencyRepository, UsersRepository, WalletsRepository } from '../db/repos';
import LogicComponent from './logicComponent';

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
    __editAddonFreeCurrency: async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if(!app){throwError('APP_NOT_EXISTENT')}
            const currency = await CurrencyRepository.prototype.findById(params.currency);
            if(!currency){
                throwError("CURRENCY_NOT_EXISTENT");
            }
            return {...params, freeCurrency_id: app.addOn.freeCurrency._id};

        }catch(err){
            throw err;
        }
    },
    __getAddonFreeCurrency: async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if(!app){throwError('APP_NOT_EXISTENT')}
            let user = await UsersRepository.prototype.findUserById(params.user, "wallet")
            if(!user){throwError('USER_NOT_EXISTENT')}
            let userWallet  = user.wallet.find((w)=>String(w.currency._id).toString()==String(params.currency).toString());
            let appWallet   = app.wallet.find((w)=>String(w.currency._id).toString()==String(params.currency).toString());
            const currency = await CurrencyRepository.prototype.findById(params.currency);
            if(!currency){
                throwError("CURRENCY_NOT_EXISTENT");
            }
            let freeCurrencyWallet = app.addOn.freeCurrency.wallets.find((w)=>String(w.currency).toString()==String(params.currency).toString());
            if(user.lastTimeCurrencyFree+freeCurrencyWallet.time > (new Date()).getTime()) {
                throwError("NO_FREE_CURRENCY");
            }
            return {
                freeCurrency : freeCurrencyWallet,
                userWallet,
                user,
                appWallet
            };
        }catch(err){
            throw err;
        }
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
            let freeCurrency = await self.save(params);
            return {
				...freeCurrency,
				type : 'freeCurrency'
			};
        } catch (err) {
            throw err;
        }
    },
    __editAddonFreeCurrency: async (params) => {
        await FreeCurrencyRepository.prototype.updateFreeCurrency(params.freeCurrency_id, params.currency, params);
        return params;
    },
    __getAddonFreeCurrency: async (params) => {
        try {
            let { freeCurrency, appWallet, userWallet, user } = params;
            await WalletsRepository.prototype.updatePlayBalance(appWallet._id, -freeCurrency.value);
            await WalletsRepository.prototype.updatePlayBalance(userWallet._id, freeCurrency.value);
            await UsersRepository.prototype.updateLastTimeCurrencyFree(user._id, (new Date()).getTime());

            return {value:freeCurrency.value};
        }catch(err){
            throw err;
        }
    }
}

/**
 * Main FreeCurrency logic.
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
 * @property {FreeCurrency_model} model
 * @property {FreeCurrency_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class FreeCurrencyLogic extends LogicComponent {
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
	 * Validates FreeCurrency schema.
	 *
	 * @param {FreeCurrency} FreeCurrency
	 * @returns {FreeCurrency} FreeCurrency
	 * @throws {string} On schema.validate failure
	 */
    async objectNormalize(params, processAction) {
        try {
            switch (processAction) {
                case 'Register': {
                    return await library.process.__register(params); break;
                };
                case 'EditAddonFreeCurrency': {
                    return await library.process.__editAddonFreeCurrency(params); break;
                };
                case 'GetAddonFreeCurrency': {
                    return await library.process.__getAddonFreeCurrency(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }

    /**
    * Tests FreeCurrency schema.
    *
    * @param {FreeCurrency} FreeCurrency
    * @returns {FreeCurrency} FreeCurrency
    * @throws {string} On schema.validate failure
    */

    testParams(params, action) {
        try {
            error.freeCurrency(params, action);
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
                case 'EditAddonFreeCurrency': {
                    return await library.progress.__editAddonFreeCurrency(params); break;
                };
                case 'GetAddonFreeCurrency': {
                    return await library.progress.__getAddonFreeCurrency(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }
}

// Export Default Module
export default FreeCurrencyLogic;