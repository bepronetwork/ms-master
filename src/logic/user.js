


const _ = require('lodash');
import { Security } from '../controllers/Security';
import { ErrorManager } from '../controllers/Errors';
import LogicComponent from './logicComponent';

import {
	Token
} from '../../src/models';

import { 
    UsersRepository, 
    AppRepository, 
    WalletsRepository, 
    DepositRepository, 
    WithdrawRepository, 
    AffiliateLinkRepository, 
    AffiliateRepository, 
    SecurityRepository,
    AddressRepository,
    TokenRepository
} from '../db/repos';
import Numbers from './services/numbers';
import { verifytransactionHashDirectDeposit } from './services/services';
import { Deposit, Withdraw, AffiliateLink, Wallet, Address } from '../models';
import CasinoContract from './eth/CasinoContract';
import codes from './categories/codes';
import { globals } from '../Globals';
import MiddlewareSingleton from '../api/helpers/middleware';
import { throwError } from '../controllers/Errors/ErrorManager';
import { getIntegrationsInfo } from './utils/integrations';
import { fromPeriodicityToDates } from './utils/date';
import { BitGoSingleton } from './third-parties';
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
	__login : async (params) => {
        var input_params = params;
        let normalized = {};
        let user = await __private.db.findUser(params.username);  
        if(!user){throwError('USER_NOT_EXISTENT')}
        if(!user.security){throwError()};
        let has2FASet = user.security['2fa_set'];
        let bearerToken = MiddlewareSingleton.sign(user._id);
        var app = user.app_id;
        var user_in_app = (app._id == params.app);
        const { integrations } = app;

		if(user){
			normalized = {
                has2FASet,
                bearerToken,
                user_in_app,
				username : user.username,
                password : input_params.password,
                security_id : user.security._id,
                verifiedAccount : new Security().unhashPassword(input_params.password, user.hash_password),
                integrations : getIntegrationsInfo({ integrations, user_id : user.username}),
				...user
			}
        }
        return normalized;
    },
    __resetPassword: async (params) => {
        const user          = await __private.db.findUser(params.username_or_email);
        const email         = await __private.db.findUserByEmail(params.username_or_email);
        let alreadyExists   = (user || email);
        // console.log(alreadyExists);
        
        if(!alreadyExists){
            throwError();
        }
        let bearerToken = MiddlewareSingleton.generateTokenDate( ( new Date( ((new Date()).getTime() + 1 * 24 * 60 * 60 * 1000) )).getTime() );
        let token = new Token({
            user    : alreadyExists._id,
            token   : bearerToken
        });
        let resultToken = await token.register();
        if(!resultToken) {
            throwError();
        }
        let normalized = {}
        return normalized;
    },
    __setPassword: async (params) => {
        const payload = MiddlewareSingleton.resultTokenDate(params.token);
        if(!payload) {
            throwError('TOKEN_EXPIRED');
        }
        console.log(`${Number((new Date()).getTime())} > ${Number(payload.time)}`);
        if( Number((new Date()).getTime()) > Number(payload.time) ) {
            throwError('TOKEN_EXPIRED');
        }
        const findToken = await TokenRepository.prototype.findByToken(params.token);
        console.log(findToken);
        if(!findToken || (String(findToken.user) !== String(params.user_id)) ) {
            throwError('TOKEN_INVALID');
        }

        let hash_password = new Security(params.password).hash();

        let updatePassword = await UsersRepository.prototype.updateUser({id: params.user_id, param: {hash_password} });

        if(!updatePassword) {
            throwError();
        }

        let normalized = {
        }

        return normalized;
    },
    __login2FA : async (params) => {
        // Get User by Username
        let user = await __private.db.findUser(params.username);

        if(!user){throwError('USER_NOT_EXISTENT')};
        if(!user.security){throwError()};

        var has2FASet = user.security['2fa_set'];
        var secret2FA = user.security['2fa_secret'];

        // is 2FA not Setup
        if((!has2FASet) || (!secret2FA)){throwError('USER_HAS_2FA_DEACTIVATED')}
    
        let isVerifiedToken2FA = (new Security()).isVerifiedToken2FA({
            secret : secret2FA,
            token : params['2fa_token']
        });
        let bearerToken = MiddlewareSingleton.sign(user._id);
        
        var app = user.app_id;
        var user_in_app = (app._id == params.app);
        const { integrations } = app;

        let normalized = {
            has2FASet,
            secret2FA,
            bearerToken,
            user_in_app,
            isVerifiedToken2FA,
            username : user.username,
            password : params.password,
            security_id : user.security._id,
            verifiedAccount : new Security().unhashPassword(params.password, user.hash_password),
            integrations : getIntegrationsInfo({integrations, user_id : user.username}),
            ...user
        }

        return normalized;
    },
    __auth  : async (params) => {
        // Get User by Username
        let user = await __private.db.findUserById(params.user);
        if(!user){throwError('USER_NOT_EXISTENT')};
        if(!user.security){throwError()};
        let normalized = user;        
        return normalized;
    },
    __set2FA : async (params) => {
        // Get User by Username
        let user = await __private.db.findUserById(params.user);

        if(!user){throwError('USER_NOT_EXISTENT')};
        if(!user.security){throwError()};
    
        let isVerifiedToken2FA = (new Security()).isVerifiedToken2FA({
            secret : params['2fa_secret'],
            token : params['2fa_token']
        })
        let normalized = {
            newSecret : params['2fa_secret'],
            username : user.username,
            isVerifiedToken2FA,
            user_id : params.user,
            security_id : user.security._id,
            ...user
        }
        return normalized;
    },

	__register : async (params) => {

        const { affiliateLink, affiliate } = params;
        var input_params = params;
		//Set up Password Structure
        let user, hash_password, email;

        let app = await AppRepository.prototype.findAppById(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}

        if(params.user_external_id){
            // User is Extern (Only Widget Clients)
            user = await AppRepository.prototype.findUserByExternalId(input_params.app, input_params.user_external_id);
        }else{
            // User is Intern 
            user = await UsersRepository.prototype.findUser(input_params.username);
            email = await UsersRepository.prototype.findUserByEmail(input_params.email);
        }

        let alreadyExists = (user || email) ? true : false;
        // TO DO : Hash Password on Client Side
        if(params.password)
		    hash_password = new Security(params.password).hash();

		let normalized = {
			alreadyExists	: alreadyExists,
			username 		: new String(params.username).toLowerCase().trim(),
            full_name		: params.full_name,
            affiliate       : affiliate,
            name 			: params.name,
            address         : params.address,
			hash_password,
            register_timestamp : new Date(),
			nationality		: params.nationality,
            age				: params.age,
            security        : params.security,
            email			: new String(params.email).toLowerCase().trim(),
            affiliateLink,
            app			: app,
            app_id      : app.id,
			external_user	: params.user_external_id ? true : false,
			external_id		: params.user_external_id
        }
		return normalized;
	},
	__summary : async (params) => {
		let res = await UsersRepository.prototype.getSummaryStats(params.type, params.user, params.opts);
		let normalized = {
			...res
		}
		return normalized;
    },
    __getDepositAddress : async (params) => {
        var { currency, id, app } = params;
        console.log("Id ", id);
        /* Get User Id */
        let user = await UsersRepository.prototype.findUserById(id);
        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')}
        if(!user){throwError('USER_NOT_EXISTENT')}
        const app_wallet = app.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());
        const user_wallet = user.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());

        return {
            app_wallet,
            user,
            user_wallet
        };

    },
    __updateWallet : async (params) => {
        try{
            var { currency, id, wBT } = params;

            var app = await AppRepository.prototype.findAppById(id);
            if(!app){throwError('APP_NOT_EXISTENT')}
            const app_wallet = app.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());
            if(!app_wallet || !app_wallet.currency){throwError('CURRENCY_NOT_EXISTENT')};

            /* Verify if the transactionHash was created */
            const { state, entries, value : amount, type, txid : transactionHash, wallet : bitgo_id, label} = wBT;

            const from = entries[0].address;
            const to = entries[1].address;
            const isValid = ((state == 'confirmed') && (type == 'receive'));

            /* Get User Id */
            let user = await UsersRepository.prototype.findUserById(label);
            if(!user){throwError('USER_NOT_EXISTENT')}
            const wallet = user.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());
            if(!wallet || !wallet.currency){throwError('CURRENCY_NOT_EXISTENT')};


            /* Verify if this transactionHashs was already added */
            let deposit = await DepositRepository.prototype.getDepositByTransactionHash(transactionHash);

            let wasAlreadyAdded = deposit ? true : false;

            /* Verify if User is in App */
            let user_in_app = (app.users.findIndex(x => (x._id.toString() == user._id.toString())) > -1);
            
            let res = {
                maxDeposit          : (app_wallet.max_deposit == undefined) ? 0 : app_wallet.max_deposit,
                app,
                user_in_app,
                user                : user,
                wasAlreadyAdded,
                user_id             : user._id,
                wallet              : wallet,
                creationDate        : new Date(),
                transactionHash     : transactionHash,
                from                : from,
                currencyTicker      : wallet.currency.ticker,
                amount              : amount,
                isValid
            }

            return res;
        }catch(err){
            throw err;
        }
    },
    __createApiToken : async (params) => {
		let normalized = {
            ...params,
            bearerToken : MiddlewareSingleton.sign(params.id)
        }
		return normalized;
    },
    __getBets : async (params) => {
        let bets = await UsersRepository.prototype.getBets({
            id : params.user,
            size : params.size,
            currency : params.currency,
            dates : fromPeriodicityToDates({periodicity : params.periodicity})
        });
		return bets;
    },
    __getInfo : async (params) => {
        const { user } = params;
        let res = await UsersRepository.prototype.findUserById(user);
		return res;
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
    __login : async (params) => {
        await SecurityRepository.prototype.setBearerToken(params.security_id, params.bearerToken);
        let bearerToken;
        if(params.app){
            /* Create BearerToken for App */
            bearerToken = MiddlewareSingleton.sign(params.app._id);
            await AppRepository.prototype.createAPIToken(params.app._id, bearerToken);
        }

        return {...params, app : {...params.app, bearerToken}};
    },
    __login2FA : async (params) => {    
        await SecurityRepository.prototype.setBearerToken(params.security_id, params.bearerToken);
        let bearerToken;
        if(params.app){
            /* Create BearerToken for App */
            bearerToken = MiddlewareSingleton.sign(params.app._id);
            await AppRepository.prototype.createAPIToken(params.app._id, bearerToken);
        }
        return {...params, app : {...params.app, bearerToken}};
    },
    __auth  : async (params) => {
        return params;
    },
    __set2FA : async (params) => {
        let {
            newSecret,
            security_id
        } = params;
        //Add new Secret
        await SecurityRepository.prototype.addSecret2FA(security_id, newSecret);
        return params;
    },
    __setPassword: async (params) => {
        return params;
    },
    __resetPassword: async (params) => {
        return params;
    },
	__register : async (params) => {
        try{
            const { affiliate, app } = params;

            /* Register of Available Wallets on App */
            params.wallet = await Promise.all(app.wallet.map( async w => {
                return (await (new Wallet({
                    currency : w.currency
                })).register())._doc._id;
            }))

            let user = await self.save(params);

            /* Register of Affiliate Link */
            let affiliateLinkObject = await (new AffiliateLink({
                userAffiliated : user._id,
                app_id : params.app.id,
                affiliateLink : params.affiliateLink
            })).register();
            
            /* Add affiliateLink _id */ 
            await UsersRepository.prototype.setAffiliateLink(user._id, affiliateLinkObject._id);
            /* Add Affiliate to Affiliate Link */ 
            await AffiliateLinkRepository.prototype.setAffiliate(affiliateLinkObject._id, affiliate);
            /* Add Afiliate Link to Parent Affiliates */
            let promisesId = affiliateLinkObject.parentAffiliatedLinks.map( async paf => 
                await AffiliateRepository.prototype.addAffiliateLinkChild(paf.affiliate, affiliateLinkObject._id)    
            )
            await Promise.all(promisesId);

            
            /* Add to App */
            await AppRepository.prototype.addUser(params.app_id, user);
            user = await UsersRepository.prototype.findUserById(user._id);
            return user;
        }catch(err){
            throw err;
        }
	},
	__summary : async (params) => {
        let normalized = {
            type : new String(params.type).toLowerCase().trim(),
            user : new String(params.app).trim(),
            opts : {
                dates : fromPeriodicityToDates({periodicity : params.periodicity}),
                currency : params.currency
                // Add more here if needed
            }
        }
		return normalized;
    },
    __getDepositAddress : async (params) => {
        const { app_wallet, user_wallet, user } = params;
        var wallet = await BitGoSingleton.getWallet({ticker : app_wallet.currency.ticker, id : app_wallet.bitgo_id});
        // See if address is already provided
        let bitgo_id = user_wallet.depositAddresses[0] ? user_wallet.depositAddresses[0].bitgo_id : null;
        let address = await BitGoSingleton.generateDepositAddress({wallet, label : user._id, id : bitgo_id });

        if(!bitgo_id){
            //Request to Bitgo to create Address not Existent
            let addressObject = (await (new Address({currency : user_wallet.currency._id, user : user._id, address: address.address, bitgo_id : address.id})).register())._doc;
            // Add Deposit Address to User Deposit Addresses
            await WalletsRepository.prototype.addDepositAddress(user_wallet._id, addressObject._id);
        }else{
            //Request to Bitgo to create Address Existent
        }    

        if(address.address){
            //Address Existent
            return {
                address : address.address,
                currency : user_wallet.currency.ticker
            }
        }else{
            // Not existent
            return {
                message : 'Waiting for address initialization'
            }
        }
       
    },
    __updateWallet : async (params) => {
        try{
            /* Create Deposit Object */
            let deposit = new Deposit({
                user                    : params.user_id,
                transactionHash         : params.transactionHash,
                creation_timestamp      : params.creationDate,                    
                last_update_timestamp   : params.creationDate,                             
                address                 : params.from,                         // Deposit Address 
                currency                : params.wallet.currency._id,
                amount                  : params.amount,
            })

            /* Save Deposit Data */
            let depositSaveObject = await deposit.createDeposit();

            /* Update Balance of App */
            await WalletsRepository.prototype.updatePlayBalance(params.wallet, params.amount);
            
            /* Add Deposit to user */
            await UsersRepository.prototype.addDeposit(params.user_id, depositSaveObject._id);

            return params;
        }catch(err){
            throw err;
        }
    },
    __createApiToken : async (params) => {
        let res = await UsersRepository.prototype.createAPIToken(params.id, params.bearerToken);
		return res;
    },
    __getBets : async (params) => {
		return params;
    },
    __getInfo : async (params) => {
		return params;
    }
}

/**
 * Main user logic.
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
 * @property {user_model} model
 * @property {user_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
 */


class UserLogic extends LogicComponent {
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
	 * Validates user schema.
	 *
	 * @param {user} user
	 * @returns {user} user
	 * @throws {string} On schema.validate failure
	 */
	async objectNormalize(params, processAction) {
		try{			
			switch(processAction) {
				case 'Login' : {
					return await library.process.__login(params); break;
                };
                case 'Login2FA' : {
					return await library.process.__login2FA(params); 
                };
                case 'Auth' : {
					return await library.process.__auth(params); 
                };
                case 'Set2FA' : {
					return await library.process.__set2FA(params); 
				};
				case 'Register' : {
					return library.process.__register(params); break;
				};
				case 'Summary' : {
					return await library.process.__summary(params); break;
                };
                case 'GetDepositAddress' : {
					return await library.process.__getDepositAddress(params); 
                };
                case 'UpdateWallet' : {
					return await library.process.__updateWallet(params); 
                };
                case 'CreateAPIToken' : {
					return await library.process.__createApiToken(params); break;
                };
                case 'GetBets' : {
					return await library.process.__getBets(params); break;
                };
                case 'GetInfo' : {
					return await library.process.__getInfo(params); break;
                };
                case 'ResetPassword' : {
					return await library.process.__resetPassword(params); break;
                };
                case 'SetPassword' : {
					return await library.process.__setPassword(params); break;
                };
			}
		}catch(err){
			throw err;
		}
	}

	 /**
	 * Tests user schema.
	 *
	 * @param {user} user
	 * @returns {user} user
	 * @throws {string} On schema.validate failure
	 */

	async testParams(params, action){
		try{
			error.user(params, action);
		}catch(err){
			throw err;
		}
	}


	async progress(params, progressAction){
		try{			
			switch(progressAction) {
				case 'Login' : {
					return await library.progress.__login(params);
                };
                case 'Login2FA' : {
					return await library.progress.__login2FA(params); 
                };
                case 'Auth' : {
					return await library.progress.__auth(params); 
                };
                case 'Set2FA' : {
					return await library.progress.__set2FA(params); 
				};
				case 'Register' : {
					return await library.progress.__register(params); 
				};
				case 'Summary' : {
					return await library.progress.__summary(params); 
                };
                case 'GetDepositAddress' : {
					return await library.progress.__getDepositAddress(params); 
                };
                case 'UpdateWallet' : {
					return await library.progress.__updateWallet(params); 
                };
                case 'CreateAPIToken' : {
					return await library.progress.__createApiToken(params); break;
                };
                case 'GetBets' : {
					return await library.progress.__getBets(params); break;
                };
                case 'GetInfo' : {
					return await library.progress.__getInfo(params); break;
                };
                case 'ResetPassword' : {
					return await library.progress.__resetPassword(params); break;
                };
                case 'SetPassword' : {
					return await library.progress.__setPassword(params); break;
                };
			}
		}catch(err){
			throw err;
		}
	}
}

// Export Default Module
export default UserLogic;