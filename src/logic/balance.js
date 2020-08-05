const _ = require('lodash');
import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';
import { AppRepository, BalanceRepository, CurrencyRepository } from '../db/repos';
import { throwError } from '../controllers/Errors/ErrorManager';

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
    __editAddonBalance: async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if(!app){throwError('APP_NOT_EXISTENT')}
            const currency = await CurrencyRepository.prototype.findById(params.currency);
            if(!currency){
                throwError("CURRENCY_NOT_EXISTENT");
            }
            return {...params, balance_id: app.addOn.balance._id};

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
            let balance = await self.save(params);
            return {
				...balance,
				type : 'balance'
			};
        } catch (err) {
            throw err;
        }
    },
    __editAddonBalance: async (params) => {
        await BalanceRepository.prototype.updateBalance(params.balance_id, params.currency, params.balance);
        return params;
    }
}

/**
 * Main Balance logic.
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
 * @property {Balance_model} model
 * @property {Balance_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class BalanceLogic extends LogicComponent {
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
	 * Validates Balance schema.
	 *
	 * @param {Balance} Balance
	 * @returns {Balance} Balance
	 * @throws {string} On schema.validate failure
	 */
    async objectNormalize(params, processAction) {
        try {
            switch (processAction) {
                case 'Register': {
                    return await library.process.__register(params); break;
                };
                case 'editAddonBalance': {
                    return await library.process.__editAddonBalance(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }

    /**
    * Tests Balance schema.
    *
    * @param {Balance} Balance
    * @returns {Balance} Balance
    * @throws {string} On schema.validate failure
    */

    testParams(params, action) {
        try {
            error.balance(params, action);
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
                case 'editAddonBalance': {
                    return await library.progress.__editAddonBalance(params); break;
                };
            }
        } catch (error) {
            throw error;
        }
    }
}

// Export Default Module
export default BalanceLogic;