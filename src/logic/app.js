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
    BetEsportsRepository,
    EsportsScrennerRepository,
    PointSystemRepository,
    TopTabRepository,
    SubSectionsRepository,
    ProviderRepository,
    CripsrRepository,
    SkinRepository,
    KycRepository,
    IconsRepository,
    MoonPayRepository,
    AnalyticsRepository,
    ComplianceFileRepository, LanguageEcoRepository, LanguageRepository, KycLogRepository, WithdrawRepository, JackpotRepository, BalanceRepository, FreeCurrencyRepository, AffiliateRepository
} from '../db/repos';
import LogicComponent from './logicComponent';
import { getServices } from './services/services';
import { Game, Jackpot, Deposit, AffiliateSetup, Link, AutoWithdraw, Balance, DepositBonus, Address, PointSystem, FreeCurrency, Language, Wallet } from '../models';
import { fromPeriodicityToDates } from './utils/date';
import { verifyKYC } from './utils/integrations';
import GamesEcoRepository from '../db/repos/ecosystem/game';
import { throwError, throwErrorProvider } from '../controllers/Errors/ErrorManager';
import GoogleStorageSingleton from './third-parties/googleStorage';
import { isHexColor } from '../helpers/string';
import { mail } from '../mocks';
import { MatiKYCSingleton, SendInBlueAttributes } from './third-parties';
import { HerokuClientSingleton } from './third-parties';
import { Security } from '../controllers/Security';
import { SendinBlueSingleton, SendInBlue } from './third-parties/sendInBlue';
import { PUSHER_APP_KEY, PRICE_VIRTUAL_CURRENCY_GLOBAL, PANDA_SCORE_TOKEN } from '../config';
import {AddOnsEcoRepository} from '../db/repos';
import addOnRepository from '../db/repos/addOn';
import { LastBetsRepository, BiggestBetWinnerRepository, BiggestUserWinnerRepository, PopularNumberRepository, LastBetsEsportsRepository, BiggestBetWinnerEsportsRepository, BiggestUserWinnerEsportsRepository } from "../db/repos/redis";
import PerfomanceMonitor from '../helpers/performance';
import TxFee from '../models/txFee';
import { TopTabSchema } from '../db/schemas';
import { IS_DEVELOPMENT } from '../config'
import MiddlewareSingleton from '../api/helpers/middleware';
import ConverterSingleton from './utils/converter';
import {IOSingleton} from './utils/io';
let error = new ErrorManager();
let perf = new PerfomanceMonitor({id : 'app'});
const axios = require('axios');
var md5 = require('md5');
import PusherSingleton from './third-parties/pusher';
import SocialLinkRepository from '../db/repos/socialLink';
import TopUp from '../models/topUp';
import Mailer from './services/mailer';
const fixRestrictCountry = ConverterSingleton.convertCountry(require("../config/restrictedCountries.config.json"));

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
    __processConfirm: async (params) => {
        const { user } = params;
        const userData = await UsersRepository.prototype.findUserById(user);
        if(!userData){throwError('USER_NOT_EXISTENT')}
        return {
            userData
        };
    },
    __addCurrencyWallet : async (params) => {
        var { currency_id, app } = params;
        app = await AppRepository.prototype.findAppByIdAddCurrencyWallet(app);
        if(!app){throwError('APP_NOT_EXISTENT')}
        let currency = await CurrencyRepository.prototype.findById(currency_id);
        return  {
            currency,
            app : app
        }
    },
    __updateBalanceApp : async (params) => {
        let { app, currency, increase_amount } = params;

        app = await AppRepository.prototype.findAppById(app, 'simple');
        if(!app){throwError('APP_NOT_EXISTENT')}
        const app_wallet = app.wallet.find(w => new String(w.currency._id).toString() == new String(currency).toString());
        return {
            app_wallet,
            increase_amount
        };
    },
    __getUsersWithdraws : async (params) => {
        return params;
    },
    __providerAuthorization : async (params) => {
        try {
            let user     = await UsersRepository.prototype.findUserByExternalId(params.player_id);
            if(!user){
                throwErrorProvider("11");
            }
            let payload = (MiddlewareSingleton.decodeTokenToJson(params.token));
            console.log(payload);
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
                balance   : ConverterSingleton.convertAmountProviderBigger(new String(ticker).toUpperCase(), wallet.playBalance),
                currency  : ConverterSingleton.convertTickerProvider(new String(ticker).toUpperCase()),
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
        return {...params, wallet, dataToken, user};
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

        return {...params, wallet, dataToken, user};
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
        const { affiliateSetup, integrations, customization, addOn, typography, virtual, analytics } = params;
        
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
            typography,
            esports_edge        : 0,
            analytics
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
    __getDeposit : async (params) => {
        let deposits = await UsersRepository.prototype.getDepositByApp({
            app: params.app,
            offset: params.offset,
            size : params.size,
            user: params.user,
            begin_at: params.begin_at,
            end_at: params.end_at
        });
		return deposits;
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
    __getCompliance : async (params) => {
        const res = await ComplianceFileRepository.prototype.getComplianceByApp({
            app : params.app,
            offset: params.offset,
            size : params.size,
            begin_at: params.begin_at,
            end_at: params.end_at
        });
		return res;
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
                isJackpot: (params.isJackpot == undefined) ? {} : {isJackpot : params.isJackpot},
                begin_at: params.begin_at,
                end_at: params.end_at
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
                username: params.username,
                begin_at: params.begin_at,
                end_at: params.end_at
            });
        }
		return {...res, tag: "cassino"};
    },
    __appGetUsersBetsEsports : async (params) => {
        let res = await BetEsportsRepository.prototype.getAppBetsEsports({
            app : params.app,
            offset: params.offset,
            size : params.size,
            user: params.user == undefined ? {} : { user : params.user },
            _id: params.bet == undefined ? {} : { _id : params.bet },
            currency: params.currency == undefined ? {} : { currency : params.currency },
            videogames: params.videogames == undefined ? {} : { videogames : { $in: params.videogames } },
            type: params.type == undefined ? {} : { type : params.type },
            begin_at: params.begin_at,
            end_at: params.end_at
        });
        let normalized = {
            ...res, 
            tag: "esports"
        }
		return normalized;
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

    __getBetInfoEsports : async (params) => {
        try {
            let app = await AppRepository.prototype.findAppById(params.app, "simple");
            if (!app){ throwError('APP_NOT_EXISTENT') }
            let bet = await BetEsportsRepository.prototype.findByIdPopulated(params.bet);
            bet.result = bet.result.map( async result => {
                return({
                    ...result,
                    data_external_match : (await axios.get(`https://api.pandascore.co/betting/matches/${result.match.external_id}?token=${PANDA_SCORE_TOKEN}`)).data
                })
            });
            bet.result = await Promise.all(bet.result);
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
    __addLanguage : async (params) => {
        let app = await AppRepository.prototype.findAppByIdPopulateCustomization(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}
        const languagesAvailable = await LanguageEcoRepository.prototype.getAll();
        const language = languagesAvailable.find(language => language.prefix.toLowerCase() == params.prefix.toLowerCase());
        if(!language){throwError('LANGUAGE_NOT_EXISTENT')}
        const banner = {
            language : "", 
            useStandardLanguage : true,
            ids                     : [{
                image_url   : "",
                link_url    : "",
                button_text : "",
                title       : "",
                subtitle    : ""
            }],
            autoDisplay : false,
            fullWidth   : false
        };
        const subSections = {
            language : "",
            useStandardLanguage : true,
            ids : []
        }
        const topBar = {
            language : "",
            useStandardLanguage : true,
            text                  : "",
            backgroundColor       : "",
            textColor             : "",
            isActive              : false,
        }
        const topTab = {
            language : "",
            useStandardLanguage : true,
            ids : [{
                name      : "",
                icon      : "",
                link_url  : ""
            }],
            isTransparent : false,
        }
        const footer = {
            language : "",
            useStandardLanguage : true,
            supportLinks    : [],
            communityLinks  : []
        }
		return {
            app,
            language,
            banner,
            topBar,
            subSections,
            topTab,
            footer
        };
    },
    __editLanguage : async (params) => {
        let app = await AppRepository.prototype.findAppByIdPopulateCustomization(params.app);
        if(!app){throwError('APP_NOT_EXISTENT')}
		return params;
    },
    __addAddonFreeCurrency: async (params) => {
        try {
            let app = await AppRepository.prototype.findAppByIdNotPopulated(params.app);
            if(!app){throwError('APP_NOT_EXISTENT')}

            let arrayCurrency = await CurrencyRepository.prototype.getAll();

            let wallets = await Promise.all(arrayCurrency.map( async c => {
                return {
                    currency  : c._id,
                    activated : false,
                    time      : 3600000,
                    value     : 0,
                    multiplier: 10
                }
            }));
            let res = {
                app,
                wallets
            }
            return res;
        } catch(err) {
            throw err;
        }
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
                    multiplier      : 10
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

        let isDepositBonus = await Promise.all(arrayCurrency.map( async c => {
            return {
                currency    : c._id,
                value       : false
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
                multiple      : 10
            }
        }));

        let res = {
            min_deposit,
            percentage,
            max_deposit,
            multiplier,
            app,
            isDepositBonus
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
            }else {
                /* Does not have a Link and is a blob encoded64 */
                imageLogo = !params.pointSystemParams.logo ? params.pointSystemParams.logo : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-game-images', file : params.pointSystemParams.logo});
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
    __getLastBetsEsports : async (params) => {
        let res = await LastBetsEsportsRepository.prototype.getLastBetsEsports({
            _id : params.app
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
    __getBiggestBetWinnersEsports : async (params) => {
        let res = await BiggestBetWinnerEsportsRepository.prototype.getBiggestBetWinnerEsports({
            _id : params.app
        });
		return res;
    },
    __getBiggestUserWinners : async (params) => {
        let res = await BiggestUserWinnerRepository.prototype.getBiggetsUserWinner({
            _id : params.app
        });
		return res;
    },
    __getBiggestUserWinnersEsports : async (params) => {
        let res = await BiggestUserWinnerEsportsRepository.prototype.getBiggestUserWinnerEsports({
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

    __editVideogameEdge : async (params) => {
        let { app, esports_edge } = params;
        app = await AppRepository.prototype.findAppByIdNotPopulated(app);
        if(!app){throwError('APP_NOT_EXISTENT')}

		let normalized = {
            app,
            esports_edge
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
    __convertPoints : async (params) => {
        let { app, currency, user } = params;
        app = await AppRepository.prototype.findAppByIdConvertPoints(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        let ratio = app.addOn.pointSystem.ratio.find( ratio => new String(ratio.currency).toLowerCase() == new String(currency).toLowerCase()).value;
        if(user.toLowerCase() == 'all'){
            user = await UsersRepository.prototype.findUserByIdAppId({app: app._id});
        } else {
            user = await UsersRepository.prototype.findUserByIdWithPoints(user);
        }
        return {
            ...params, 
            app,
            user, 
            ratio
        };
    },
    __editMoonPayIntegration : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppByIdHostingId(app);
        if(!app){throwError('APP_NOT_EXISTENT')};
        return {...params, app};
    },
    __editAnalyticsKey : async (params) => {
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
    __socialLink : async (params) => {
        let { app } = params;
        app = await AppRepository.prototype.findAppByIdHostingId(app);
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
    __editEsportScrenner : async (params) => {
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
    __kycWebhook: async (params) => {
        const user_id = params.metadata.id;
        const user    = await UsersRepository.prototype.findUserById(user_id);

        if(!verifyKYC(params.metadata, String(user.app_id._id).toString())) {
            return false;
        }

        const clientId     = Security.prototype.decryptData(user.app_id.integrations.kyc.clientId);
        const clientSecret = Security.prototype.decryptData(user.app_id.integrations.kyc.client_secret);

        const tokenKyc          = (await MatiKYCSingleton.getBearerToken(clientId, clientSecret)).access_token;
        const verificationData  = await MatiKYCSingleton.getData(params.resource, tokenKyc);
        const idKyc             = (!params.matiDashboardUrl) ? null : params.matiDashboardUrl.split("identities/")[1];

        if (!user) { throwError('USER_NOT_EXISTENT') }
        return {...params, dataVerification: verificationData, app: user.app_id, user, idKyc};
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
    __processConfirm: async (params) => {
        var { userData } = params;
        await UsersRepository.prototype.updateUser({
            id: userData._id,
            param: {isWithdrawing:false}
        });
        return;
    },
    __addCurrencyWallet : async (params) => {
        const { currency, app } = params;
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
            if(currency.erc20){
                let wallet_eth = app.wallet.find( w => w.currency.ticker == 'ETH');
                /* No Eth Wallet was created */
                if(!wallet_eth){throwError('NO_ETH_WALLET')};
                /* Save Wallet on DB */
                wallet = (await (new Wallet({
                    currency : currency._id,
                    virtual : false
                })).register())._doc;
            }else{
                wallet = (await (new Wallet({
                    currency : currency._id,
                    virtual : false
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
        if(app.addOn.jackpot)         await JackpotRepository.prototype.pushNewCurrency(app.addOn.jackpot._id, currency._id);
        if(app.addOn.pointSystem)     await PointSystemRepository.prototype.pushNewCurrency(app.addOn.pointSystem._id, currency._id);
        if(app.addOn.autoWithdraw)    await AutoWithdrawRepository.prototype.pushNewCurrency(app.addOn.autoWithdraw._id, currency._id);
        if(app.addOn.txFee)           await TxFeeRepository.prototype.pushNewCurrency(app.addOn.txFee._id, currency._id);
        if(app.addOn.balance)         await BalanceRepository.prototype.pushNewCurrency(app.addOn.balance._id, currency._id);
        if(app.addOn.depositBonus)    await DepositBonusRepository.prototype.pushNewCurrency(app.addOn.depositBonus._id, currency._id);
        if(app.addOn.freeCurrency)    await FreeCurrencyRepository.prototype.pushNewCurrency(app.addOn.freeCurrency._id, currency._id);
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
            currency_id : currency._id
        }
    },
    __updateBalanceApp : async (params) => {
        let { app_wallet, increase_amount } = params;
        await WalletsRepository.prototype.updatePlayBalance(app_wallet._id, increase_amount);
        const walletUpdated = await WalletsRepository.prototype.findById(app_wallet._id);
        return {
            updatedPlayBalance : walletUpdated.playBalance
        };
    },
    __getUsersWithdraws : async (params) => {
        let res = await WithdrawRepository.prototype.getAppFiltered(params);
        return res;
    },
    __providerAuthorization : async (params) => {
        console.log("Auth ", params);
        return params;
    },
    __providerCredit : async (params) => {
        let {
            amount,
            wallet,
            dataToken,
            user
        } = params;
        amount = ConverterSingleton.convertAmountProviderSmaller(new String(dataToken.ticker).toUpperCase(), amount);
        console.log(amount);
        if(wallet.playBalance < amount) {
            throwErrorProvider("2");
        }
        await WalletsRepository.prototype.updatePlayBalance(wallet._id, -amount);
        console.log("__providerCredit ", wallet.playBalance);
        console.log("__providerCredit ", -amount);
        console.log("__providerCredit ", wallet.playBalance - amount );
        console.log("-------------------------");
        /* Send Notification */
        PusherSingleton.trigger({
            channel_name: user._id,
            isPrivate: true,
            message: JSON.stringify({value: -amount, ticker: String(dataToken.ticker).toUpperCase()}),
            eventType: 'UPDATE_BALANCE'
        })
        return {
            code: 0,
            message: "success",
            balance: ConverterSingleton.convertAmountProviderBigger(new String(dataToken.ticker).toUpperCase(), wallet.playBalance - amount)
        };
    },
    __providerDebit : async (params) => {
        let {
            amount,
            wallet,
            is_close,
            dataToken,
            user
        } = params;
        amount = ConverterSingleton.convertAmountProviderSmaller(new String(dataToken.ticker).toUpperCase(), amount);
        if(is_close) {
            await WalletsRepository.prototype.updatePlayBalance(wallet._id, amount);
        }
        console.log("__providerDebit ", wallet.playBalance);
        console.log("__providerDebit ", amount);
        console.log("__providerDebit ", wallet.playBalance + amount);
        console.log("-------------------------");

        /* Send Notification */
        PusherSingleton.trigger({
            channel_name: user._id,
            isPrivate: true,
            message: JSON.stringify({value: amount, ticker: String(dataToken.ticker).toUpperCase()}),
            eventType: 'UPDATE_BALANCE'
        })

        return {
            code: 0,
            message: "success",
            balance: ConverterSingleton.convertAmountProviderBigger(new String(dataToken.ticker).toUpperCase(),wallet.playBalance + amount)
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
            balance: ConverterSingleton.convertAmountProviderBigger(new String(params.wallet.currency.ticker).toUpperCase(), params.wallet.playBalance)
        };
    },
	__register : async (params) => {
        let app = await self.save(params);
        console.log(app._id);
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
    __getCompliance: async (params) => {
        return params;
    },
    __appGetUsersBetsEsports : async (params) => {
        return params;
    },
    __modifyBalance : async (params) => {
        await WalletsRepository.prototype.updatePlayBalanceNotInc(params.wallet, {newBalance : params.newBalance});
        let paramsTopUp = {
            app: params.app,
            admin: params.admin,
            user: params.user,
            wallet: params.wallet,
            currency: params.currency,
            balance: params.newBalance,
            reason: params.reason
        }
        let topUp = new TopUp(paramsTopUp);
        await topUp.register();
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
    __getDeposit : async (params) => {
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
    __getBetInfoEsports : async (params) => {
        try {
            return params;
        } catch(err) {
            throw err;
        }
    },
    __editRestrictedCountries : async (params) => {
        try {
            let {app, countries} = params;
            for(let country of fixRestrictCountry){
                let index = countries.indexOf(country);
                if(index>=0){
                    countries.splice(index, 1);
                }
            }
            await AppRepository.prototype.setCountries(app, countries);
            return true;
        } catch(err) {
            throw err;
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
    __addLanguage : async (params) => {
        const { app, language, banner, topBar, subSections, topTab, footer } = params;
        const languageParams = {
            isActivated: true,
            prefix: language.prefix,
            name: language.name,
            logo: language.logo,
        }
        let languageCustomization = new Language(languageParams);
        const languageCustomizationResult = await languageCustomization.register();
        await BannersRepository.prototype.addNewLanguage({_id: app.customization.banners._id, language: {...banner, language: languageCustomizationResult._doc._id} })
        await TopBarRepository.prototype.addNewLanguage({_id: app.customization.topBar._id, language: {...topBar, language: languageCustomizationResult._doc._id} })
        await TopTabRepository.prototype.addNewLanguage({_id: app.customization.topTab._id, language: {...topTab, language: languageCustomizationResult._doc._id} })
        await SubSectionsRepository.prototype.addNewLanguage({_id: app.customization.subSections._id, language: {...subSections, language: languageCustomizationResult._doc._id} })
        await FooterRepository.prototype.addNewLanguage({_id: app.customization.footer._id, language: {...footer, language: languageCustomizationResult._doc._id} })
        await CustomizationRepository.prototype.addNewLanguage(app.customization._id, languageCustomizationResult._doc._id);
		return languageCustomizationResult._doc;
    },
    __editLanguage : async (params) => {
        const { language_id, logo, isActivated } = params;
        let image_url="";
        if(logo.includes("https")){
            /* If it is a link already */
            image_url = logo;
        }else {
            /* Does not have a Link and is a blob encoded64 */
            image_url = !logo ? logo : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : logo});
        }
        await LanguageRepository.prototype.findByIdAndUpdate({_id: language_id, logo: image_url, isActivated});
		return true;
    },
    __addAddonFreeCurrency: async (params) => {
        const { app, wallets } = params;
        let freeCurrency = new FreeCurrency({wallets});
        const freeCurrencyResult = await freeCurrency.register();
        await addOnRepository.prototype.addAddonFreeCurrency(app.addOn, freeCurrencyResult._doc._id);
		return freeCurrencyResult;
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
        const { min_deposit, percentage, max_deposit, multiplier, app, isDepositBonus } = params;
        let depositBonus = new DepositBonus({app, min_deposit, percentage, max_deposit, multiplier, isDepositBonus});
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
    __getLastBetsEsports : async (params) => {
        let res = params;
		return res;
    },
    __getBiggestBetWinners : async (params) => {
        let res = params;
		return res;
    },
    __getBiggestBetWinnersEsports : async (params) => {
        let res = params;
		return res;
    },
    __getBiggestUserWinners : async (params) => {
        let res = params;
		return res;
    },
    __getBiggestUserWinnersEsports : async (params) => {
        let res = params;
		return res;
    },
    __getPopularNumbers : async (params) => {
        let res = params;
		return res;
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

    __editVideogameEdge : async (params) => {
        let { esports_edge, app} = params;

        await AppRepository.prototype.findByIdAndUpdateVideogameEdge({
            _id : app._id,
            esports_edge
        });

		return true;
    },
	__editGameImage : async (params) => {
        let { game, image_url } = params;
        let gameImageURL;
        if(image_url.includes("https")){
            /* If it is a link already */
            gameImageURL = image_url;
        }else {
            /* Does not have a Link and is a blob encoded64 */
            gameImageURL = !image_url ? image_url : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-game-images', file : image_url});
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
        }else {
            /* Does not have a Link and is a blob encoded64 */
            gameBackgroundImageURL = !background_url ? background_url : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-game-images', file : background_url});
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
    __convertPoints : async (params) => {
        let { currency, user, isAbsolut, ratio } = params;
        var { userWallet, amountConversion} = '';
        if(Array.isArray(user)){
            for(let userObject of user) {
                userWallet = userObject.wallet.find( w => new String(w.currency).toLowerCase() == new String(currency).toLowerCase());
                if(!isAbsolut){
                    amountConversion = userObject.points/ratio
                    await WalletsRepository.prototype.updatePlayBalance(userWallet._id, amountConversion);
                    await UsersRepository.prototype.updateUserPoints({
                        _id: userObject._id,
                        value: 0
                    })
                } else {
                    amountConversion = userObject.points
                    await WalletsRepository.prototype.updatePlayBalance(userWallet._id, amountConversion);
                    await UsersRepository.prototype.updateUserPoints({
                        _id: userObject._id,
                        value: 0
                    })
                }
            }
        } else {
            userWallet = user.wallet.find( w => new String(w.currency).toLowerCase() == new String(currency).toLowerCase());
            if(!isAbsolut){
                amountConversion = user.points/ratio
                await WalletsRepository.prototype.updatePlayBalance(userWallet._id, amountConversion);
                await UsersRepository.prototype.updateUserPoints({
                    _id: user._id,
                    value: 0
                })

            } else {
                amountConversion = user.points
                await WalletsRepository.prototype.updatePlayBalance(userWallet._id, amountConversion);
                await UsersRepository.prototype.updateUserPoints({
                    _id: user._id,
                    value: 0
                })
            }
        }
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
    __editAnalyticsKey : async (params) => {
        let { analytics_id, google_tracking_id, isActive, app } = params;
        let hashedKey = Security.prototype.encryptData(google_tracking_id)
        let test = await AnalyticsRepository.prototype.findByIdAndUpdate({
            _id: analytics_id,
            google_tracking_id: hashedKey,
            isActive
        });
        
        /* Rebuild the App */
        // await HerokuClientSingleton.deployApp({app : app.hosting_id});
        return true;
    },
    __editIntegration : async (params) => {
        let { publicKey, privateKey, integration_type, integration_id, isActive } = params;
        publicKey = Security.prototype.encryptData(publicKey);
        privateKey = Security.prototype.encryptData(privateKey);
        /* Update Integrations Id Type */
        switch(integration_type){
            case 'live_chat' : {
                await ChatRepository.prototype.findByIdAndUpdateChat({
                    publicKey,
                    privateKey, 
                    integration_type,
                    _id: integration_id,
                    isActive
                })
            }
        }
        return params;
    },
    __editKycIntegration : async (params) => {
        let { flowId, clientId, isActive, app, kyc_id, client_secret } = params;
        let hashedFlowId        = Security.prototype.encryptData(flowId);
        let hashedClientId      = Security.prototype.encryptData(clientId);
        let hashedClient_secret = Security.prototype.encryptData(client_secret);

        await KycRepository.prototype.findByIdAndUpdate(kyc_id, {
            flowId        : hashedFlowId,
            clientId      : hashedClientId,
            isActive      : isActive,
            client_secret : hashedClient_secret
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
        let { app, backgroundColor, textColor, text, isActive, isTransparent, language, useStandardLanguage } = params;
        const { topBar } = app.customization;
        await TopBarRepository.prototype.findByIdAndUpdate(topBar._id, {
            textColor,
            backgroundColor, 
            text,
            isActive,
            language,
            useStandardLanguage
        })
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return params;
    },
    __editTopTab  : async (params) => {
        let { app, topTabParams, isTransparent, language, useStandardLanguage } = params;
        let topTab = await Promise.all(topTabParams.map( async topTab => {
            if(topTab.icon.includes("https")){
                /* If it is a link already */
                return topTab;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    icon   : !topTab.icon ? topTab.icon : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : topTab.icon}),
                    name    : topTab.name,
                    link_url : topTab.link_url
                };
            }
        }))
        await TopTabRepository.prototype.findByIdAndUpdateTopTab({
            _id: app.customization.topTab._id,
            newStructure: topTab,
            isTransparent,
            language,
            useStandardLanguage
        });
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return true;
    },
    __editIcons  : async (params) => {
        let { app, icons, icon_id, useDefaultIcons } = params;
        let icon = await Promise.all(icons.map( async icon => {
            if(icon.link.includes("https")){
                /* If it is a link already */
                return icon;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    link     : !icon.link ? icon.link : await GoogleStorageSingleton.uploadFileWithName({bucketName : 'betprotocol-icons', file : icon.link, fileName: `${icon.position}-${app._id}`}),
                    name     : icon.name,
                    position : icon.position
                };
            }
        }))
        await IconsRepository.prototype.findByIdAndUpdate({
            _id: icon_id,
            icon,
            useDefaultIcons
        });
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return true;
    },
    __socialLink  : async (params) => {
        let { app, links, social_link_id } = params;
        let link = await Promise.all(links.map( async link => {
            if(link.image_url.includes("https")){
                /* If it is a link already */
                return link;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    image_url   : !link.image_url ? link.image_url : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : link.image_url}),
                    name        : link.name,
                    href        : link.href
                };
            }
        }))
        await SocialLinkRepository.prototype.findByIdAndUpdateSocialLink({
            _id: social_link_id,
            newStructure: link
        });
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})

        return true;
    },
    __editBanners : async (params) => {
        let { app, autoDisplay, banners, fullWidth, language, useStandardLanguage } = params;
        let ids = await Promise.all(banners.map( async b => {
            if(b.image_url.includes("https")){
                /* If it is a link already */
                return b;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    image_url   : !b.image_url ? b.image_url : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : b.image_url}),
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
            fullWidth,
            language,
            useStandardLanguage
        })
        // Save info on Customization Part
        return params;
    },
    __editEsportScrenner : async (params) => {
        let { app, link_url, button_text, title, subtitle } = params;
        await EsportsScrennerRepository.prototype.findByIdAndUpdate({
            _id: app.customization.esportsScrenner._id,
            link_url,
            button_text,
            title,
            subtitle
        })
        /* Rebuild the App */
        await HerokuClientSingleton.deployApp({app : app.hosting_id})
        // Save info on Customization Part
        return true;
    },
    __editBackground: async (params) => {
        let { app, background } = params;
        let backgroundURL ="";
        if(background.includes("https")){
            /* If it is a link already */
            backgroundURL = background;
        }else {
            /* Does not have a Link and is a blob encoded64 */
            backgroundURL = !background ? background : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : background});
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
            logoURL = !logo ? logo : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : logo});
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
        let { app, communityLinks, supportLinks, language, useStandardLanguage } = params;
        let communityLinkIDs = await Promise.all(communityLinks.map( async c => {
            var imageCommunity = ''
            if(c.image_url.includes("https")){
                /* If it is a link already */
                imageCommunity = c.image_url;
            } else {
                imageCommunity = !c.image_url ? c.image_url : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : c.image_url})
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
                imageSupport = !c.image_url ? c.image_url : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : c.image_url})
            }
            return (await new Link({
                href: c.href,
                name: c.name,
                image_url: imageSupport
            }).register())._doc._id
        }));

        let footer = await FooterRepository.prototype.findByIdAndUpdate(app.customization.footer._id, {
            communityLinks : communityLinkIDs,
            supportLinks   : supportLinkIDs,
            language,
            useStandardLanguage
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
            topIconURL = !topIcon ? topIcon : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : topIcon});
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
            loadingGifURL = !loadingGif ? loadingGif : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : loadingGif});
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
        let { app, subSections, language, useStandardLanguage } = params;
        let ids = await Promise.all(subSections.map( async s => {
            if(s.image_url.includes("https") && s.image_url.includes("https")){
                /* If it is a link already */
                return s;
            }else{
                /* Does not have a Link and is a blob encoded64 */
                return {
                    title            : s.title,
                    text             : s.text,
                    image_url        : !s.image_url      ? s.image_url      : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : s.image_url}),
                    background_url   : !s.background_url ? s.background_url : await GoogleStorageSingleton.uploadFile({bucketName : 'betprotocol-apps', file : s.background_url}),
                    background_color : s.background_color,
                    position         : s.position,
                    location         : s.location
                };
            }
        }))
        await SubSectionsRepository.prototype.findByIdAndUpdate(app.customization.subSections._id, {
            ids,
            language,
            useStandardLanguage
        })
        // Save info on Customization Part
        return true;
    },
    __getUsers : async (params) => {
        let res = await UsersRepository.prototype.getAllFiltered(params);
        return res;
    },
    __kycWebhook: async (params) => {
        if(!params) {return false;}
        if(params.identityStatus==undefined) {
            return false;
        }
        const user_id = params.metadata.id;

        // save kyc log
        await KycLogRepository.prototype.schema.model(
            {
                user_id: params.user._id,
                app_id : params.app._id,
                kyc_id : params.idKyc
            }
        ).save();

        if([...params.app.restrictedCountries, ...fixRestrictCountry].indexOf(params.dataVerification.documents[0].country)!=-1) {
            await UsersRepository.prototype.editKycStatus(user_id, "country not allowed");
            IOSingleton.getIO().to(`Auth/${user_id}`).emit("updateKYC", {status: "country not allowed"});
            return;
        }
        if(params.user.birthday!=undefined && params.user.country_acronym!=undefined) {
            if(params.user.country_acronym!=null && params.dataVerification.documents[0].country.toUpperCase()!=params.user.country_acronym.toUpperCase()) {
                await UsersRepository.prototype.editKycStatus(user_id, "country other than registration");
                IOSingleton.getIO().to(`Auth/${user_id}`).emit("updateKYC", {status: "country other than registration"});
                return;
            }
            if(params.user.birthday!=null && (new Date(params.user.birthday.toISOString().split("T")[0])).getTime() != (new Date(params.dataVerification.documents[0].fields.dateOfBirth.value)).getTime()) {
                await UsersRepository.prototype.editKycStatus(user_id, "different birthday data");
                IOSingleton.getIO().to(`Auth/${user_id}`).emit("updateKYC", {status: "different birthday data"});
                return;
            }
        }
        if(params.identityStatus=="verified") {
            await UsersRepository.prototype.editKycNeeded(user_id, false);
            let attributes = {
                TEXT: `Your KYC was approved`
            };
			(new Mailer()).sendEmail({app_id : params.app._id, user: params.user, action : 'USER_NOTIFICATION', attributes});
        }
        if(params.identityStatus!=null) {
            await UsersRepository.prototype.editKycStatus(user_id, params.identityStatus);
            IOSingleton.getIO().to(`Auth/${user_id}`).emit("updateKYC", {status: params.identityStatus});
        }
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
                case 'AddCurrencyWallet' : {
					return await library.process.__addCurrencyWallet(params);
                };
                case 'UpdateBalanceApp' : {
					return await library.process.__updateBalanceApp(params);
				};
				case 'Register' : {
					return await library.process.__register(params); break;
				};
				case 'Summary' : {
					return await library.process.__summary(params); break;
                };
                case 'AppGetUsersBets' : {
					return await library.process.__appGetUsersBets(params); break;
                };
                case 'AppGetUsersBetsEsports' : {
					return await library.process.__appGetUsersBetsEsports(params); break;
                };
                case 'DeployApp' : {
					return await library.process.__deployApp(params); break;
                };
                case 'Get' : {
					return await library.process.__get(params); break;
                };
                case 'GetDeposit' : {
					return await library.process.__getDeposit(params); break;
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
                case 'AddLanguage' : {
                    return await library.process.__addLanguage(params); break;
                };
                case 'EditLanguage' : {
                    return await library.process.__editLanguage(params); break;
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
                case 'EditGameTableLimit' : {
                    return await library.process.__editGameTableLimit(params); break;
                };
                case 'EditAffiliateStructure' : {
                    return await library.process.__editAffiliateStructure(params); break;
                };
                case 'EditMoonPayIntegration' : {
                    return await library.process.__editMoonPayIntegration(params); break;
                };
                case 'EditAnalyticsKey' : {
                    return await library.process.__editAnalyticsKey(params); break;
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
                case 'EditVideogameEdge' : {
                    return await library.process.__editVideogameEdge(params); break;
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
                case 'ConvertPoints' : {
                    return await library.process.__convertPoints(params); break;
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
                case 'SocialLink' : {
                    return await library.process.__socialLink(params); break;
                };
                case 'EditBanners' : {
                    return await library.process.__editBanners(params); break;
                };
                case 'EditEsportScrenner' : {
                    return await library.process.__editEsportScrenner(params); break;
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
                case 'GetLastBetsEsports' : {
					return await library.process.__getLastBetsEsports(params); break;
                };
                case 'GetBiggestBetWinners' : {
					return await library.process.__getBiggestBetWinners(params); break;
                };
                case 'GetBiggestBetWinnersEsports' : {
					return await library.process.__getBiggestBetWinnersEsports(params); break;
                };
                case 'GetBiggestUserWinners' : {
					return await library.process.__getBiggestUserWinners(params); break;
                };
                case 'GetBiggestUserWinnersEsports' : {
					return await library.process.__getBiggestUserWinnersEsports(params); break;
                };
                case 'GetPopularNumbers' : {
					return await library.process.__getPopularNumbers(params); break;
                };
                case 'GetUsers' : {
					return await library.process.__getUsers(params); break;
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
                case 'GetBetInfoEsports' : {
					return await library.process.__getBetInfoEsports(params); break;
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
                case 'AddAddonFreeCurrency' : {
                    return await library.process.__addAddonFreeCurrency(params); break;
                };
                case 'GetCompliance' : {
                    return await library.process.__getCompliance(params); break;
                };
                case 'GetUsersWithdraws' : {
					return await library.process.__getUsersWithdraws(params); 
                };
                case 'ProcessConfirm' : {
					return await library.process.__processConfirm(params); 
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
                case 'AddCurrencyWallet' : {
					return await library.progress.__addCurrencyWallet(params);
                };
                case 'UpdateBalanceApp' : {
					return await library.progress.__updateBalanceApp(params);
				};
				case 'Register' : {
					return await library.progress.__register(params); break;
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
                case 'AddLanguage' : {
                    return await library.progress.__addLanguage(params); break;
                };
                case 'EditLanguage' : {
                    return await library.progress.__editLanguage(params); break;
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
				case 'Summary' : {
					return await library.progress.__summary(params); break;
                };
                case 'AppGetUsersBets' : {
					return await library.progress.__appGetUsersBets(params); break;
                };
                case 'AppGetUsersBetsEsports' : {
					return await library.progress.__appGetUsersBetsEsports(params); break;
                };
                case 'DeployApp' : {
					return await library.progress.__deployApp(params); break;
                };
                case 'Get' : {
					return await library.progress.__get(params); break;
                };
                case 'GetDeposit' : {
					return await library.progress.__getDeposit(params); break;
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
                case 'EditVideogameEdge' : {
                    return await library.progress.__editVideogameEdge(params); break;
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
                case 'EditAnalyticsKey' : {
                    return await library.progress.__editAnalyticsKey(params); break;
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
                case 'ConvertPoints' : {
                    return await library.progress.__convertPoints(params); break;
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
                case 'SocialLink' : {
                    return await library.progress.__socialLink(params); break;
                };
                case 'EditBanners' : {
                    return await library.progress.__editBanners(params); break;
                };
                case 'EditEsportScrenner' : {
                    return await library.progress.__editEsportScrenner(params); break;
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
                case 'GetLastBetsEsports' : {
					return await library.progress.__getLastBetsEsports(params); break;
                };
                case 'GetBiggestBetWinners' : {
					return await library.progress.__getBiggestBetWinners(params); break;
                };
                case 'GetBiggestBetWinnersEsports' : {
					return await library.progress.__getBiggestBetWinnersEsports(params); break;
                };
                case 'GetBiggestUserWinners' : {
					return await library.progress.__getBiggestUserWinners(params); break;
                };
                case 'GetBiggestUserWinnersEsports' : {
					return await library.progress.__getBiggestUserWinnersEsports(params); break;
                };
                case 'GetPopularNumbers' : {
					return await library.progress.__getPopularNumbers(params); break;
                };
                case 'GetUsers' : {
					return await library.progress.__getUsers(params); break;
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
                case 'GetBetInfoEsports' : {
					return await library.progress.__getBetInfoEsports(params); break;
                };
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
                case 'AddAddonFreeCurrency' : {
                    return await library.progress.__addAddonFreeCurrency(params); break;
                };
                case 'GetCompliance' : {
                    return await library.progress.__getCompliance(params); break;
                };
                case 'GetUsersWithdraws' : {
					return await library.progress.__getUsersWithdraws(params); 
                };
                case 'ProcessConfirm' : {
					return await library.progress.__processConfirm(params); 
                };
			}
		}catch(error){
			throw error;
		}
	}
}

// Export Default Module
export default AppLogic;

