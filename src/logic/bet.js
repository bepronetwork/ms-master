import _ from 'lodash';
import { ErrorManager } from '../controllers/Errors';
import { GamesRepository, UsersRepository, WalletsRepository, AppRepository, JackpotRepository } from '../db/repos';
import LogicComponent from './logicComponent';
import { CryptographySingleton } from '../controllers/Helpers';
import CasinoLogicSingleton from './utils/casino';
import { BetResultSpace } from '../models';
import { throwError } from '../controllers/Errors/ErrorManager';
import { getAffiliatesReturn } from './utils/affiliates';
import MathSingleton from './utils/math';
import PerfomanceMonitor from '../helpers/performance';

const PerformanceBet = new PerfomanceMonitor({id : 'Bet'});

let error = new ErrorManager();

// Private fields
let self; // eslint-disable-line no-unused-vars
let library;
let modules;

let __private = {};

// TO DO : Create Different Type of Resolving Actions for Casino
const betResolvingActions = {
    valueToJackpot : async (app_id, resultGame) => {
		try {
            let app = await AppRepository.prototype.findAppByIdWithJackpotPopulated(app_id);
			if(app.addOn.jackpot==undefined){
				return 0;
			}

			let valueSumSpace = resultGame.reduce( (acc, result) => {
				return acc + parseFloat(result.value);
			}, 0);
			return (valueSumSpace * app.addOn.jackpot.edge * 0.01);
		}catch(err){
			return 0;
		}
	},
    auto : (params) => {
		var hmca_hash, outcome, isWon, outcomeResultSpace;

		/**
		 * @function HMCA SHA512 Result Output
		 */

		hmca_hash = CryptographySingleton.generateRandomResult(params.serverSeed, params.clientSeed, params.nonce),
		outcome = CryptographySingleton.hexToInt(hmca_hash) 
		 
		outcomeResultSpace 	= CasinoLogicSingleton.fromOutcometoResultSpace(outcome, params.resultSpace)

        var { winAmount, isWon, totalBetAmount } =  CasinoLogicSingleton.calculateWinAmountWithOutcome({
            userResultSpace : params.result,
            resultSpace : params.resultSpace,
            totalBetAmount : params.betAmount,
            outcomeResultSpace : outcomeResultSpace,
            houseEdge : params.edge,
            game : params.gameMetaName
        });
        
        return { winAmount, outcomeResultSpace, isWon, outcome, totalBetAmount, hmca_hash };
    },
    oracled : (params) => {
        let hmca_hash, outcome, isWon, outcomeResultSpace;

		/**
		 * @function HMCA SHA512 Result Output
		 */

		hmca_hash = CryptographySingleton.generateRandomResult(params.serverSeed, params.clientSeed, params.nonce),
		 
		outcomeResultSpace 	= params.outcome;
		isWon 	       		= CasinoLogicSingleton.isWon(outcomeResultSpace, params.result);

        var { winAmount : possibleWinAmount } =  CasinoLogicSingleton.calculateMaxWinAmount({
            userResultSpace : params.result, 
			resultSpace : params.resultSpace,
            houseEdge : params.edge,
            gameMetaName : params.gameMetaName
        });

        let winAmount = MathSingleton.toFloatPositiveNDecimal( isWon ? possibleWinAmount : 0 ).value;
        
        return {...params, winAmount, outcomeResultSpace, isWon, possibleWinAmount, outcome, hmca_hash};

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
    __auto : async (params) => {
        console.log("here")
        try{

            let { currency } = params;
            PerformanceBet.start({id : 'findGameById'});
            let game = await GamesRepository.prototype.findGameById(params.game);
            PerformanceBet.end({id : 'findGameById'});
            PerformanceBet.start({id : 'findUserById'});
            let user = await UsersRepository.prototype.findUserById(params.user);
            PerformanceBet.end({id : 'findUserById'});

            PerformanceBet.start({id : 'findUserWithJackpotPopulated'});
            let percentage = await betResolvingActions.valueToJackpot(user.app_id, params.result);
            percentage = MathSingleton.toFloatPositiveNDecimal(percentage).value;
            PerformanceBet.end({id : 'findUserWithJackpotPopulated'});

            PerformanceBet.start({id : 'others 1'});
            let app = user.app_id;
            if(game){var maxBetValue = game.maxBet; }

            /* No Mapping Error Verification */
            if(!app || (app._id != params.app)){throwError('APP_NOT_EXISTENT')}
            if(!game){throwError('GAME_NOT_EXISTENT')}
            if(!user){throwError('USER_NOT_EXISTENT')}
            if(maxBetValue){if(maxBetValue === undefined || maxBetValue === null){throwError('MAX_BET_NOT_EXISTENT')}}

            var affiliateReturns = [], totalAffiliateReturn = 0;
            var user_delta, app_delta;
            var user_in_app = (app._id == params.app);

            /* Get balance by wallet type */
            const appWallet = app.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());
            const userWallet = user.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());

            let appPlayBalance = MathSingleton.toFloatPositiveNDecimal(appWallet.playBalance).value;
            let userBalance = MathSingleton.toFloatPositiveNDecimal(userWallet.playBalance).value;

            let resultBetted = CasinoLogicSingleton.normalizeBet(params.result);
            var serverSeed = CryptographySingleton.generateSeed();
            var clientSeed = CryptographySingleton.generateSeed();
            const { affiliateLink } = user;
            const isUserAffiliated = (affiliateLink != null && !_.isEmpty(affiliateLink))

            /* Verify if Withdrawing Mode is ON - User */
            let isUserWithdrawingAPI = user.isWithdrawing;
            /* Verify if Withdrawing Mode is ON - App */
            let isAppWithdrawingAPI = app.isWithdrawing;

            /* Get Possible Win Balance for Bet */ 
            let { totalBetAmount, possibleWinAmount, fee } = CasinoLogicSingleton.calculateMaxWinAmount({
                userResultSpace : resultBetted,
                resultSpace : game.resultSpace,
                houseEdge : game.edge,
                game : game.metaName
            }); 
            totalBetAmount = MathSingleton.toFloatPositiveNDecimal(totalBetAmount).value;
            /* Error Check Before Bet Result to bet set */
            if(userBalance < totalBetAmount){throwError('INSUFFICIENT_FUNDS')}
            if(maxBetValue){if(maxBetValue < totalBetAmount){throwError('MAX_BET_ACHIEVED')}}

            /* Get Bet Result */
            let { isWon,  winAmount, outcomeResultSpace } = betResolvingActions.auto({
                serverSeed : serverSeed,
                clientSeed : clientSeed,
                nonce : params.nonce,
                resultSpace : game.resultSpace,
                result : resultBetted,
                gameMetaName : game.metaName,
                betAmount : totalBetAmount - percentage,
                edge : game.edge
            });

            if(isWon){
                /* User Won Bet */
                const delta = MathSingleton.toFloatPositiveNDecimal(Math.abs(winAmount)).value - MathSingleton.toFloatPositiveNDecimal(Math.abs(totalBetAmount)).value;
                user_delta = MathSingleton.toFloatPositiveNDecimal(delta).value;
                app_delta = MathSingleton.toFloatPositiveNDecimal(-delta).value;
            }else{
                /* User Lost Bet */
                user_delta = -MathSingleton.toFloatPositiveNDecimal(Math.abs(totalBetAmount)).value;
                if(isUserAffiliated){
                    /* Get Amounts and Affiliate Cuts */
                    var affiliateReturnResponse = getAffiliatesReturn({
                        affiliateLink : affiliateLink,
                        currency : currency,
                        lostAmount : totalBetAmount
                    })
                    /* Map */
                    affiliateReturns = affiliateReturnResponse.affiliateReturns;
                    totalAffiliateReturn = MathSingleton.toFloatPositiveNDecimal(affiliateReturnResponse.totalAffiliateReturn).value;
                }
                /* Set App Cut without Affiliate Return */
                app_delta = MathSingleton.toFloatPositiveNDecimal(Math.abs(totalBetAmount - totalAffiliateReturn - percentage)).value;
            }

            var possibleWinBalance = MathSingleton.toFloatPositiveNDecimal(possibleWinAmount + userBalance).value;

            const tableLimit = (game.wallets.find( w => w.wallet.toString() == appWallet._id.toString() )).tableLimit;

            let normalized = {
                percentage,
                user_in_app,
                isUserWithdrawingAPI,
                isAppWithdrawingAPI,
                user_delta,
                app_delta,
                isUserAffiliated,
                affiliateReturns,
                totalAffiliateReturn,
                appWallet,
                currency,
                tableLimit,
                wallet				            :   userWallet,
                user                            :   user._id, 				    
                app                             :   app._id,
                outcomeResultSpace              :   outcomeResultSpace,
                isWon                           :   isWon,
                game                            :   game._id,
                betSystem                       :   game.betSystem,
                appPlayBalance		:   appPlayBalance, 
                playBalance         :   userBalance,
                possibleWinAmount,
                possibleWinBalance,
                winAmount,
                betAmount           :   totalBetAmount,
                fee,
                result         		:   resultBetted,			   
                timestamp           :   new Date(),
                nonce               :   params.nonce,
                clientSeed          :   clientSeed,
                serverHashedSeed    :   CryptographySingleton.hashSeed(serverSeed),
                serverSeed          :   serverSeed
            }
            return normalized;
        }catch(err){
            throw err;
        }
    },
	__register : async (params) => {
        return params;
	},
	__resolve : async (params) => {
	
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
    __auto : async (params) => {
        PerformanceBet.end({id : 'others 1'});

        const { isUserAffiliated, affiliateReturns, result, user_delta, app_delta, wallet, appWallet } = params;
        /* Save all ResultSpaces */
        PerformanceBet.start({id : 'BetResultSpace Save'});

        let dependentObjects = Object.keys(result).map( async key => 
            await (new BetResultSpace(result[key])).register()
        );

        let betResultSpacesIds = await Promise.all(dependentObjects);
        PerformanceBet.end({id : 'BetResultSpace Save'});
        // Generate new Params Setup

        params = {
            ...params,
            result : betResultSpacesIds,
            isResolved : true
        }
        PerformanceBet.start({id : 'Bet Save'});
        /* Save Bet */
        let bet = await self.save(params);
        PerformanceBet.end({id : 'Bet Save'});

        PerformanceBet.start({id : 'updatePlayBalance User'});
		/* Update PlayBalance */
        await WalletsRepository.prototype.updatePlayBalance(wallet._id, user_delta);
        PerformanceBet.end({id : 'updatePlayBalance User'});
        PerformanceBet.start({id : 'updatePlayBalance App'});
        /* Update App PlayBalance */
        await WalletsRepository.prototype.updatePlayBalance(appWallet._id, app_delta);
        PerformanceBet.end({id : 'updatePlayBalance App'});

        /* Update Balance of Affiliates */
        PerformanceBet.start({id : 'updatePlayBalance Affiliates'});

        if(isUserAffiliated){
            let userAffiliatedWalletsPromises = affiliateReturns.map( async a => {
                return await WalletsRepository.prototype.updatePlayBalance(a.parentAffiliateWalletId, a.amount)
            })
            await Promise.all(userAffiliatedWalletsPromises);
        }
        PerformanceBet.end({id : 'updatePlayBalance Affiliates'});

        PerformanceBet.start({id : 'AddBet'});
		/* Add Bet to User Profile */
		await UsersRepository.prototype.addBet(params.user, bet);
		/* Add Bet to Event Profile */
        await GamesRepository.prototype.addBet(params.game, bet);
        PerformanceBet.end({id : 'AddBet'});

        let res = {
            bet,
            ...params
        }
		return res;
	},
	__register : async (params) => {
        let bet = await self.save(params);
        return bet;
	},
	__resolve : async (params) => {
    
    }
}
/**
 * Main Bet logic.
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
 * @property {Bet_model} model
 * @property {Bet_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class BetLogic extends LogicComponent{
	constructor(scope) {
		super(scope);
		self = this;
		__private = {
			db : scope.db,
			__normalizedSelf : null
		};

		library = {
			process  : processActions,
			progress : progressActions
		}
    }


    /**
	 * Validates Bet schema.
	 *
	 * @param {Bet} Bet
	 * @returns {Bet} Bet
	 * @throws {string} On schema.validate failure
	 */
	async objectNormalize(params, processAction) {
		try{			
			switch(processAction) {
                case 'Auto' : {
					return await library.process.__auto(params); break;
				};
				case 'Register' : {
					return await library.process.__register(params); break;
				};
				case 'Resolve' : {
					return await library.process.__resolve(params); break;
                };
			}
		}catch(err){
			throw err;
		}
	}

	 /**
	 * Tests Bet schema.
	 *
	 * @param {Bet} Bet
	 * @returns {Bet} Bet
	 * @throws {string} On schema.validate failure
	 */

	testParams(params, action){
		try{
			error.bet(params, action);
		}catch(err){
			throw err;
		}
	}

	async progress(params, progressAction){
		try{			
			switch(progressAction) {
                case 'Auto' : {
					return await library.progress.__auto(params); break;
				};
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

export default BetLogic;

