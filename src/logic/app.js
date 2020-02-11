import _ from 'lodash';
import { ErrorManager } from '../controllers/Errors';
import { AppRepository, AdminsRepository, WalletsRepository, DepositRepository, UsersRepository,
    GamesRepository, ChatRepository, TopBarRepository, 
    BannersRepository, LogoRepository, FooterRepository, ColorRepository, 
    AffiliateRepository, CurrencyRepository 
} from '../db/repos';
import LogicComponent from './logicComponent';
import MiddlewareSingleton from '../api/helpers/middleware';
import { getServices, fromDecimals, verifytransactionHashDirectDeposit } from './services/services';
import { Game, Deposit, Withdraw, AffiliateSetup, Link, Wallet } from '../models';
import CasinoContract from './eth/CasinoContract';
import { globals } from '../Globals';
import Numbers from './services/numbers';
import { fromPeriodicityToDates } from './utils/date';
import GamesEcoRepository from '../db/repos/ecosystem/game';
import { throwError } from '../controllers/Errors/ErrorManager';
import GoogleStorageSingleton from './third-parties/googleStorage';
import { isHexColor } from '../helpers/string';
import { HerokuClientSingleton, BitGoSingleton } from './third-parties';

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
        const { affiliateSetup, integrations, customization } = params;
        let admin = await AdminsRepository.prototype.findAdminById(params.admin_id);
        if(!admin){throwError('USER_NOT_EXISTENT')}

        // Get App by Appname
		let normalized = {
            address             : params.address,
            hasAppAlready       : admin.app ? true : false,
            services            : params.services, // Array
            admin_id		    : admin._id,
            name    			: params.name,
            affiliateSetup,       
            customization,
            integrations,
			description         : params.description,
			marketType          : params.marketType,
			metadataJSON        : JSON.parse(params.metadataJSON),
			listAdmins          : [admin._id],
			licensesId          : [], // TO DO
			countriesAvailable  : [], // TO DO
			isVerified          : false
		}
		return normalized;
    },
    __get : async (params) => {
        let app = await AppRepository.prototype.findAppById(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}
        // Get App by Appname
		let normalized = {
            ...app
        }
		return normalized;
    },
    __deployApp : async (params) => {
        let app = await AppRepository.prototype.findAppById(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}
        // Get App by Appname
        let normalized = {
            app
        }
		return normalized;
    },
	__summary : async (params) => {
        let normalized = {
            type : new String(params.type).toLowerCase().trim(),
            app : new String(params.app).trim(),
            opts : {
                dates : fromPeriodicityToDates({periodicity : params.periodicity}),
                currency : params.currency
                // Add more here if needed
            }
        }

       return normalized;
    },
    __addCurrencyWallet : async (params) => {
        
        var { currency_id, app, passphrase } = params;

        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')}

        let currency = await CurrencyRepository.prototype.findById(currency_id);

        return  {
            currency, 
            passphrase,
            app : app
        }
    },
	__addServices : async (params) => {
        let services = getServices(params.services);
        let res = await AppRepository.prototype.addServices(params.app, services);
		return res;
    },
    __addGame : async (params) => {
        let gameEcosystem = await GamesEcoRepository.prototype.findGameById(params.game);

        let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);

        if(!app){throwError('APP_NOT_EXISTENT')}

        //TO DO : verify if Metaname is already in the games of app
        let res = {
            gameEcosystem,
            app
        }
		return res;
    },
    __getLastBets : async (params) => {
        let res = await AppRepository.prototype.getLastBets({
            id : params.app,
            size : params.size
        });
		return res;
    },
    __getBiggestBetWinners : async (params) => {
        let res = await AppRepository.prototype.getBiggestBetWinners({
            id : params.app,
            size : params.size
        });
		return res;
    },
    __getBiggestUserWinners : async (params) => {
        let res = await AppRepository.prototype.getBiggestUserWinners({
            id : params.app,
            size : params.size
        });
		return res;
    },
    __getPopularNumbers : async (params) => {
        let res = await AppRepository.prototype.getPopularNumbers({
            id : params.app,
            size : params.size 
        });
		return res;
    },
    __updateWallet : async (params) => {
        var { currency, id, wBT } = params;
        /* Get App Id */
        var app = await AppRepository.prototype.findAppById(id);
        if(!app){throwError('APP_NOT_EXISTENT')}
        const wallet = app.wallet.find( w => new String(w.currency._id).toString() == new String(currency).toString());
        if(!wallet || !wallet.currency){throwError('CURRENCY_NOT_EXISTENT')};

        /* Verify if the transactionHash was created */
        const { state, entries, value : amount, type, txid : transactionHash } = wBT;
        
        const from = entries[0].address;
        const isValid = ((state == 'confirmed') && (type == 'receive'));

        /* Verify if this transactionHashs was already added */
        let deposit = await DepositRepository.prototype.getDepositByTransactionHash(transactionHash);

        let wasAlreadyAdded = deposit ? true : false;
    
        return  {
            app                 : app,
            app_id              : app._id,
            wallet              : wallet,
            creationDate        : new Date(),
            transactionHash     : transactionHash,
            from                : from,
            amount              : amount,
            wasAlreadyAdded,
            isValid
        }
    },
    __getTransactions : async (params) => {
        let {
            app, filters
        } = params;
        let res = await DepositRepository.prototype.getTransactionsByApp(app, filters);
		return res;
    },
    __getGames : async (params) => {
        // Get Specific App Data
        let res = await AppRepository.prototype.findAppById(params.app);
        if(!res){throwError('APP_NOT_EXISTENT')}

        return res.games;
    },
    __createApiToken : async (params) => {
		let normalized = {
            ...params,
            bearerToken : MiddlewareSingleton.sign(params.app)
        }
		return normalized;
    },
    __editGameTableLimit : async (params) => {

        let { game, app, tableLimit} = params;
        
        game = await GamesRepository.prototype.findGameById(game);
        app = await AppRepository.prototype.findAppByIdNotPopulated(app);
        if(!game){throwError('GAME_NOT_EXISTENT')}
        if(!app){throwError('APP_NOT_EXISTENT')}

        // Verify if Game is part of this App
        let isValid = app.games.find( id => id.toString() == game._id.toString())

		let normalized = {
            game, 
            app,
            tableLimit,
            isValid
        }
		return normalized;
    },
    __editGameEdge : async (params) => {
        let { game, app, edge } = params;
        game = await GamesRepository.prototype.findGameById(game);
        app = await AppRepository.prototype.findAppByIdNotPopulated(app);
        if(!game){throwError('GAME_NOT_EXISTENT')}
        if(!app){throwError('APP_NOT_EXISTENT')}

        // Verify if Game is part of this App
        let isValid = app.games.find( id => id.toString() == game._id.toString())

		let normalized = {
            game, 
            app,
            edge,
            isValid
        }

		return normalized;
    },
    __editAffiliateStructure : async (params) => {
        let { app, structures, affiliateTotalCut } = params;
        app = await AppRepository.prototype.findAppById(app, 'affiliates');
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            affiliateTotalCut,
            app_id : app._id,
            affiliateSetup : app.affiliateSetup,
            structures
        }
    },
    __editIntegration : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return params;
    },
    __editTopBar : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editBanners : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editLogo : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editColors : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editFooter : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __getUsers : async (params) => {
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
        let app = await self.save(params);
        await AdminsRepository.prototype.addApp(params.admin_id, app);
        let bearerToken = MiddlewareSingleton.sign(app._id);
        await AppRepository.prototype.createAPIToken(app._id, bearerToken);
		return app;
	},
	__summary : async (params) => {
        // Get Specific App Data
        let res = await AppRepository.prototype.getSummaryStats(params.type, params.app, params.opts);
        return res;
    },
    __deployApp : async (params) => {

        const { _id, name } = params.app;
        /* Deploy App on Heroku */
        let { heroku_id, web_url } = await HerokuClientSingleton.setupClientPlatform({id : _id, name : name.split(' ').join('-')});
        /* Store Information */
        await AppRepository.prototype.setHostingInformation(_id, { hosting_id : heroku_id, web_url});
        /* Return */
        return true;
    },
    __get : async (params) => {
        let res = params;
		return res;
    },
    __getGames : async (params) => {
        let res = params;
		return res;
    },
    __getTransactions : async (params) => {
        let res = params;
		return res;
    },
    __addCurrencyWallet : async (params) => {
        const { currency, passphrase, app } = params;
        /* Create Wallet on Bitgo */
        var { wallet : bitgo_wallet, receiveAddress, keys } = await BitGoSingleton.createWallet({
            label : `${app._id}-${currency.ticker}`,
            passphrase,
            currency : currency.ticker
        })
        /* Record webhooks */
        await BitGoSingleton.addAppDepositWebhook({wallet : bitgo_wallet, id : app._id, currency_id : currency._id});

        /* Create Policy for Day */
        await BitGoSingleton.addPolicyToWallet({
            ticker : currency.ticker,
            bitGoWalletId : bitgo_wallet.id(),
            timeWindow : 'day'
        })

        /* Create Policy for Transaction */
        await BitGoSingleton.addPolicyToWallet({
            ticker : currency.ticker,
            bitGoWalletId : bitgo_wallet.id(),
            timeWindow : 'hour',
        })

        /* Create Policy for Hour */
        await BitGoSingleton.addPolicyToWallet({
            ticker : currency.ticker,
            bitGoWalletId : bitgo_wallet.id(),
            timeWindow : 'transaction',
        })

        /* No Bitgo Wallet created */
        if(!bitgo_wallet.id() || !receiveAddress){throwError('UNKNOWN')};

        /* Save Wallet on DB */
        let wallet = (await (new Wallet({
            currency : currency._id,
            bitgo_id : bitgo_wallet.id(),
            bank_address : receiveAddress
        })).register())._doc;

        /* Add Currency to Platform */
        await AppRepository.prototype.addCurrency(app._id, currency._id);
        await AppRepository.prototype.addCurrencyWallet(app._id, wallet);


        /* Add Wallet to all Users */
    
        await Promise.all(await app.users.map( async u => {
            let w = (await (new Wallet({
                currency : currency._id
            })).register())._doc;
            await UsersRepository.prototype.addCurrencyWallet(u._id, w);

            let wAffiliate = (await (new Wallet({
                currency : currency._id
            })).register())._doc;
            await AffiliateRepository.prototype.addCurrencyWallet(u.affiliate, wAffiliate);
        }));
        

        return {
            currency_id : currency._id,
            keys : keys,
            bank_address : receiveAddress
        }
    },
    __addServices : async (params) => {
        let res = params;
		return res;
    },
    __addGame : async (params) => {
        const { app, gameEcosystem } = params;
        let game = new Game({
            app             : app,
            edge            : 0,
            name            : gameEcosystem.name,
            resultSpace     : gameEcosystem.resultSpace,
            rules           : gameEcosystem.rules,
            image_url       : gameEcosystem.image_url,
            metaName        : gameEcosystem.metaName,
            betSystem       : 0, // Auto
            description     : gameEcosystem.description
        })

        await game.register();

		return params;
    },
    __getLastBets : async (params) => {
        let res = params;
		return res;
    },
    __getBiggestBetWinners : async (params) => {
        let res = params;
		return res;
    },
    __getBiggestUserWinners : async (params) => {
        let res = params;
		return res;
    },
    __getPopularNumbers : async (params) => {
        let res = params;
		return res;
    },
    __updateWallet : async (params) => {
        
        /* Create Deposit Object */
        let deposit = new Deposit({
            app                     : params.app._id,
            transactionHash         : params.transactionHash,
            creation_timestamp      : params.creationDate,                    
            last_update_timestamp   : params.creationDate,                             
            address                 : params.from,                         
            currency                : params.wallet.currency._id,
            amount                  : params.amount,
        })

        /* Save Deposit Data */
        let depositSaveObject = await deposit.createDeposit();
        
        /* Update Balance of App */
        await WalletsRepository.prototype.updatePlayBalance(params.wallet, params.amount);
        
        /* Add Deposit to App */
        await AppRepository.prototype.addDeposit(params.app_id, depositSaveObject._id)

        return params;
    },
    __createApiToken : async (params) => {
        let res = await AppRepository.prototype.createAPIToken(params.app, params.bearerToken)
		return res;
    },
    __editGameTableLimit : async (params) => {
        let { game, tableLimit} = params;

        let res = await GamesRepository.prototype.editTableLimit({
            id : game._id,
            tableLimit
        });

		return res;
    },
    __editGameEdge : async (params) => {
        let { game, edge} = params;

        let res = await GamesRepository.prototype.editEdge({
            id : game._id,
            edge
        });

		return res;
    },
    __editAffiliateStructure : async (params) => {

        var { affiliateSetup, structures, app_id } = params;
        /* Create Affiliate Setup if needed */
        const affiliateSetupSaved = (await (new AffiliateSetup({
            previousAffiliateSetup : affiliateSetup,
            structures
        })).register());
        const affiliateSetupId = (affiliateSetupSaved._id || affiliateSetupSaved._doc._id);
        
        /* Create Affiliate Structures */
        return await AppRepository.prototype.editAffiliateSetup(app_id, affiliateSetupId)
    },
    __editIntegration : async (params) => {
        let { publicKey, privateKey, integration_type, integration_id, isActive } = params;
        /* Update Integrations Id Type */
        switch(integration_type){
            case 'live_chat' : {
                await ChatRepository.prototype.findByIdAndUpdate(integration_id, {
                    publicKey,
                    privateKey, 
                    integration_type,
                    integration_id,
                    isActive
                })
            }
        }
        return params;
    },
    __editTopBar  : async (params) => {
        let { app, backgroundColor, textColor, text, isActive } = params;
        const { topBar } = app.customization;
        await TopBarRepository.prototype.findByIdAndUpdate(topBar._id, {
            textColor,
            backgroundColor, 
            text,
            isActive
        })
        return params;
    },
    __editBanners : async (params) => {
        let { app, autoDisplay, banners } = params;
        let ids = await Promise.all(banners.map( b => {
            if(b.includes("https")){
                /* If it is a link already */
                return b;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : b});
            }
        }))
        await BannersRepository.prototype.findByIdAndUpdate(app.customization.banners._id, {
            autoDisplay,
            ids
        })
        // Save info on Customization Part
        return params;
    },
    __editLogo : async (params) => {
        let { app, logo } = params;
        let logoURL;
        if(logo.includes("https")){
            /* If it is a link already */
            logoURL = logo;
        }else{
            /* Does not have a Link and is a blob encoded64 */
            logoURL = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : logo});
        }

        await LogoRepository.prototype.findByIdAndUpdate(app.customization.logo._id, {
            id : logoURL
        })
        // Save info on Customization Part
        return params;
    },
    __editColors : async (params) => {
        let { app, colors } = params;
        /* Update all colors info */
        await Promise.all(app.customization.colors.map( async c => {
            const correspondentColorType = colors.find( ci => ci.type.toLowerCase() == c.type.toLowerCase());
            /* Not right type */
            if(!correspondentColorType || !isHexColor(new String(correspondentColorType.hex).toString())){return null}
            return await ColorRepository.prototype.findByIdAndUpdate(c._id, {
                type : correspondentColorType.type,
                hex : correspondentColorType.hex.toLowerCase()
            })
        }));
        /* Rebuild the App */
//         await HerokuClientSingleton.deployApp({app : app.hosting_id})
        // Save info on Customization Part
        return params;
    },
    __editFooter : async (params) => {
        let { app, communityLinks, supportLinks } = params;
        let communityLinkIDs = await Promise.all(communityLinks.map( async c => {
            return (await new Link(c).register())._doc._id
        }));

        let supportLinkIDs = await Promise.all(supportLinks.map( async c => {
            return (await new Link(c).register())._doc._id
        }));

        await FooterRepository.prototype.findByIdAndUpdate(app.customization.footer._id, {
            communityLinks : communityLinkIDs,
            supportLinks : supportLinkIDs,
        })

        // Save info on Customization Part
        return params;
    },
    __getUsers : async (params) => {
        let res = await UsersRepository.prototype.getAllFiltered(params);
        return res;
    }
}

/**
 * Main App logic.
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
 * @property {App_model} model
 * @property {App_schema} schema
 * @returns {setImmediate} error, this
 * @todo Add description for the params
*/


class AppLogic extends LogicComponent{
	constructor(scope) {
		super(scope);
		self = this;
		__private = {
			//ADD
			db : scope.db,
			__normalizedSelf : null
		};

		library = {
			process  : processActions,
			progress : progressActions
		}
    }


    /**
	 * Validates App schema.
	 *
	 * @param {App} App
	 * @returns {App} App
	 * @throws {string} On schema.validate failure
	 */
	async objectNormalize(params, processAction) {
		try{			
			switch(processAction) {
				case 'Register' : {
					return await library.process.__register(params); break;
				};
				case 'Summary' : {
					return await library.process.__summary(params); break;
                };
                case 'DeployApp' : {
					return await library.process.__deployApp(params); break;
                };
                case 'Get' : {
					return await library.process.__get(params); break;
                };
                case 'GetGames' : {
					return await library.process.__getGames(params); break;
                };
                case 'GetTransactions' : {
					return await library.process.__getTransactions(params); break;
                };
                case 'AddCurrencyWallet' : {
					return await library.process.__addCurrencyWallet(params); break;
                };
                case 'AddServices' : {
					return await library.process.__addServices(params); break;
                };
                case 'AddGame' : {
					return await library.process.__addGame(params); break;
                };
                case 'UpdateWallet' : {
					return await library.process.__updateWallet(params); break;
                };
                case 'CreateAPIToken' : {
					return await library.process.__createApiToken(params); break;
                };
                case 'EditGameTableLimit' : {
                    return await library.process.__editGameTableLimit(params); break;
                };
                case 'EditAffiliateStructure' : {
                    return await library.process.__editAffiliateStructure(params); break;
                };
                case 'EditIntegration' : {
                    return await library.process.__editIntegration(params); break;
                };
                case 'EditGameEdge' : {
                    return await library.process.__editGameEdge(params); break;
                };
                case 'EditTopBar' : {
                    return await library.process.__editTopBar(params); break;
                };
                case 'EditBanners' : {
                    return await library.process.__editBanners(params); break;
                };
                case 'EditLogo' : {
                    return await library.process.__editLogo(params); break;
                };
                case 'EditFooter' : {
                    return await library.process.__editFooter(params); break;
                };
                case 'EditColors' : {
                    return await library.process.__editColors(params); break;
                };
                case 'GetLastBets' : {
					return await library.process.__getLastBets(params); break;
                };
                case 'GetBiggestBetWinners' : {
					return await library.process.__getBiggestBetWinners(params); break;
                };
                case 'GetBiggestUserWinners' : {
					return await library.process.__getBiggestUserWinners(params); break;
                };
                case 'GetPopularNumbers' : {
					return await library.process.__getPopularNumbers(params); break;
                };
                case 'GetUsers' : {
					return await library.process.__getUsers(params); break;
                };
			}
			
		}catch(error){
			throw error
		}
	}

	 /**
	 * Tests App schema.
	 *
	 * @param {App} App
	 * @returns {App} App
	 * @throws {string} On schema.validate failure
	 */

	async testParams(params, action){
		try{
			error.app(params, action);
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
                case 'AddCurrencyWallet' : {
					return await library.progress.__addCurrencyWallet(params); break;
                };
                case 'AddServices' : {
					return await library.progress.__addServices(params); break;
                };
                case 'AddGame' : {
					return await library.progress.__addGame(params); break;
                };
                case 'UpdateWallet' : {
					return await library.progress.__updateWallet(params); break;
                };
				case 'Summary' : {
					return await library.progress.__summary(params); break;
                };
                case 'DeployApp' : {
					return await library.progress.__deployApp(params); break;
                };
                case 'Get' : {
					return await library.progress.__get(params); break;
                };
                case 'GetGames' : {
					return await library.progress.__getGames(params); break;
                };
                case 'GetTransactions' : {
					return await library.progress.__getTransactions(params); break;
                };
                case 'CreateAPIToken' : {
					return await library.progress.__createApiToken(params); break;
                };
                case 'EditGameTableLimit' : {
                    return await library.progress.__editGameTableLimit(params); break;
                };
                case 'EditGameEdge' : {
                    return await library.progress.__editGameEdge(params); break;
                };
                case 'EditAffiliateStructure' : {
                    return await library.progress.__editAffiliateStructure(params); break;
                };
                case 'EditIntegration' : {
                    return await library.progress.__editIntegration(params); break;
                };
                case 'EditTopBar' : {
                    return await library.progress.__editTopBar(params); break;
                };
                case 'EditBanners' : {
                    return await library.progress.__editBanners(params); break;
                };
                case 'EditLogo' : {
                    return await library.progress.__editLogo(params); break;
                };
                case 'EditColors' : {
                    return await library.progress.__editColors(params); break;
                };
                case 'EditFooter' : {
                    return await library.progress.__editFooter(params); break;
                };
                case 'GetLastBets' : {
					return await library.progress.__getLastBets(params); break;
                };
                case 'GetBiggestBetWinners' : {
					return await library.progress.__getBiggestBetWinners(params); break;
                };
                case 'GetBiggestUserWinners' : {
					return await library.progress.__getBiggestUserWinners(params); break;
                };
                case 'GetPopularNumbers' : {
					return await library.progress.__getPopularNumbers(params); break;
                };
                case 'GetUsers' : {
					return await library.progress.__getUsers(params); break;
                };
                
			}
		}catch(error){
			throw error;
		}
	}
}

// Export Default Module
export default AppLogic;

