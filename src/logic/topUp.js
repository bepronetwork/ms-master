import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';
import _ from 'lodash';
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
	__register : async (params) => {
		return params;
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
	__register : async (params) => {
		try{
            await self.save(params);
			return true;
		}catch(err){
			throw err;
		}
	}
}

/**
 * Main TopUp logic.
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
 * @property {TopUp_model} model
 * @property {TopUp_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class TopUpLogic extends LogicComponent {
	constructor(scope) {
		super(scope);
		self = this;
		__private = {
			//ADD
			db : scope.db,
			__normalizedSelf : null
		};

		library = {
			process : processActions,
			progress : progressActions
		}
    }


    /**
	 * Validates TopUp schema.
	 *
	 * @param {TopUp} TopUp
	 * @returns {TopUp} TopUp
	 * @throws {string} On schema.validate failure
	 */
	async objectNormalize(params, processAction) {
		try{			
			switch(processAction) {
				case 'Register' : {
					return library.process.__register(params); break;
				};
			}
		}catch(err){
			throw err;
		}
	}

	 /**
	 * Tests TopUp schema.
	 *
	 * @param {TopUp} TopUp
	 * @returns {TopUp} TopUp
	 * @throws {string} On schema.validate failure
	 */

	testParams(params, action){
		try{
			error.topUp(params, action);
		}catch(err){
			throw err;
		}
	}



	async progress(params, progressAction){
		try{			
			switch(progressAction) {
				case 'Register' : {
					return await library.progress.__register(params);
				}
			}
		}catch(err){
			throw err;
		}
	}
}

// Export Default Module
export default TopUpLogic;