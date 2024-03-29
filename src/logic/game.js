const _ = require('lodash');
import { ErrorManager } from '../controllers/Errors';
import { AppRepository, GamesRepository } from '../db/repos';
import LogicComponent from './logicComponent';
import { ResultSpace } from '../models';
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

		let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app)

		let normalized = {
			name: params.name,
			edge: params.edge,
			app: app._id,
			resultSpace: params.resultSpace,
			betSystem: params.betSystem,
			timestamp: new Date(),
			image_url: params.image_url,
			metaName: params.metaName,
			rules: params.rules,
			description: params.description,
			metadataJSON: params.metadataJSON,
			wallets: params.wallets
		}

		return normalized;
	},
	__get: async (params) => {

		let game = await GamesRepository.prototype.findGameById(params.id)

		let normalized = {
			name: game.name,
			description: game.description,
			edge: game.edge,
			events: game.events,
			rules: game.rules
		}

		return normalized;
	},

	__setMaxBet: async (params) => {
		let app = await AppRepository.prototype.findAppById(params.app, "simple");
		if(!app){throwError('APP_NOT_EXISTENT')}
		let game = app.games.find(g => g._id == params.game);
		if(!game){throwError('GAME_NOT_EXISTENT')}
		let normalized = {
			maxBet: params.maxBet,
			game: game._id
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
	__register: async (params) => {
		let dependentObjects = params.resultSpace.map(async resultSpace => {
			let resultSpaceObject = new ResultSpace(resultSpace);
			return await resultSpaceObject.register();
		});
		let resultSpacesIds = await Promise.all(dependentObjects);
		// Generate new Params Setup

		params = {
			...params,
			resultSpace: resultSpacesIds
		}
		let game = await self.save(params);

		await AppRepository.prototype.addGame(params.app, game);

		return game;
	},
	
	__get: async (params) => {
		return params
	},

	__setMaxBet: async (params) => {
		let game = await GamesRepository.prototype.setMaxBet(params);
		return game;
	}
	// TO DO : Create Resolve Part
}
/**
 * Main Game logic.
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
 * @property {Game_model} model
 * @property {Game_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class GameLogic extends LogicComponent {
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
	 * Validates Game schema.
	 *
	 * @param {Game} Game
	 * @returns {Game} Game
	 * @throws {string} On schema.validate failure
	 */
	async objectNormalize(params, processAction) {
		try {
			switch (processAction) {
				case 'Register': {
					return await library.process.__register(params);
				};
				case 'Get': {
					return await library.process.__get(params);
				};
				case 'SetMaxBet': {
					return await library.process.__setMaxBet(params);
				};
			}
		} catch (report) {
			throw `Failed to validate game schema: game \n See Stack Trace : ${report}`;
		}
	}

	/**
	* Tests game schema.
	*
	* @param {game} game
	* @returns {game} game
	* @throws {string} On schema.validate failure
	*/

	testParams(params, action) {
		try {
			error.game(params, action);
		} catch (err) {
			throw err;
		}
	}

	async progress(params, progressAction) {
		try {
			switch (progressAction) {
				case 'Register': {
					return await library.progress.__register(params);
				};
				case 'Get': {
					return await library.progress.__get(params);
				};
				case 'SetMaxBet': {
					return await library.progress.__setMaxBet(params);
				};
			}
		} catch (report) {
			throw `Failed to validate user schema: User \n See Stack Trace : ${report}`;
		}
	}
}

// Export Default Module
export default GameLogic;