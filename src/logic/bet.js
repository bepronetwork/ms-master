import _ from 'lodash';
import { ErrorManager } from '../controllers/Errors';
import { GamesRepository, UsersRepository, WalletsRepository, AppRepository } from '../db/repos';
import LogicComponent from './logicComponent';
import { CryptographySingleton } from '../controllers/Helpers';
import CasinoLogicSingleton from './utils/casino';
import { BetResultSpace } from '../models';
import { throwError } from '../controllers/Errors/ErrorManager';
import { getAffiliatesReturn } from './utils/affiliates';
// import MathSingleton from './utils/math';
import PerfomanceMonitor from '../helpers/performance';

const PerformanceBet = new PerfomanceMonitor({id : 'Bet_1'});

let error = new ErrorManager();

// Private fields
let self; // eslint-disable-line no-unused-vars
let library;
let modules;

let __private = {};

// TO DO : Create Different Type of Resolving Actions for Casino
const betResolvingActions = {
    getValueOfjackpot : (app, totalBetAmount) => {
		try {
			if(app.addOn.jackpot==undefined){
				return {
                    jackpotAmount : 0,
                    jackpotPercentage : 0
                };
			}else{
                return {
                    jackpotAmount : Math.abs(parseFloat(totalBetAmount*app.addOn.jackpot.edge/100)),
                    jackpotPercentage : app.addOn.jackpot.edge/100
                }
            }
		}catch(err){
			return {
                jackpotAmount : 0,
                jackpotPercentage : 0
            };
		}
	},
    auto : (params) => {
		var hmca_hash, outcome, isWon, outcomeResultSpace;
        var { gameMetaName, serverSeed, clientSeed } = params;

        switch(gameMetaName){
            case 'keno_simple' : {
                outcomeResultSpace = [];
                /* 10 Outcome Result Spaces */
                while(outcomeResultSpace.length < 10){
                    serverSeed = CryptographySingleton.generateSeed();
                    hmca_hash = CryptographySingleton.generateRandomResult(serverSeed, clientSeed, params.nonce);
                    outcome = CryptographySingleton.hexToInt(hmca_hash);
                    let outcomeResultSpaceIndividual = CasinoLogicSingleton.fromOutcometoResultSpace(outcome, params.resultSpace);
                    console.log("outcomeResultSpaceIndividual", outcomeResultSpaceIndividual);
                    let exists = outcomeResultSpace.find( o => outcomeResultSpaceIndividual.index == o.index)
                    if(!exists){
                        /* Make sure they dont have the same result space */
                        outcomeResultSpace.push(outcomeResultSpaceIndividual);
                    }
                }
                break;
            };
            default : {
                hmca_hash = CryptographySingleton.generateRandomResult(serverSeed, clientSeed, params.nonce);
                outcome = CryptographySingleton.hexToInt(hmca_hash) ;
                outcomeResultSpace = CasinoLogicSingleton.fromOutcometoResultSpace(outcome, params.resultSpace);
                /* 1 Outcome Result Space */
                break;
            }
        }
        
        var { winAmount, isWon, totalBetAmount } =  CasinoLogicSingleton.calculateWinAmountWithOutcome({
            userResultSpace : params.result,
            resultSpace : params.resultSpace,
            fee : params.fee,
            jackpotAmount : params.jackpotAmount,
            totalBetAmount : params.betAmount,
            outcomeResultSpace : outcomeResultSpace,
            houseEdge : params.edge,
            game : params.gameMetaName
        });
        
        return { winAmount, outcomeResultSpace, isWon, outcome, totalBetAmount, hmca_hash };
    },
    /* TO ADD LATER ON ESPORTS
    oracled : (params) => {
        let hmca_hash, outcome, isWon, outcomeResultSpace;

		hmca_hash = CryptographySingleton.generateRandomResult(params.serverSeed, params.clientSeed, params.nonce),
		 
		outcomeResultSpace 	= params.outcome;
		isWon 	       		= CasinoLogicSingleton.isWon(outcomeResultSpace, params.result);

        var { winAmount : maxWinAmount } =  CasinoLogicSingleton.calculateMaxWinAmount({
            userResultSpace : params.result, 
			resultSpace : params.resultSpace,
            houseEdge : params.edge,
            gameMetaName : params.gameMetaName
        });

        let winAmount = isWon ? maxWinAmount : 0;
        
        return {...params, winAmount, outcomeResultSpace, isWon, maxWinAmount, outcome, hmca_hash};

    }
    */
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
        try{
            let { currency } = params;
            PerformanceBet.start({id : 'findGameById'});
            let game = await GamesRepository.prototype.findGameById(params.game);
            PerformanceBet.end({id : 'findGameById'});
            PerformanceBet.start({id : 'findUserById'});
            let user = await UsersRepository.prototype.findUserById(params.user, "simple");
            PerformanceBet.end({id : 'findUserById'});
            PerformanceBet.start({id : 'findAppById'});
            let app = await AppRepository.prototype.findAppById(params.app, "wallet");
            PerformanceBet.end({id : 'findAppById'});

            if(game){var maxBetValue = game.maxBet; }

            /* No Mapping Error Verification */
            if(!app || (String(user.app_id).toString() != String(app._id).toString())){throwError('APP_NOT_EXISTENT')}
            if(!game){throwError('GAME_NOT_EXISTENT')}
            if(!user){throwError('USER_NOT_EXISTENT')}
            if(maxBetValue){if(maxBetValue === undefined || maxBetValue === null){throwError('MAX_BET_NOT_EXISTENT')}}

            var affiliateReturns = [], totalAffiliateReturn = 0;
            var user_delta, app_delta;
            var user_in_app = (app._id == params.app);

            /* Get balance by wallet type */
            const points     = (app.addOn.pointSystem!=undefined) ? app.addOn.pointSystem.ratio.find( w => new String(w.currency).toString() == new String(currency).toString()) : 0;
            const appWallet  = app.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());
            const userWallet = user.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());

            let appPlayBalance                  = appWallet.playBalance;
            let userBalance                     = userWallet.playBalance;
            const amountBonus                   = userWallet.bonusAmount;
            const minBetAmountForBonusUnlocked  = userWallet.minBetAmountForBonusUnlocked;
            const incrementBetAmountForBonus    = userWallet.incrementBetAmountForBonus;

            let resultBetted = CasinoLogicSingleton.normalizeBet(params.result, game.resultSpace);
            var serverSeed = CryptographySingleton.generateSeed();
            var clientSeed = CryptographySingleton.generateSeed();
            const { affiliateLink } = user;
            const isUserAffiliated = (affiliateLink != null && !_.isEmpty(affiliateLink))

            /* Verify if Withdrawing Mode is ON - User */
            let isUserWithdrawingAPI = user.isWithdrawing;
            /* Verify if Withdrawing Mode is ON - App */
            let isAppWithdrawingAPI = app.isWithdrawing; 

            /* Get Possible Win Balance for Bet */ 
            let { totalBetAmount, maxWinAmount, fee } = CasinoLogicSingleton.calculateMaxWinAmount({
                userResultSpace : resultBetted,
                resultSpace : game.resultSpace,
                houseEdge : game.edge,
                game : game.metaName
            }); 

            /* Error Check Before Bet Result to bet set */
            if(userBalance+amountBonus < totalBetAmount){throwError('INSUFFICIENT_FUNDS')}
            if(maxBetValue){if(maxBetValue < totalBetAmount){throwError('MAX_BET_ACHIEVED')}}

            /* Remove Fee from Math */
            let betAmount = totalBetAmount - Math.abs(fee);

            let { jackpotAmount } = betResolvingActions.getValueOfjackpot(app, betAmount);

            betAmount = betAmount - jackpotAmount;  /* total amount amount - jackpot amount - fee amount */
            /* Get Bet Result */
            let { isWon,  winAmount, outcomeResultSpace } = betResolvingActions.auto({
                serverSeed : serverSeed,
                clientSeed : clientSeed,
                nonce : params.nonce,
                fee : fee,
                resultSpace : game.resultSpace,
                result : resultBetted,
                gameMetaName : game.metaName,
                betAmount : betAmount,
                jackpotAmount,
                edge : game.edge
            });
        

            /* Remove Jackpot from Math */
            var totalAmountWithFee = totalBetAmount - Math.abs(jackpotAmount); /* total amount - jackpot amount */

            if(isWon && (winAmount > 0)){
                /* User Won Bet */
                const delta = Math.abs(winAmount) - Math.abs(totalBetAmount);
                user_delta = delta;
                app_delta = -delta;
            }else{
                /* User Lost Bet */
                user_delta = -Math.abs(totalBetAmount); /* With Fee + Jackpot */
                if(isUserAffiliated){
                    /* Get Amounts and Affiliate Cuts */
                    var affiliateReturnResponse = getAffiliatesReturn({
                        affiliateLink : affiliateLink,
                        currency : currency,
                        lostAmount : betAmount /* Without Fee & jackpot */
                    })
                    /* Map */
                    affiliateReturns = affiliateReturnResponse.affiliateReturns;
                    totalAffiliateReturn = affiliateReturnResponse.totalAffiliateReturn;
                }
                /* Set App Cut without Affiliate Return */
                app_delta = Math.abs(totalBetAmount - totalAffiliateReturn); /* Without Fee */
            }


            const tableLimit = (game.wallets.find( w => w.wallet.toString() == appWallet._id.toString() )).tableLimit;

            let normalized = {
                virtual: app.virtual,
                jackpotAmount,
                user_in_app,
                isUserWithdrawingAPI,
                totalBetAmount,
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
                maxWinAmount,
                winAmount,
                betAmount           :   betAmount,
                fee,
                result         		:   resultBetted,			   
                timestamp           :   new Date(),
                nonce               :   params.nonce,
                clientSeed          :   clientSeed,
                serverHashedSeed    :   CryptographySingleton.hashSeed(serverSeed),
                serverSeed          :   serverSeed,
                amountBonus,
                minBetAmountForBonusUnlocked,
                incrementBetAmountForBonus,
                points: points.value
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

        const {isWon, playBalance, isUserAffiliated, affiliateReturns, result, user_delta, app_delta, wallet, appWallet, amountBonus, minBetAmountForBonusUnlocked, incrementBetAmountForBonus, virtual, user, points } = params;
        if(points>0){
            await UsersRepository.prototype.insertPoints(user, points*params.totalBetAmount);
        }
        /* Save all ResultSpaces */
        PerformanceBet.start({id : 'BetResultSpace.register'});
        let dependentObjects = Object.keys(result).map( async key =>
            await (new BetResultSpace(result[key])).register()
        );
        PerformanceBet.end({id : 'BetResultSpace.register'});

        let betResultSpacesIds = await Promise.all(dependentObjects);
        // Generate new Params Setup

        params = {
            ...params,
            result : betResultSpacesIds,
            isResolved : true
        }

        /* Save Bet */
        PerformanceBet.start({id : 'bet.register'});
        let bet = await self.save({
            ...params,
            betAmount : params.totalBetAmount
        });

        // Logic for when the APP is not virtual
        if(isWon && !virtual){
            if(amountBonus>0){
                await WalletsRepository.prototype.updatePlayBalanceBonus(wallet._id, user_delta);
                await WalletsRepository.prototype.updateIncrementBetAmountForBonus(wallet._id, params.totalBetAmount);
            }else{
                await WalletsRepository.prototype.updatePlayBalance(wallet._id, user_delta);
                await WalletsRepository.prototype.updatePlayBalance(appWallet._id, app_delta);
            }
        } else if(!isWon && !virtual) {
            if(amountBonus>0){
                await WalletsRepository.prototype.updateIncrementBetAmountForBonus(wallet._id, params.totalBetAmount);
            }
            await WalletsRepository.prototype.updatePlayBalanceBonus(wallet._id, params.totalBetAmount >= playBalance ? (playBalance-params.totalBetAmount) : 0);
            await WalletsRepository.prototype.updatePlayBalance(appWallet._id, (params.totalBetAmount >= playBalance ? playBalance : app_delta));
            await WalletsRepository.prototype.updatePlayBalance(wallet._id, ( params.totalBetAmount >= playBalance ? -playBalance : -params.totalBetAmount));
        }

        // Logic for when the APP is virtual
        if(virtual) {
            /* Update PlayBalance */
            PerformanceBet.start({id : 'wallet1'});
            await WalletsRepository.prototype.updatePlayBalance(wallet._id, user_delta);
            PerformanceBet.end({id : 'wallet1'});
            /* Update App PlayBalance */
            PerformanceBet.start({id : 'wallet2'});
            await WalletsRepository.prototype.updatePlayBalance(appWallet._id, app_delta);
            PerformanceBet.end({id : 'wallet2'});
        }

        // if the increment of the bonus bet is greater than the minimum for the bonus to be unlocked, and the bonus is greater than then: Then the bonus owner is sent to playbalance.
        if( incrementBetAmountForBonus >= minBetAmountForBonusUnlocked && amountBonus > 0 && !virtual) {
            await WalletsRepository.prototype.updatePlayBalanceBonus(wallet._id, -(user_delta+amountBonus));
            await WalletsRepository.prototype.updateIncrementBetAmountForBonus(wallet._id, -(params.totalBetAmount+incrementBetAmountForBonus));
            await WalletsRepository.prototype.updateMinBetAmountForBonusUnlocked(wallet._id, -(minBetAmountForBonusUnlocked));
            await WalletsRepository.prototype.updatePlayBalance(wallet._id, (user_delta+amountBonus));
        }

        /* Update Balance of Affiliates */
        if(isUserAffiliated && amountBonus <= 0){
            let userAffiliatedWalletsPromises = affiliateReturns.map( async a => {
                return WalletsRepository.prototype.updatePlayBalance(a.parentAffiliateWalletId, a.amount)
            })
            Promise.all(userAffiliatedWalletsPromises); // Async because not needed to be synced - no security issue
        }

		/* Add Bet to User Profile */
		UsersRepository.prototype.addBet(params.user, bet); // Async because not needed to be synced - no security issue
		/* Add Bet to Event Profile */
        GamesRepository.prototype.addBet(params.game, bet); // Async because not needed to be synced - no security issue

        let res = {
            bet,
            ...params
        };

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

