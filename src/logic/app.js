import _ from 'lodash';
import { ErrorManager } from '../controllers/Errors';
import {
    AppRepository,
    AdminsRepository,
    WalletsRepository,
    DepositRepository,
    UsersRepository,
    GamesRepository,
    ChatRepository,
    TopBarRepository,
    BannersRepository,
    LogoRepository,
    FooterRepository,
    ColorRepository,
    AffiliateRepository,
    CurrencyRepository,
    TypographyRepository,
    TopIconRepository,
    MailSenderRepository,
    LoadingGifRepository,
    AddressRepository,
    AddOnRepository,
    AutoWithdrawRepository,
    LogRepository,
    BetRepository,
    CustomizationRepository,
    TxFeeRepository,
    BackgroundRepository,
    DepositBonusRepository
} from '../db/repos';
import LogicComponent from './logicComponent';
import { getServices } from './services/services';
import { Game, Jackpot, Deposit, AffiliateSetup, Link, Wallet, AutoWithdraw, Balance, DepositBonus, Address } from '../models';
import { fromPeriodicityToDates } from './utils/date';
import GamesEcoRepository from '../db/repos/ecosystem/game';
import { throwError } from '../controllers/Errors/ErrorManager';
import GoogleStorageSingleton from './third-parties/googleStorage';
import { isHexColor } from '../helpers/string';
import { mail } from '../mocks';
import { SendInBlueAttributes } from './third-parties';
import { HerokuClientSingleton, BitGoSingleton } from './third-parties';
import { Security } from '../controllers/Security';
import { SendinBlueSingleton, SendInBlue } from './third-parties/sendInBlue';
import { PUSHER_APP_KEY, PRICE_VIRTUAL_CURRENCY_GLOBAL } from '../config';
import {AddOnsEcoRepository} from '../db/repos';
import addOnRepository from '../db/repos/addOn';
import { LastBetsRepository, BiggestBetWinnerRepository, BiggestUserWinnerRepository, PopularNumberRepository } from "../db/repos/redis";
import PerfomanceMonitor from '../helpers/performance';
import TxFee from '../models/txFee';
let error = new ErrorManager();
let perf = new PerfomanceMonitor({id : 'app'});


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
        const { affiliateSetup, integrations, customization, addOn, typography, virtual } = params;
        
        let admin = await AdminsRepository.prototype.findAdminById(params.admin_id);
        if(!admin){throwError('USER_NOT_EXISTENT')}

        // Get App by Appname
		let normalized = {
            address             : params.address,
            hasAppAlready       : admin.app ? true : false,
            services            : params.services, // Array
            admin_id		    : admin._id,
            virtual             : virtual,
            name    			: params.name,
            affiliateSetup,       
            customization,
            integrations,
            addOn,
			description         : params.description,
			marketType          : params.marketType,
			metadataJSON        : JSON.parse(params.metadataJSON),
			listAdmins          : [admin._id],
			licensesId          : [], // TO DO
            countriesAvailable  : [], // TO DO
            restrictedCountries : [],
            isVerified          : false,
            typography
		}
		return normalized;
    },
    __getGameStats : async (params) => {
        let app = await AppRepository.prototype.findAppById(params.app, "get_app_auth");
        if(!app){throwError('APP_NOT_EXISTENT')}
        let admin = await AdminsRepository.prototype.findAdminById(params.admin);
        if(!admin){throwError('USER_NOT_EXISTENT')}
        let game = await AppRepository.prototype.getSummaryOneStats(params.app, { currency: params.currency, game: params.game });
        return game;
    },
    __get : async (params) => {
        perf.start({id :'get_app_perf'});
        let app = await AppRepository.prototype.findAppById(params.app, 'simple');
        perf.end({id :'get_app_perf'});
        perf.start({id :'add_ons'});
        let addOns  = await AddOnsEcoRepository.prototype.getAll();
        perf.end({id :'add_ons'});
        if(!app){throwError('APP_NOT_EXISTENT')}
        // Get App by Appname
		let normalized = {
            ...app,
            storeAddOn: addOns
        }
		return normalized;
    },
    __getAuth : async (params) => {
        let app = await AppRepository.prototype.findAppById(params.app, "get_app_auth");
        let addOns  = await AddOnsEcoRepository.prototype.getAll();
        if(!app){throwError('APP_NOT_EXISTENT')}
        // Get App by Appname
		let normalized = {
            ...app,
            storeAddOn: addOns
        }
		return normalized;
    },
    __modifyBalance : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if(!app){throwError('APP_NOT_EXISTENT');}
            let user = await UsersRepository.prototype.findUserById(params.user, "simple");
            if(new String(user.app_id).toString() != new String(app._id).toString()){throwError('USER_NOT_EXISTENT_IN_APP');}
            let wallet = user.wallet.find( w => new String(w._id).toString() == new String(params.wallet).toString());
            if(!wallet){throwError('CURRENCY_NOT_EXISTENT');}
            return params;
        } catch(err) {
            throw err;
        }
    },
    __getLogs : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if(!app){throwError('APP_NOT_EXISTENT')}

            let offset  = (params.offset == undefined) ? 0 : params.offset;
            let limit   = (params.limit == undefined) ? 0 : params.limit;

            let res = await LogRepository.prototype.findFilter(app._id, parseInt(offset), parseInt(limit), params.filter);
            return res;
        } catch(err) {
            throw err;
        }
    },
    __deployApp : async (params) => {
        let app = await AppRepository.prototype.findAppById(params.app, "simple");
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
    __appGetUsersBets : async (params) => {
        var res = ""
        if(!params.username){
            res = await AppRepository.prototype.getAppBets({
                _id : params.app,
                offset: params.offset,
                size : params.size,
                user: params.user == undefined ? {} : {user : params.user},
                bet: params.bet == undefined ? {} : {_id : params.bet},
                currency: params.currency == undefined ? {} : {currency : params.currency},
                game: params.game == undefined ? {} : {game : params.game},
                isJackpot: (params.isJackpot == undefined) ? {} : {isJackpot : params.isJackpot}
            });
        } else {
            res = await AppRepository.prototype.getAppBetsPipeline({
                app : params.app,
                offset: params.offset,
                size : params.size,
                user: params.user,
                _id: params.bet,
                currency: params.currency,
                game: params.game,
                isJackpot: params.isJackpot,
                username: params.username
            });
        }
		return res;
    },
    __getBetInfo : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if (!app){ throwError('APP_NOT_EXISTENT') }
            let bet = await BetRepository.prototype.findBetById(params.bet);
            return bet;
        } catch(err) {
            throw err;
        }
    },
    __editRestrictedCountries : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if (!app){ throwError('APP_NOT_EXISTENT') }
            return params;
        } catch(err) {
            throw err;
        }
    },
    __addCurrencyWallet : async (params) => {
        var { currency_id, app, passphrase } = params;

        app = await AppRepository.prototype.findAppById(app, "simple");
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
        let wallets = await Promise.all(app.wallet.map( async w => {
            return {
                wallet      : w,
                tableLimit  : 0
            }
        }));

        //TO DO : verify if Metaname is already in the games of app
        let res = {
            wallets,
            gameEcosystem,
            app
        }
		return res;
    },
    __addAddonJackpot : async (params) => {
        try {
            let gameEcosystem = await GamesEcoRepository.prototype.findGameByMetaName("jackpot_auto");
            let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);

            if(!app){throwError('APP_NOT_EXISTENT')}

            let arrayCurrency = await CurrencyRepository.prototype.getAll();

            let limits = await Promise.all(arrayCurrency.map( async c => {
                return {
                    currency      : c._id,
                    tableLimit    : 0,
                    maxBet        : 0
                }
            }));

            let res = {
                limits,
                app,
                gameEcosystem
            }
            return res;
        } catch(err) {
            throw err;
        }
    },
    __addAddonAutoWithdraw : async (params) => {
        let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}

        let arrayCurrency = await CurrencyRepository.prototype.getAll();

        let maxWithdrawAmountCumulative = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                amount      : 0
            }
        }));
        let maxWithdrawAmountPerTransaction = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                amount      : 0
            }
        }));

        let res = {
            maxWithdrawAmountPerTransaction,
            maxWithdrawAmountCumulative,
            app
        }
		return res;
    },
    __addAddonBalance : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
            if(!app){throwError('APP_NOT_EXISTENT')}

            let arrayCurrency = await CurrencyRepository.prototype.getAll();

            let initialBalanceList = await Promise.all(arrayCurrency.map( async c => {
                return {
                    currency        : c._id,
                    initialBalance  : 0,
                }
            }));
            let res = {
                app,
                initialBalanceList
            }
            return res;
        } catch(err) {
            throw err;
        }
    },
    __addAddonTxFee : async (params) => {
        let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}

        let arrayCurrency = await CurrencyRepository.prototype.getAll();

        let deposit_fee = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                amount      : 0
            }
        }));

        let withdraw_fee = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                amount      : 0
            }
        }));

        let res = {
            deposit_fee,
            withdraw_fee,
            app
        }
		return res;
    },
    __editAddonTxFee : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
            if(!app){throwError('APP_NOT_EXISTENT')}
            let addOn = await AddOnRepository.prototype.findById(app.addOn)
            if(!addOn){throwError('UNKNOWN')}
            let txFee = await TxFeeRepository.prototype.findById(addOn.txFee)
            if(!txFee){throwError('UNKNOWN')}
            let res = {
                txFee,
                currency : params.currency,
                txFeeParams : params.txFeeParams
            }
		    return res;
        } catch (err) {
            throw err
        }
    },
    __addAddonDepositBonus : async (params) => {
        let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}

        let arrayCurrency = await CurrencyRepository.prototype.getAll();

        let min_deposit = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                amount      : 0
            }
        }));

        let percentage = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                amount      : 0
            }
        }));

        let max_deposit = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                amount      : 0
            }
        }));

        let multiplier = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                multiple      : 0
            }
        }));

        let res = {
            min_deposit,
            percentage,
            max_deposit,
            multiplier,
            app
        }
		return res;
    },
    __editAddonDepositBonus : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
            if(!app){throwError('APP_NOT_EXISTENT')}
            let addOn = await AddOnRepository.prototype.findById(app.addOn)
            if(!addOn){throwError('ADD_ON_NOT_EXISTS')}
            let depositBonus = await DepositBonusRepository.prototype.findById(addOn.depositBonus)
            if(!depositBonus){throwError('ADD_ON_DEPOSIT_BONUS_NOT_EXISTS')}
            let res = {
                depositBonus,
                currency : params.currency,
                depositBonusParams : params.depositBonusParams
            }
		    return res;
        } catch (err) {
            throw err
        }
    },
    __editAddonAutoWithdraw : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
            if(!app){throwError('APP_NOT_EXISTENT')}
            let addOn = await AddOnRepository.prototype.findById(app.addOn)
            if(!addOn){throwError('UNKNOWN')}
            let autoWithdraw = await AutoWithdrawRepository.prototype.findById(addOn.autoWithdraw)
            if(!autoWithdraw){throwError('UNKNOWN')}
            let res = {
                autoWithdraw,
                currency : params.currency,
                autoWithdrawParams : params.autoWithdrawParams
            }
		    return res;
        } catch (err) {
            throw err
        }
    },
    __getLastBets : async (params) => {
        let res = await LastBetsRepository.prototype.getLastBets({
            _id : params.app,
            game: params.game == undefined ? {game: null} : {game: params.game}
        });
		return res;
    },
    __getBiggestBetWinners : async (params) => {
        let res = await BiggestBetWinnerRepository.prototype.getBiggetsBetWinner({
            _id : params.app,
            game: params.game == undefined ? {game: null} : {game: params.game}
        });
		return res;
    },
    __getBiggestUserWinners : async (params) => {
        let res = await BiggestUserWinnerRepository.prototype.getBiggetsUserWinner({
            _id : params.app
        });
		return res;
    },
    __getPopularNumbers : async (params) => {
        let res = await PopularNumberRepository.prototype.getPopularNumber({
            id : params.app
        });
		return res;
    },
    __updateWallet : async (params) => {
        var { currency, id, wBT } = params;
        /* Get App Id */
        var app = await AppRepository.prototype.findAppById(id, "simple");
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
            app, filters, size, offset
        } = params;
        let res = await DepositRepository.prototype.getTransactionsByApp(app, filters, size == undefined ? 200 : size, offset == undefined ? 0 : offset);
		return res;
    },
    __getGames : async (params) => {
        // Get Specific App Data
        let res = await GamesRepository.prototype.findGameByApp(params.app);
        if(!res){throwError('APP_NOT_EXISTENT')}
        return res;
    },
    __editGameTableLimit : async (params) => {

        let { game, app, tableLimit, wallet } = params;
        
        game = await GamesRepository.prototype.findGameById(game);
        app = await AppRepository.prototype.findAppByIdNotPopulated(app);
        if(!game){throwError('GAME_NOT_EXISTENT')}
        if(!app){throwError('APP_NOT_EXISTENT')}

        // Verify if Game is part of this App
        let isValid = app.games.find( id => id.toString() == game._id.toString())
        let walletFind = app.wallet.find( w => w.toString() == wallet );

		let normalized = {
            game,
            app,
            tableLimit,
            isValid,
            wallet: walletFind
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
	__editGameImage: async (params) => {
        let { game, app, image_url } = params;
        
        game = await GamesRepository.prototype.findGameById(game);
        app = await AppRepository.prototype.findAppByIdNotPopulated(app);
        if(!game){throwError('GAME_NOT_EXISTENT')}
        if(!app){throwError('APP_NOT_EXISTENT')}

         // Verify if Game is part of this App
         let isValid = app.games.find( id => id.toString() == game._id.toString())
        
         /* Normalize data of Game */
		let normalized = {
            game, 
            app,
            image_url,
            isValid
		}
		return normalized;
    },
    
    __editGameBackgroundImage: async (params) => {
        let { game, app, background_url } = params;
        
        game = await GamesRepository.prototype.findGameById(game);
        app = await AppRepository.prototype.findAppByIdNotPopulated(app);
        if(!game){throwError('GAME_NOT_EXISTENT')}
        if(!app){throwError('APP_NOT_EXISTENT')}

         // Verify if Game is part of this App
         let isValid = app.games.find( id => id.toString() == game._id.toString())
        
         /* Normalize data of Game */
		let normalized = {
            game, 
            app,
            background_url,
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
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return params;
    },
    __editMailSenderIntegration : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return params;
    },
    __editTheme : async (params) => {
        let { app, theme } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        if((theme != "dark") && (theme != "light")){ throwError('WRONG_THEME') }
        return {
            ...params,
            app
        };
    },
    __editTopBar : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editBanners : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editBackground : async (params) => {
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
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editColors : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editFooter : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editTopIcon : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editLoadingGif : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editTypography: async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        let typography = await TypographyRepository.prototype.findById(app.typography._id);

        if (!app) { throwError('APP_NOT_EXISTENT') };

        return {
            ...params,
            app,
            oldTypography: typography
        };
    },
    __getUsers : async (params) => {
        return params;
    },
    __generateAddresses : async (params) => {
        console.log("here")
        let { app, currency, amount } = params;
        app = await AppRepository.prototype.findAppById(app, "address");
        if (!app) { throwError('APP_NOT_EXISTENT') };
        const app_wallet = app.wallet.find(w => new String(w.currency._id).toString() == new String(currency).toString());
        if (!app_wallet) { throwError('CURRENCY_NOT_EXISTENT') };
        console.log("app_wallet", app_wallet)
        const { availableDepositAddresses } = app_wallet;
        return {
            app_wallet,
            amount,
            availableDepositAddresses,
            app
        };
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
        let admin = await AdminsRepository.prototype.addApp(params.admin_id, app);
        let email = admin.email;
        let attributes = {
            APP: app._id
        };
        let templateId = mail.registerApp.templateId;
        SendinBlueSingleton.updateContact(email, attributes);
        SendinBlueSingleton.sendTemplate(templateId, [email]);
		return app;
    },
    __getGameStats : async (params) => {
        return params;
    },
	__summary : async (params) => {
        // Get Specific App Data
        let res = await AppRepository.prototype.getSummaryStats(params.type, params.app, params.opts);
        return res;
    },
    __appGetUsersBets : async (params) => {
        return params;
    },
    __modifyBalance : async (params) => {
        await WalletsRepository.prototype.updatePlayBalanceNotInc(params.wallet, {newBalance : params.newBalance});
        return true;
    },
    __getLogs : async (params) => {
        return params;
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
        let apiKeyEncrypted = params._doc.integrations.mailSender.apiKey;
        /* Add Decrypted API Key */
        if ((apiKeyEncrypted != null) && (apiKeyEncrypted != undefined)){
            params._doc.integrations.mailSender.apiKey = await Security.prototype.decryptData(apiKeyEncrypted)
        };
        /* Add Pusher API Key */
        if(PUSHER_APP_KEY){
            params._doc.integrations.pusher = {
                key : PUSHER_APP_KEY
            }
        }
		return params;
    },
    __getAuth : async (params) => {
        let apiKeyEncrypted = params._doc.integrations.mailSender.apiKey;
        /* Add Decrypted API Key */
        if ((apiKeyEncrypted != null) && (apiKeyEncrypted != undefined)){
            params._doc.integrations.mailSender.apiKey = await Security.prototype.decryptData(apiKeyEncrypted)
        };
        /* Add Pusher API Key */
        if(PUSHER_APP_KEY){
            params._doc.integrations.pusher = {
                key : PUSHER_APP_KEY
            }
        }
		return params;
    },
    __getGames : async (params) => {
        let res = params;
		return res;
    },
    __getTransactions : async (params) => {
        let res = params;
		return res;
    },
    __getBetInfo : async (params) => {
        try {
            return params;
        } catch(err) {
            throw err;
        }
    },
    __editRestrictedCountries : async (params) => {
        try {
            const {app, countries} = params;
            await AppRepository.prototype.setCountries(app, countries);
            return true;
        } catch(err) {
            throw err;
        }
    },
    __addCurrencyWallet : async (params) => {
        const { currency, passphrase, app } = params;
        var wallet;
        if(currency.virtual){
            /* Save Wallet on DB */
            wallet = (await (new Wallet({
                currency : currency._id,
                virtual : true,
                price : app.currencies.map( c => {
                    return {
                        currency : c._id,
                        amount : PRICE_VIRTUAL_CURRENCY_GLOBAL
                    }
                })
            })).register())._doc;
        }else{


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
            wallet = (await (new Wallet({
                currency : currency._id,
                bitgo_id : bitgo_wallet.id(),
                virtual : false,
                bank_address : receiveAddress,
                hashed_passphrase : Security.prototype.encryptData(passphrase)
            })).register())._doc;

            let virtualWallet = app.wallet.find( w => w.currency.virtual == true);

            if(virtualWallet){
                /* Add Deposit Currency to Virtual Currency */
                await WalletsRepository.prototype.addCurrencyDepositToVirtualCurrency(virtualWallet._id, currency._id);
            }
        }

        /* Add Currency to Platform */
        await AppRepository.prototype.addCurrency(app._id, currency._id);
        await AppRepository.prototype.addCurrencyWallet(app._id, wallet);

        /* Add LimitTable to all Games */
        if(app.games!=undefined) {
            for(let game of app.games) {
                await GamesRepository.prototype.addTableLimitWallet({
                    game    : game._id,
                    wallet  : wallet._id
                });
            }
        }


        /* Add Wallet to all Users */
        await Promise.all(await app.users.map( async u => {
            let w = (await (new Wallet({
                currency : currency._id,
            })).register())._doc;
            await UsersRepository.prototype.addCurrencyWallet(u._id, w);

            let wAffiliate = (await (new Wallet({
                currency : currency._id,
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
        const { app, gameEcosystem, wallets } = params;
        let game = new Game({
            app             : app,
            edge            : 0,
            name            : gameEcosystem.name,
            resultSpace     : gameEcosystem.resultSpace,
            rules           : gameEcosystem.rules,
            image_url       : gameEcosystem.image_url,
            metaName        : gameEcosystem.metaName,
            betSystem       : 0, // Auto
            description     : gameEcosystem.description,
            wallets         : wallets
        })

        const gam = await game.register();

		return params;
    },
    __addAddonJackpot : async (params) => {
        const { app, limits, gameEcosystem } = params;
        let jackpot = new Jackpot({app, limits, resultSpace: gameEcosystem.resultSpace});
        const jackpotResult = await jackpot.register();
        await addOnRepository.prototype.addAddonJackpot(app.addOn, jackpotResult._id);
		return jackpotResult;
    },
    __addAddonAutoWithdraw : async (params) => {
        const { app, maxWithdrawAmountCumulative, maxWithdrawAmountPerTransaction } = params;
        let autoWithdraw = new AutoWithdraw({app, maxWithdrawAmountCumulative, maxWithdrawAmountPerTransaction});
        const autoWithdrawResult = await autoWithdraw.register();
        await addOnRepository.prototype.addAddonAutoWithdraw(app.addOn, autoWithdrawResult._doc._id);
		return autoWithdrawResult;
    },
    __addAddonBalance : async (params) => {
        const { app, initialBalanceList } = params;
        let balance = new Balance({initialBalanceList});
        const balanceResult = await balance.register();
        await addOnRepository.prototype.addAddonBalance(app.addOn, balanceResult._doc._id);
		return balanceResult;
    },
    __addAddonTxFee : async (params) => {
        const { app, deposit_fee, withdraw_fee } = params;
        let txFee = new TxFee({app, deposit_fee, withdraw_fee});
        const txFeeResult = await txFee.register();
        await addOnRepository.prototype.addAddonTxFee(app.addOn, txFeeResult._doc._id);
		return txFeeResult;
    },
    __editAddonTxFee : async (params) => {
        const { txFee, currency, txFeeParams } = params
        await TxFeeRepository.prototype.findByIdAndUpdate(txFee._id, currency, txFeeParams)
        let res = await TxFeeRepository.prototype.findById(txFee._id);
        return res;
    },
    __addAddonDepositBonus : async (params) => {
        const { min_deposit, percentage, max_deposit, multiplier, app } = params;
        let depositBonus = new DepositBonus({app, min_deposit, percentage, max_deposit, multiplier});
        const depositBonusResult = await depositBonus.register();
        await addOnRepository.prototype.addAddonDepositBonus(app.addOn, depositBonusResult._doc._id);
		return depositBonusResult;
    },
    __editAddonDepositBonus : async (params) => {
        const { depositBonus, currency, depositBonusParams } = params
        await DepositBonusRepository.prototype.findByIdAndUpdate(depositBonus._id, currency, depositBonusParams)
        let res = await DepositBonusRepository.prototype.findById(depositBonus._id);
        return res;
    },
    __editAddonAutoWithdraw : async (params) => {
        const { autoWithdraw, currency, autoWithdrawParams } = params
        await AutoWithdrawRepository.prototype.findByIdAndUpdate(autoWithdraw._id, currency, autoWithdrawParams)
        let res = await AutoWithdrawRepository.prototype.findById(autoWithdraw._id);
        return res;
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
        await AppRepository.prototype.addDeposit(params.app._id, depositSaveObject._id)

        return params;
    },
    __editGameTableLimit : async (params) => {
        let { game, tableLimit, wallet} = params;

        let res = await GamesRepository.prototype.editTableLimit({
            id : game._id,
            tableLimit,
            wallet
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
	__editGameImage : async (params) => {
        let { game, image_url } = params;
        let gameImageURL;
        if(image_url.includes("https")){
            /* If it is a link already */
            gameImageURL = image_url;
        }else if(image_url!=""){
            /* Does not have a Link and is a blob encoded64 */
            gameImageURL = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-game-images', file : image_url});
            image_url = gameImageURL
        }
        
        let res = await GamesRepository.prototype.editImage({
            id: game._id,
            image_url
        })
        // Save info on Game
        return res;
    },

    __editGameBackgroundImage : async (params) => {
        let { game, background_url } = params;
        let gameBackgroundImageURL;
        if(background_url.includes("https")){
            /* If it is a link already */
            gameBackgroundImageURL = background_url;
        }else if(background_url!=""){
            /* Does not have a Link and is a blob encoded64 */
            gameBackgroundImageURL = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-game-images', file : background_url});
            background_url = gameBackgroundImageURL
        }
        
        let res = await GamesRepository.prototype.editBackgroundImage({
            id: game._id,
            background_url
        })
        // Save info on Game
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
    __editMailSenderIntegration : async (params) => {
        let { apiKey, templateIds } = params;
        let encryptedAPIKey = await Security.prototype.encryptData(apiKey);
        let mailSender = await MailSenderRepository.prototype.findApiKeyByAppId(params.app);
        let sendinBlueClient = new SendInBlue({key : apiKey});

        /* Test functioning of Client */
        await sendinBlueClient.getContacts();

        if(!mailSender){ throwError('UNKNOWN');}

        await MailSenderRepository.prototype.findByIdAndUpdate(mailSender._id, {
            apiKey : encryptedAPIKey,
            templateIds
        });
        
        for (let attribute of SendInBlueAttributes){
            await sendinBlueClient.createAttribute(attribute).catch((e)=>{
                if(e.response.body.message !== "Attribute name must be unique") {
                    // throwError('UNKNOWN');
                }
            });
        }
        return params;
    },
    __editTheme  : async (params) => {
        let { app, theme } = params;
        let themeResult = await CustomizationRepository.prototype.setTheme(app.customization._id, theme);
        
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return {app: app._id, customization: app.customization._id, theme: themeResult.theme};
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
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return params;
    },
    __editBanners : async (params) => {
        let { app, autoDisplay, banners } = params;
        let ids = await Promise.all(banners.map( async b => {
            if(b.image_url.includes("https")){
                /* If it is a link already */
                return b;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    image_url   : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : b.image_url}),
                    link_url    : b.link_url,
                    button_text : b.button_text,
                    title       : b.title,
                    subtitle    : b.subtitle
                };
            }
        }))
        await BannersRepository.prototype.findByIdAndUpdate(app.customization.banners._id, {
            autoDisplay,
            ids
        })
        // Save info on Customization Part
        return params;
    },
    __editBackground: async (params) => {
        let { app, background } = params;
        let backgroundURL ="";
        if(background.includes("https")){
            /* If it is a link already */
            backgroundURL = background;
        }else if(background!=""){
            /* Does not have a Link and is a blob encoded64 */
            backgroundURL = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : background});
        }

        await BackgroundRepository.prototype.findByIdAndUpdate(app.customization.background._id, {
            id : backgroundURL
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
        await HerokuClientSingleton.deployApp({app : app.hosting_id})
        // Save info on Customization Part
        return params;
    },
    __editFooter : async (params) => {
        let { app, communityLinks, supportLinks } = params;
        let communityLinkIDs = await Promise.all(communityLinks.map( async c => {
            var imageCommunity = ''
            if(c.image_url.includes("https")){
                /* If it is a link already */
                imageCommunity = c.image_url;
            } else {
                imageCommunity = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : c.image_url})
            }
            return (await new Link({
                href: c.href,
                name: c.name,
                image_url: imageCommunity
            }).register())._doc._id
        }));

        let supportLinkIDs = await Promise.all(supportLinks.map( async c => {
            var imageSupport = '';
            if(c.image_url.includes("https")){
                /* If it is a link already */
                imageSupport = c.image_url;
            } else {
                imageSupport = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : c.image_url})
            }
            return (await new Link({
                href: c.href,
                name: c.name,
                image_url: imageSupport
            }).register())._doc._id
        }));

        let footer = await FooterRepository.prototype.findByIdAndUpdate(app.customization.footer._id, {
            communityLinks : communityLinkIDs,
            supportLinks : supportLinkIDs,
        })

        let result = await FooterRepository.prototype.findById(footer._id)
        // Save info on Customization Part
        return result;
    },
    __editTopIcon : async (params) => {
        let { app, topIcon } = params;
        let topIconURL;
        if(topIcon.includes("https")){
            /* If it is a link already */
            topIconURL = topIcon;
        }else{
            /* Does not have a Link and is a blob encoded64 */
            topIconURL = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : topIcon});
        }

        await TopIconRepository.prototype.findByIdAndUpdate(app.customization.topIcon._id, {
            id : topIconURL
        })

        await HerokuClientSingleton.deployApp({app : app.hosting_id})
        
        // Save info on Customization Part
        return params;
    },
    __editLoadingGif : async (params) => {
        let { app, loadingGif } = params;
        let loadingGifURL;
        if(loadingGif.includes("https")){
            /* If it is a link already */
            loadingGifURL = loadingGif;
        }else{
            /* Does not have a Link and is a blob encoded64 */
            loadingGifURL = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : loadingGif});
        }

        await LoadingGifRepository.prototype.findByIdAndUpdate(app.customization.loadingGif._id, {
            id : loadingGifURL
        })
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        // Save info on Customization Part
        return params;
    },
    __editTypography: async (params) => {
        let { app, typography, oldTypography } = params;
        await TypographyRepository.prototype.findByIdAndUpdate(oldTypography._id, typography);
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})
        return params;
    },
    __getUsers : async (params) => {
        let res = await UsersRepository.prototype.getAllFiltered(params);
        return res;
    }, 
    __generateAddresses  : async (params) => {

        const { app_wallet, availableDepositAddresses, amount, app } = params;
        var wallet = await BitGoSingleton.getWallet({ ticker: app_wallet.currency.ticker, id: app_wallet.bitgo_id });
        const currentAddressAmount = availableDepositAddresses.length;
        console.log("currentAddressAmount", currentAddressAmount)

        // See if address is already provided
        for(var i = 1; i <= amount; i++){
            // old label see if it is 
            var availableDeposit = availableDepositAddresses[i];
            if(availableDeposit){
                // Already is on the system
                // Bitgo already has the address
                var bitgo_address = await BitGoSingleton.getDepositAddress({ wallet,  id: availableDeposit.address.bitgo_id });
                if(bitgo_address.id && bitgo_address.address){
                // Add Deposit Address to User Deposit Addresses
                    await AddressRepository.prototype.editAddress(availableDeposit.address._id, bitgo_address.address);
                }else{
                    // Address is not generated still
                    console.log("nothing still", i)
                }
            }else{
                // Not on the system (1st call)
                var bitgo_address = await BitGoSingleton.generateDepositAddress({ wallet, label: `${i}` /* label type */, id: app_wallet.bitgo_id });
                console.log("a")
                // new label - save it
                // If the system does not have this address saved still - bitgo has the address already
                let addressObject = (await (new Address({ currency: app_wallet.currency._id, address: bitgo_address.address, bitgo_id: bitgo_address.id })).register())._doc;
                // Add Deposit Address to User Deposit Addresses
                console.log("addressObject", addressObject, app_wallet._id)
                await WalletsRepository.prototype.addAvailableDepositAddress(app_wallet._id, addressObject._id);
                console.log("b")
            }
        }
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
                case 'AppGetUsersBets' : {
					return await library.process.__appGetUsersBets(params); break;
                };
                case 'DeployApp' : {
					return await library.process.__deployApp(params); break;
                };
                case 'Get' : {
					return await library.process.__get(params); break;
                };
                case 'GetAuth' : {
					return await library.process.__getAuth(params); break;
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
                case 'addAddonJackpot' : {
                    return await library.process.__addAddonJackpot(params); break;
                };
                case 'addAddonAutoWithdraw' : {
                    return await library.process.__addAddonAutoWithdraw(params); break;
                };
                case 'AddAddonTxFee' : {
                    return await library.process.__addAddonTxFee(params); break;
                };
                case 'EditAddonTxFee' : {
                    return await library.process.__editAddonTxFee(params); break;
                };
                case 'AddAddonDepositBonus' : {
                    return await library.process.__addAddonDepositBonus(params); break;
                };
                case 'EditAddonDepositBonus' : {
                    return await library.process.__editAddonDepositBonus(params); break;
                };
                case 'editAddonAutoWithdraw' : {
                    return await library.process.__editAddonAutoWithdraw(params); break;
                };
                case 'UpdateWallet' : {
					return await library.process.__updateWallet(params); break;
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
                case 'EditMailSenderIntegration' : {
                    return await library.process.__editMailSenderIntegration(params); break;
                };
                case 'EditGameEdge' : {
                    return await library.process.__editGameEdge(params); break;
                };
                case 'EditGameImage': {
					return await library.process.__editGameImage(params); break;
                };
                case 'EditGameBackgroundImage': {
					return await library.process.__editGameBackgroundImage(params); break;
                };
                case 'EditTheme' : {
                    return await library.process.__editTheme(params); break;
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
                case 'EditTopIcon' : {
                    return await library.process.__editTopIcon(params); break;
                };
                case 'EditLoadingGif' : {
                    return await library.process.__editLoadingGif(params); break;
                };
                case 'EditTypography': {
                    return await library.process.__editTypography(params); break;
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
                case 'GenerateAddresses' : {
					return await library.process.__generateAddresses(params); break;
                };
                case 'AddAddonBalance' : {
					return await library.process.__addAddonBalance(params); break;
                };
                case 'GetLogs' : {
					return await library.process.__getLogs(params); break;
                };
                case 'EditRestrictedCountries' : {
					return await library.process.__editRestrictedCountries(params); break;
                };
                case 'GetBetInfo' : {
					return await library.process.__getBetInfo(params); break;
                };
                case 'EditBackground' : {
					return await library.process.__editBackground(params); break;
                };
                case 'ModifyBalance' : {
					return await library.process.__modifyBalance(params); break;
                };
                case 'GetGameStats' : {
					return await library.process.__getGameStats(params); break;
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
                case 'addAddonJackpot' : {
					return await library.progress.__addAddonJackpot(params); break;
                };
                case 'addAddonAutoWithdraw' : {
                    return await library.progress.__addAddonAutoWithdraw(params); break;
                };
                case 'AddAddonTxFee' : {
                    return await library.progress.__addAddonTxFee(params); break;
                };
                case 'EditAddonTxFee' : {
                    return await library.progress.__editAddonTxFee(params); break;
                };
                case 'AddAddonDepositBonus' : {
                    return await library.progress.__addAddonDepositBonus(params); break;
                };
                case 'EditAddonDepositBonus' : {
                    return await library.progress.__editAddonDepositBonus(params); break;
                };
                case 'editAddonAutoWithdraw' : {
                    return await library.progress.__editAddonAutoWithdraw(params); break;
                };
                case 'UpdateWallet' : {
					return await library.progress.__updateWallet(params); break;
                };
				case 'Summary' : {
					return await library.progress.__summary(params); break;
                };
                case 'AppGetUsersBets' : {
					return await library.progress.__appGetUsersBets(params); break;
                };
                case 'DeployApp' : {
					return await library.progress.__deployApp(params); break;
                };
                case 'Get' : {
					return await library.progress.__get(params); break;
                };
                case 'GetAuth' : {
					return await library.progress.__getAuth(params); break;
                };
                case 'GetGames' : {
					return await library.progress.__getGames(params); break;
                };
                case 'GetTransactions' : {
					return await library.progress.__getTransactions(params); break;
                };
                case 'EditGameTableLimit' : {
                    return await library.progress.__editGameTableLimit(params); break;
                };
                case 'EditGameEdge' : {
                    return await library.progress.__editGameEdge(params); break;
                };
                case 'EditGameImage': {
					return await library.progress.__editGameImage(params); break;
                };
                case 'EditGameBackgroundImage': {
					return await library.progress.__editGameBackgroundImage(params); break;
				};
                case 'EditAffiliateStructure' : {
                    return await library.progress.__editAffiliateStructure(params); break;
                };
                case 'EditIntegration' : {
                    return await library.progress.__editIntegration(params); break;
                };
                case 'EditMailSenderIntegration' : {
                    return await library.progress.__editMailSenderIntegration(params); break;
                };
                case 'EditTheme' : {
                    return await library.progress.__editTheme(params); break;
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
                case 'EditTopIcon' : {
                    return await library.progress.__editTopIcon(params); break;
                };
                case 'EditLoadingGif' : {
                    return await library.progress.__editLoadingGif(params); break;
                };
                case 'EditTypography': {
                    return await library.progress.__editTypography(params); break;
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
                case 'GenerateAddresses' : {
					return await library.progress.__generateAddresses(params); break;
                };
                case 'AddAddonBalance' : {
					return await library.progress.__addAddonBalance(params); break;
                };
                case 'GetLogs' : {
					return await library.progress.__getLogs(params); break;
                };
                case 'EditRestrictedCountries': {
                    return await library.progress.__editRestrictedCountries(params); break;
                }
                case 'GetBetInfo': {
                    return await library.progress.__getBetInfo(params); break;
                }
                case 'EditBackground': {
                    return await library.progress.__editBackground(params); break;
                }
                case 'ModifyBalance': {
                    return await library.progress.__modifyBalance(params); break;
                }
                case 'GetGameStats': {
                    return await library.progress.__getGameStats(params); break;
                }
                
			}
		}catch(error){
			throw error;
		}
	}
}

// Export Default Module
export default AppLogic;

