

import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';
import _ from 'lodash';
import { Banners, Color, Footer, Language, SubSections, TopBar, TopTab } from '../models';
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
            let { colors } = params;
            /* Save all Colors customization */
            let ids = await Promise.all(colors.map( async c => {
                return (await new Color(c).register())._doc._id;
            }));

            params.colors = ids;
			let languages = [ (await (new Language(
				{
					isActivated : true,
					prefix      : "EN",
					name        : "English",
					logo        : "https://i.ibb.co/HBxGmJ2/reino-unido.png"
				}
			)).register())._doc._id ];

			let topBar 		= (await (new TopBar({languages: [{language: languages[0]}]})).register())._doc._id;
			let banners 	= (await (new Banners({languages: [{language: languages[0]}]})).register())._doc._id;
			let subSections = (await (new SubSections({languages: [{language: languages[0]}]})).register())._doc._id;
			let footer 		= (await (new Footer({languages: [{language: languages[0]}]})).register())._doc._id;
			let topTab      = (await (new TopTab({
				languages : [{
					language: languages[0],
					ids: [
						{
							name: "Casino",
							icon: "https://i.ibb.co/h96g1bx/Casino.png",
							link_url: "/"
						}
					]
				}]
			})).register())._doc._id;

			console.log(topBar," 1 ", banners," 2 ", subSections," 3 ", footer," 4 ", topTab)

            let customization = await self.save({...params, languages, topBar, banners, subSections, footer, topTab});
			return {
				...customization,
				type : 'customization'
			};
		}catch(err){
			throw err;
		}
	}
}

/**
 * Main Customization logic.
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
 * @property {Customization_model} model
 * @property {Customization_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class CustomizationLogic extends LogicComponent {
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
	 * Validates Customization schema.
	 *
	 * @param {Customization} Customization
	 * @returns {Customization} Customization
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
	 * Tests Customization schema.
	 *
	 * @param {Customization} Customization
	 * @returns {Customization} Customization
	 * @throws {string} On schema.validate failure
	 */

	testParams(params, action){
		try{
			error.customization(params, action);
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
export default CustomizationLogic;