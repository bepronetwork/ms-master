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
    DepositBonusRepository,
    PointSystemRepository,
    TopTabRepository,
    TopTabEsportsRepository,
    JackpotRepository,
    BalanceRepository,
    SubSectionsRepository,
    ProviderRepository,
    CripsrRepository,
    SkinRepository,
    KycRepository,
    IconsRepository,
    MoonPayRepository,
} from '../db/repos';
import LogicComponent from './logicComponent';
import { getServices } from './services/services';
import { Game, Jackpot, Deposit, AffiliateSetup, Link, Wallet, AutoWithdraw, Balance, DepositBonus, Address, PointSystem } from '../models';
import { fromPeriodicityToDates } from './utils/date';
import { verifyKYC } from './utils/integrations';
import GamesEcoRepository from '../db/repos/ecosystem/game';
import { throwError, throwErrorProvider } from '../controllers/Errors/ErrorManager';
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
import { TopTabSchema } from '../db/schemas';
import { IS_DEVELOPMENT } from '../config'
import MiddlewareSingleton from '../api/helpers/middleware';
let error = new ErrorManager();
let perf = new PerfomanceMonitor({id : 'app'});
var md5 = require('md5');


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
    __providerAuthorization : async (params) => {
        try {
            let user     = await UsersRepository.prototype.findUserByExternalId(params.player_id);
            if(!user){
                throwErrorProvider("11");
            }
            let payload = (MiddlewareSingleton.decodeTokenToJson(params.token));
            if(user._id!=payload.user){
                throwErrorProvider("11");
            }
            let ticker    = payload.ticker;
            let wallet   = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
            let app      = await AppRepository.prototype.findAppById(user.app_id._id);
            let provider = await ProviderRepository.prototype.findByApp({app: app._id});
            provider     = provider[0];
            let apiKey = Security.prototype.decryptData(provider.api_key);
            if(md5("Authorization/"+ params.player_id + params.game_id + params.token + apiKey) != params.hash){
                throwErrorProvider("10");
            }
            console.log("Login succes");
            return {
                code      : 0,
                message   : "Success",
                player_id : parseInt(params.player_id),
                nick      : user.username,
                balance   : wallet.playBalance,
                currency  : (new String(ticker).toUpperCase()),
                external_session: 1
            };
        } catch(err) {
            console.log("6 ",err);
            throw err;
        }
    },
    __providerCredit : async (params) => {
        let {
            token,
            player_id,
            round_id,
            game_id,
            transaction_id,
            amount,
            hash
        } = params;

        let dataToken = MiddlewareSingleton.decodeTokenToJson(token);
        let user      = await UsersRepository.prototype.findUserByExternalId(player_id);
        if(!user){
            throwErrorProvider("11");
        }
        let payload = (MiddlewareSingleton.decodeTokenToJson(params.token));
        if(user._id!=payload.user){
            throwErrorProvider("11");
        }

        let app      = await AppRepository.prototype.findAppById(user.app_id._id);
        let provider = await ProviderRepository.prototype.findByApp({app: app._id});
        provider     = provider[0];
        let apiKey = Security.prototype.decryptData(provider.api_key);
        if(md5("Credit/"+ player_id + round_id + game_id + transaction_id + token + apiKey) != hash){
            throwErrorProvider("10");
        }

        let wallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(dataToken.ticker).toLowerCase());
        if(wallet.playBalance < amount) {
            throwErrorProvider("2");
        }
        return {...params, wallet, dataToken};
    },
    __providerDebit : async (params) => {
        let {
            token,
            player_id,
            round_id,
            game_id,
            transaction_id,
            amount,
            is_close,
            hash
        } = params;

        let dataToken = MiddlewareSingleton.decodeTokenToJson(token);
        let user      = await UsersRepository.prototype.findUserByExternalId(player_id);
        if(!user){
            throwErrorProvider("11");
        }
        let payload = (MiddlewareSingleton.decodeTokenToJson(params.token));
        if(user._id!=payload.user){
            throwErrorProvider("11");
        }

        let app      = await AppRepository.prototype.findAppById(user.app_id._id);
        let provider = await ProviderRepository.prototype.findByApp({app:app._id});
        provider     = provider[0];
        let apiKey = Security.prototype.decryptData(provider.api_key);
        if(md5("Debit/"+ player_id + round_id + game_id + transaction_id + token + apiKey) != hash){
            throwErrorProvider("10");
        }

        let wallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(dataToken.ticker).toLowerCase());

        return {...params, wallet, dataToken};
    },
    __providerRollback : async (params) => {
        return params;
    },
    __providerBalance : async (params) => {
        var {token, player_id, hash} = params;
        let user = await UsersRepository.prototype.findUserByExternalId(player_id);
        if(!user){
            throwErrorProvider("11");
        }
        let payload = (MiddlewareSingleton.decodeTokenToJson(params.token));
        if(user._id!=payload.user){
            throwErrorProvider("11");
        }
        let dataToken = MiddlewareSingleton.decodeTokenToJson(token);
        let app      = await AppRepository.prototype.findAppById(user.app_id._id);
        let provider = await ProviderRepository.prototype.findByApp({app:app._id});
        provider     = provider[0];
        let apiKey = Security.prototype.decryptData(provider.api_key);
        if(md5("Balance/"+ player_id + token + apiKey) != hash){
            throwErrorProvider("10");
        }

        let wallet = user.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(dataToken.ticker).toLowerCase());
        return wallet;
    },
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
    __addAddonPointSystem : async (params) => {
        let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}

        let arrayCurrency = await CurrencyRepository.prototype.getAll();

        let ratio = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency : c._id,
                value    : 0
            }
        }));
        let res = {
            ratio,
            app
        }
		return res;
    },
    __editAddonPointSystem : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
            if(!app){throwError('APP_NOT_EXISTENT')}
            let addOn = await AddOnRepository.prototype.findById(app.addOn)
            if(!addOn){throwError('ADD_ON_NOT_EXISTS')}
            let pointSystem = await PointSystemRepository.prototype.findById(addOn.pointSystem)
            if(!pointSystem){throwError('ADD_ON_POINT_SYSTEM_NOT_EXISTS')}

            let imageLogo;
            if(params.pointSystemParams.logo.includes("https")){
                /* If it is a link already */
                imageLogo = params.pointSystemParams.logo;
            }else if(params.pointSystemParams.logo!=""){
                /* Does not have a Link and is a blob encoded64 */
                imageLogo = await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-game-images', file : params.pointSystemParams.logo});
                params.pointSystemParams.logo = imageLogo
            }

            let res = {
                pointSystem,
                currency : params.currency,
                pointSystemParams : params.pointSystemParams
            }
		    return res;
        } catch (err) {
            throw err
        }
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
        if(IS_DEVELOPMENT){
            wBT.coin = (wBT.coin).substring(1)
        }
        const wallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(wBT.coin).toLowerCase());
        if(!wallet || !wallet.currency){throwError('CURRENCY_NOT_EXISTENT')};
        if( new String(`${app._id}-${wallet.currency.ticker}-second_wallet`).toLowerCase().toString() == wBT.label) {throwError('PAYMENT_FORWARDING_TRANSACTION')};

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
    __editApp : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return params;
    },
    __editMoonPayIntegration : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppByIdHostingId(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {...params, app};
    },
    __editIntegration : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return params;
    },
    __editKycIntegration : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {...params, app};
    },
    __editCripsrIntegration : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {...params, app};
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
    __editSkin : async (params) => {
        let { app, skinParams } = params;
        app = await AppRepository.prototype.findAppByIdHostingId(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        if((skinParams.skin_type.toLowerCase() != "default") && (skinParams.skin_type.toLowerCase() != "digital")){ throwError('WRONG_SKIN') }
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
    __editTopTab : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
        };
    },
    __editIcons : async (params) => {
        let { app, icons } = params;
        app = await AppRepository.prototype.findAppByIdHostingId(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        if(icons.length > 50){throwError('ICONS_LIMIT_EXCEEDED')};
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
        app = await AppRepository.prototype.findAppById(app, "simple");
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
    __editProvider : async (params) => {
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
    __editSubSections : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppById(app, "simple");
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {
            ...params,
            app
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
    },
    __kycWebhook: async (params) => {
        if(!verifyKYC(params.metadata)) {
            return false;
        }
        const user_id = params.metadata.id;
        const user = await UsersRepository.prototype.findUserById(user_id);
        if (!user) { throwError('USER_NOT_EXISTENT') }
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
    __providerAuthorization : async (params) => {
        return params;
    },
    __providerCredit : async (params) => {
        let {
            amount,
            wallet
        } = params;
        await WalletsRepository.prototype.updatePlayBalance(wallet._id, -amount);
        console.log("__providerCredit ", wallet.playBalance);
        console.log("__providerCredit ", -amount);
        console.log("__providerCredit ", wallet.playBalance - amount);
        console.log("-------------------------");
        return {
            code: 0,
            message: "success",
            balance: wallet.playBalance - amount
        };
    },
    __providerDebit : async (params) => {
        let {
            amount,
            wallet,
            is_close
        } = params;
        if(is_close) {
            await WalletsRepository.prototype.updatePlayBalance(wallet._id, amount);
        }
        console.log("__providerDebit ", wallet.playBalance);
        console.log("__providerDebit ", amount);
        console.log("__providerDebit ", wallet.playBalance + amount);
        console.log("-------------------------");
        return {
            code: 0,
            message: "success",
            balance: wallet.playBalance + amount
        };
    },
    __providerRollback : async (params) => {
        return params;
    },
    __providerBalance : async (params) => {
        console.log("__providerBalance ", params.wallet.playBalance);
        return {
            code: 0,
            message: "success",
            balance: params.wallet.playBalance
        };
    },
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
        var wallet, bitgo_wallet, receiveAddress, keys;

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
            console.log("currency", currency)
            if(currency.erc20){
                /* Don't create wallet for bitgo for the platform again */
                /* Get ETH Wallet */
                let wallet_eth = app.wallet.find( w => w.currency.ticker == 'ETH');

                /* No Eth Wallet was created */
                if(!wallet_eth){throwError('NO_ETH_WALLET')};

                /* Save Wallet on DB */
                wallet = (await (new Wallet({
                    currency : currency._id,
                    bitgo_id : wallet_eth.bitgo_id,
                    virtual : false,
                    bank_address : wallet_eth.bank_address,
                    hashed_passphrase : Security.prototype.encryptData(passphrase)
                })).register())._doc;

            }else{
                /* Create Wallet on Bitgo */
                let params = await BitGoSingleton.createWallet({
                    label : `${app._id}-${currency.ticker}`,
                    passphrase,
                    currency : currency.ticker
                })
                bitgo_wallet = params.wallet;
                receiveAddress = params.receiveAddress;
                keys = params.keys;


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

            }
         
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

        /* add currencies in addons */
        if(app.jackpot)         await JackpotRepository.prototype.pushNewCurrency(app.jackpot._id, currency._id);
        if(app.pointSystem)     await PointSystemRepository.prototype.pushNewCurrency(app.pointSystem._id, currency._id);
        if(app.autoWithdraw)    await AutoWithdrawRepository.prototype.pushNewCurrency(app.autoWithdraw._id, currency._id);
        if(app.txFee)           await TxFeeRepository.prototype.pushNewCurrency(app.txFee._id, currency._id);
        if(app.balance)         await BalanceRepository.prototype.pushNewCurrency(app.balance._id, currency._id);
        if(app.depositBonus)    await DepositBonusRepository.prototype.pushNewCurrency(app.depositBonus._id, currency._id);

        console.log("setting user")

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
    __addAddonPointSystem : async (params) => {
        const {ratio, app} = params;
        let pointSystem = new PointSystem({app, ratio});
        const pointSystemResult = await pointSystem.register();
        await addOnRepository.prototype.addAddonPointSystem(app.addOn, pointSystemResult._doc._id);
		return pointSystemResult;
    },
    __editAddonPointSystem : async (params) => {
        const { pointSystem, currency, pointSystemParams } = params;
        await PointSystemRepository.prototype.findByIdAndUpdate(pointSystem._id, currency, pointSystemParams)
        let res = await PointSystemRepository.prototype.findById(pointSystem._id);
        return res;
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
    __editApp : async (params) => {
        let { app, editParams } = params;
        await AppRepository.prototype.editAppNameDescription({
            app_id: app,
            name: editParams.name,
            description: editParams.app_description
        })

        return true;
    },
    __editMoonPayIntegration : async (params) => {
        let { key, moonpay_id, isActive, app } = params;
        let hashedKey = Security.prototype.encryptData(key)
        await MoonPayRepository.prototype.findByIdAndUpdate({
            moonpay_id: moonpay_id,
            key: hashedKey,
            isActive: isActive
        });
        
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id});

        return true;
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
    __editKycIntegration : async (params) => {
        let { flowId, clientId, isActive, app, kyc_id } = params;
        let hashedFlowId    = Security.prototype.encryptData(flowId);
        let hashedClientId  = Security.prototype.encryptData(clientId);

        await KycRepository.prototype.findByIdAndUpdate(kyc_id, {
            flowId   : hashedFlowId,
            clientId : hashedClientId,
            isActive : isActive
        });
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id});

        return true;
    },
    __editCripsrIntegration : async (params) => {
        let { key, cripsr_id, isActive, app } = params;
        let hashedKey = await Security.prototype.encryptData(key)
        await CripsrRepository.prototype.findByIdAndUpdate({
            cripsr_id: cripsr_id,
            key: hashedKey,
            isActive: isActive
        });
        
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id});

        return true;
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
    __editSkin  : async (params) => {
        let { app, skinParams } = params;
        await SkinRepository.prototype.findByIdAndUpdate({_id: skinParams._id, skin_type: skinParams.skin_type.toLowerCase(), name: skinParams.name});
        
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return true;
    },
    __editTopBar  : async (params) => {
        let { app, backgroundColor, textColor, text, isActive, isTransparent } = params;
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
    __editTopTab  : async (params) => {
        let { app, topTabParams, isTransparent } = params;
        let topTab = await Promise.all(topTabParams.map( async topTab => {
            if(topTab.icon.includes("https")){
                /* If it is a link already */
                return topTab;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    icon   : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : topTab.icon}),
                    name    : topTab.name,
                    link_url : topTab.link_url
                };
            }
        }))
        await TopTabRepository.prototype.findByIdAndUpdateTopTab({
            _id: app.customization.topTab._id,
            newStructure: topTab,
            isTransparent
        });
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return true;
    },
    __editIcons  : async (params) => {
        let { app, icons, icon_id } = params;
        let icon = await Promise.all(icons.map( async icon => {
            if(icon.link.includes("https")){
                /* If it is a link already */
                return icon;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    link     : await GoogleStorageSingleton.uploadFileWithName({bucketName : 'betprotocol-icons', file : icon.link, fileName: `${icon.position}-${app._id}`}),
                    name     : icon.name,
                    position : icon.position
                };
            }
        }))
        await IconsRepository.prototype.findByIdAndUpdate({
            _id: icon_id,
            icon
        });
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return true;
    },
    __editBanners : async (params) => {
        let { app, autoDisplay, banners, fullWidth } = params;
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
            ids,
            fullWidth
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
    __editProvider : async (params) => {
        let { app, providerParams } = params;
        
        await ProviderRepository.prototype.findByIdAndUpdate({
            _id: providerParams._id,
            api_key : Security.prototype.encryptData(providerParams.api_key),
            activated : providerParams.activated,
            partner_id : providerParams.partner_id
        })

        await HerokuClientSingleton.deployApp({app : app.hosting_id})
        
        return true;
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
    __editSubSections : async (params) => {
        let { app, subSections } = params;
        let ids = await Promise.all(subSections.map( async s => {
            if(s.image_url.includes("https") && s.image_url.includes("https")){
                /* If it is a link already */
                return s;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    title            : s.title,
                    text             : s.text,
                    image_url        : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : s.image_url}),
                    background_url   : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : s.background_url}),
                    background_color : s.background_color,
                    position         : s.position,
                    location         : s.location
                };
            }
        }))
        await SubSectionsRepository.prototype.findByIdAndUpdate(app.customization.subSections._id, {
            ids
        })
        // Save info on Customization Part
        return true;
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
    },
    __kycWebhook: async (params) => {
        if(!params) {return false;}
        const user_id = params.metadata.id;
        if(params.identityStatus=="verified") {
            UsersRepository.prototype.editKycNeeded(user_id, false);
        }
        UsersRepository.prototype.editKycStatus(user_id, params.identityStatus);
        return true;
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
                case 'EditMoonPayIntegration' : {
                    return await library.process.__editMoonPayIntegration(params); break;
                };
                case 'EditIntegration' : {
                    return await library.process.__editIntegration(params); break;
                };
                case 'EditCripsrIntegration' : {
                    return await library.process.__editCripsrIntegration(params); break;
                };
                case 'EditKycIntegration' : {
                    return await library.process.__editKycIntegration(params); break;
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
                case 'EditApp' : {
                    return await library.process.__editApp(params); break;
                };
                case 'EditTheme' : {
                    return await library.process.__editTheme(params); break;
                };
                case 'EditSkin' : {
                    return await library.process.__editSkin(params); break;
                };
                case 'EditTopBar' : {
                    return await library.process.__editTopBar(params); break;
                };
                case 'EditTopTab' : {
                    return await library.process.__editTopTab(params); break;
                };
                case 'EditIcons' : {
                    return await library.process.__editIcons(params); break;
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
                case 'EditProvider' : {
                    return await library.process.__editProvider(params); break;
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
                case 'AddAddonPointSystem' : {
					return await library.process.__addAddonPointSystem(params); break;
                };
                case 'EditAddonPointSystem' : {
					return await library.process.__editAddonPointSystem(params); break;
                };
                case 'EditSubSections' : {
                    return await library.process.__editSubSections(params); break;
                };
                case 'ProviderAuthorization' : {
                    return await library.process.__providerAuthorization(params); break;
                };
                case 'ProviderCredit' : {
                    return await library.process.__providerCredit(params); break;
                };
                case 'ProviderDebit' : {
                    return await library.process.__providerDebit(params); break;
                };
                case 'ProviderRollback' : {
                    return await library.process.__providerRollback(params); break;
                };
                case 'ProviderBalance' : {
                    return await library.process.__providerBalance(params); break;
                };
                case 'KycWebhook' : {
                    return await library.process.__kycWebhook(params); break;
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
                case 'EditMoonPayIntegration' : {
                    return await library.progress.__editMoonPayIntegration(params); break;
                };
                case 'EditAffiliateStructure' : {
                    return await library.progress.__editAffiliateStructure(params); break;
                };
                case 'EditIntegration' : {
                    return await library.progress.__editIntegration(params); break;
                };
                case 'EditCripsrIntegration' : {
                    return await library.progress.__editCripsrIntegration(params); break;
                };

                case 'EditKycIntegration' : {
                    return await library.progress.__editKycIntegration(params); break;
                };
                case 'EditMailSenderIntegration' : {
                    return await library.progress.__editMailSenderIntegration(params); break;
                };
                case 'EditApp' : {
                    return await library.progress.__editApp(params); break;
                };
                case 'EditTheme' : {
                    return await library.progress.__editTheme(params); break;
                };
                case 'EditSkin' : {
                    return await library.progress.__editSkin(params); break;
                };
                case 'EditTopBar' : {
                    return await library.progress.__editTopBar(params); break;
                };
                case 'EditTopTab' : {
                    return await library.progress.__editTopTab(params); break;
                };
                case 'EditIcons' : {
                    return await library.progress.__editIcons(params); break;
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
                case 'EditProvider' : {
                    return await library.progress.__editProvider(params); break;
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
                case 'AddAddonPointSystem': {
                    return await library.progress.__addAddonPointSystem(params); break;
                }
                case 'EditAddonPointSystem': {
                    return await library.progress.__editAddonPointSystem(params); break;
                }
                case 'EditSubSections' : {
                    return await library.progress.__editSubSections(params); break;
                }
                case 'ProviderAuthorization' : {
                    return await library.progress.__providerAuthorization(params); break;
                };
                case 'ProviderCredit' : {
                    return await library.progress.__providerCredit(params); break;
                };
                case 'ProviderDebit' : {
                    return await library.progress.__providerDebit(params); break;
                };
                case 'ProviderRollback' : {
                    return await library.progress.__providerRollback(params); break;
                };
                case 'ProviderBalance' : {
                    return await library.progress.__providerBalance(params); break;
                };
                case 'KycWebhook' : {
                    return await library.progress.__kycWebhook(params); break;
                };
			}
		}catch(error){
			throw error;
		}
	}
}

// Export Default Module
export default AppLogic;

