const _ = require('lodash');
import { ErrorManager } from '../controllers/Errors';
import { AppRepository, GamesRepository, EventsRepository } from '../db/repos';
import LogicComponent from './logicComponent';
import { ResultSpace, Bet } from '../models';
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

		//Get App by Name
		let app = await AppRepository.prototype.findAppById(params.app);
        //Get App by Name
        let game = await GamesRepository.prototype.findGameById(params.game);

		// TO DO : Check the Type of ResultSpace and all the fields
		let normalized = {
			app           	    : app._id,
            game                : game._id,            // Unilateral
            // Event Data
            resultSpace         : params.resultSpace,
            betSystem           : params.betSystem,
            timestamp           : new Date(),
            description         : params.description,
            metadataJSON        : params.metadataJSON
		}

		return normalized;
    },
    __resolve : async  (params) => {
      
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
        // Save Result Spaces
        let dependentObjects = params.resultSpace.map( async item => {
            let resultSpaceObject = new ResultSpace(item);
            return await resultSpaceObject.register();
        });
        let resultSpacesIds = await Promise.all(dependentObjects);
        // Generate new Params Setup
        params = {
            ...params,
            resultSpace : resultSpacesIds
        }
        // Save Event Item
        let event = await self.save(params);
        // Add Event Item to Game Selected
        await GamesRepository.prototype.addEvent(params.game, event);
        return event;
	},
	__resolve : async (params) => {

        let {
            event,
            outcome
        } = params;

        // Resolve Event
        let eventObject = await EventsRepository.prototype.resolveEvent(event, {result : outcome});

        // Resolve All Bets Dependent on this Event
        let betsResolvingPromises = eventObject.bets.map( async bet => {
            let params = { bet, outcome } 
            let betObject = new Bet(params);
            return await betObject.resolve();
        });

        await Promise.all(betsResolvingPromises);
		return params;
	}
}

/**
 * Main Event logic.
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
 * @property {event_model} model
 * @property {event_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class EventLogic extends LogicComponent {
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
	 * Validates event schema.
	 *
	 * @param {event} event
	 * @returns {event} event
	 * @throws {string} On schema.validate failure
	 */
	async objectNormalize(params, processAction) {
		try{			
			switch(processAction) {
				case 'Register' : {
					return await library.process.__register(params); break;
                }
                case 'Resolve' : {
					return await library.process.__resolve(params); break;
				}
			}
		}catch(report){
			throw `Failed to validate event schema: event \n See Stack Trace : ${report}`;
		}
	}

	 /**
	 * Tests event schema.
	 *
	 * @param {event} event
	 * @returns {event} event
	 * @throws {string} On schema.validate failure
	 */

	testParams(params, action){
		try{
			error.event(params, action);
		}catch(err){
			throw err;
		}
    }
    

	async progress(params, progressAction){
		try{			
			switch(progressAction) {
				case 'Register' : {
					return await library.progress.__register(params); break;
				};
				case 'Resolve' : {
					return await library.progress.__resolve(params); break;
				};
			}
		}catch(report){
			throw `Failed to validate user schema: User \n See Stack Trace : ${report}`;
		}
	}
}

// Export Default Module
export default EventLogic;