const _ = require('lodash');
import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';
import { AppRepository, AddOnRepository, JackpotRepository, WalletsRepository, UsersRepository, GamesRepository } from '../db/repos';
import CasinoLogicSingleton from './utils/casino';
import { CryptographySingleton } from '../controllers/Helpers';
import MathSingleton from './utils/math';
import PusherSingleton from './third-parties/pusher';

let error = new ErrorManager();


// Private fields
let self; // eslint-disable-line no-unused-vars
let library;
let modules;

let __private = {};


const betJackpotActions = {
	calculateWin: ({userResultSpace, outcomeResultSpace}) => {
    	try {
			var el = userResultSpace.find( object => parseInt(object.place) == parseInt(outcomeResultSpace.index));
			const isWon = (!el) ? false : true;
            return {
                isWon
            }
        }catch(err){
            throw err;
        }
    },
    auto : (params) => {
		var hmca_hash, outcome, isWon, outcomeResultSpace;

		hmca_hash = CryptographySingleton.generateRandomResult(params.serverSeed, params.clientSeed, params.nonce),
		outcome = CryptographySingleton.hexToInt(hmca_hash)
        outcomeResultSpace 	= CasinoLogicSingleton.fromOutcometoResultSpace(outcome, params.resultSpace)

        var { isWon } = betJackpotActions.calculateWin({
            userResultSpace : params.result,
            outcomeResultSpace : outcomeResultSpace
        });

        return { outcomeResultSpace, isWon, outcome, hmca_hash };
    }
}




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
	},
	__percentage : async (params) => {
		let user 	= await UsersRepository.prototype.findUserById(params.user);
		let app  	= await AppRepository.prototype.findAppById(user.app_id);
		if(app.addOn.jackpot==undefined){
			return {res: params};
		}
		let jackpot = await JackpotRepository.prototype.findJackpotById(app.addOn.jackpot);
		if(!jackpot) {
			return {res: params};
		}

		let result = params.result.map(r => {
			return {
				place: r.place,
				value: (parseFloat(r.value) * parseFloat(jackpot.edge) * 0.01)
			};
		});

		return {
			result
		};
	},
	__normalizeSpaceResult : async (params) => {

		let user 	= await UsersRepository.prototype.findUserById(params.user);
		let app  	= await AppRepository.prototype.findAppById(user.app_id);
		if(app.addOn.jackpot==undefined){
			return {res: params};
		}
		let jackpot = await JackpotRepository.prototype.findJackpotById(app.addOn.jackpot);
		if(!jackpot) {
			return {res: params};
		}

		let result = params.result.map(r => {
			return {
				place: r.place,
				value: (parseFloat(r.value) * (100 - parseFloat(jackpot.edge)) * 0.01)
			};
		});

		params.result = result;

		return {
			res: params
		};
	},
	__bet : async (params) => {
		try{
            const { currency } = params;

            let user = await UsersRepository.prototype.findUserById(params.user);
			let app  = await AppRepository.prototype.findAppById(user.app_id);

			/* Get balance by wallet type */
			const userWallet = user.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());

            /* No Mapping Error Verification */
            if(!app || (app._id != params.app)){throwError('APP_NOT_EXISTENT')}
            if(!user){throwError('USER_NOT_EXISTENT')}

            let resultBetted = CasinoLogicSingleton.normalizeBet(params.result);
            var serverSeed = CryptographySingleton.generateSeed();
            var clientSeed = CryptographySingleton.generateSeed();

			let jackpot = await JackpotRepository.prototype.findJackpotById(app.addOn.jackpot);

			jackpot.resultSpace = Object.keys(jackpot.resultSpace).map(i => jackpot.resultSpace[Number(i)]);

            /* Get Bet Result */
            let { isWon } = betJackpotActions.auto({
                serverSeed : serverSeed,
                clientSeed : clientSeed,
                nonce : params.nonce,
                resultSpace : jackpot.resultSpace,
                result : resultBetted,
                edge : jackpot.edge
            });

			let resultEdge = params.result.map(r => {
				return {
					place: r.place,
					value: (parseFloat(r.value) * parseFloat(jackpot.edge) * 0.01)
				};
			});

			let limit = jackpot.limits.find((lm) => (new String(lm.currency).toString()) == (new String(currency).toString()) );

			let lossAmount = resultEdge.reduce( (acc, result) => {
				return acc + parseFloat(result.value);
			}, 0);

			let user_delta = 0;
			let pot 	   = 0;

            if(isWon){
                /* User Won Bet */
				user_delta = parseFloat(limit.pot+lossAmount);
				console.log("Win Jackpot: ", user_delta);
            } else {
				/* User Lost Bet */
				user_delta = parseFloat(-lossAmount);
				console.log("Loss Jackpot: ", user_delta);
				pot = parseFloat(limit.pot) + parseFloat(lossAmount);
			}

            let normalized = {
				user_id: user._id,
				pot,
				isWon,
				jackpot,
				currency,
				user_delta,
				lossAmount,
				userWallet
            }
            return normalized;
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
	__register : async (params) => {
		try{
			let jackpot = await self.save(params);
			return jackpot;
		}catch(err){
			throw err;
		}
	},
	__percentage : async (params) => {
		try{
			let { result } = params;
			return result;
		}catch(err){
			throw err;
		}
	},
	__normalizeSpaceResult : async (params) => {
		try{
			let { res } = params;
			return res;
		}catch(err){
			throw err;
		}
	},
	__bet : async (params) => {
		try{
			let {jackpot, currency, user_delta, userWallet, pot, isWon, user_id} = params;
			await JackpotRepository.prototype.updatePot(jackpot._id, currency, parseFloat(pot) );
			await WalletsRepository.prototype.updatePlayBalance(userWallet._id, parseFloat(user_delta) );
			if(isWon) {
				PusherSingleton.trigger({
					channel_name: user_id,
					isPrivate: true,
					message: `You won the jackpot ${parseFloat(pot)}`,
					eventType: 'JACKPOT'
				})
			}
			return params;
		}catch(err){
			throw err;
		}
	}
}

/**
 * Main Jackpot logic.
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
 * @property {Jackpot_model} model
 * @property {Jackpot_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class JackpotLogic extends LogicComponent {
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
	 * Validates Jackpot schema.
	 *
	 * @param {Jackpot} Jackpot
	 * @returns {Jackpot} Jackpot
	 * @throws {string} On schema.validate failure
	 */
	async objectNormalize(params, processAction) {
		try{
			switch(processAction) {
				case 'Register' : {
					return await library.process.__register(params); break;
				};
				case 'NormalizeSpaceResult' : {
					return await library.process.__normalizeSpaceResult(params); break;
				};
				case 'Bet' : {
					return await library.process.__bet(params); break;
				};
				case 'Percentage' : {
					return await library.process.__percentage(params); break;
				};
			}
		}catch(error){
			throw error;
		}
	}

	 /**
	 * Tests Jackpot schema.
	 *
	 * @param {Jackpot} Jackpot
	 * @returns {Jackpot} Jackpot
	 * @throws {string} On schema.validate failure
	 */

	testParams(params, action){
		try{
			error.jackpot(params, action);
		}catch(err){
			throw err;
		}
	}

	async progress(params, progressAction){
		try{
			switch(progressAction) {
				case 'Register' : {
					return await library.progress.__register(params); break;
				}
				case 'NormalizeSpaceResult' : {
					return await library.progress.__normalizeSpaceResult(params); break;
				};
				case 'Bet' : {
					return await library.progress.__bet(params); break;
				};
				case 'Percentage' : {
					return await library.progress.__percentage(params); break;
				};
			}
		}catch(error){
			throw error;
		}
	}
}

// Export Default Module
export default JackpotLogic;