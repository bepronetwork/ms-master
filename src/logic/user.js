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
    AffiliateLinkRepository,
    AffiliateRepository,
    SecurityRepository,
    TokenRepository
} from '../db/repos';
import { Deposit, AffiliateLink, Wallet, Address } from '../models';
import MiddlewareSingleton from '../api/helpers/middleware';
import { throwError } from '../controllers/Errors/ErrorManager';
import { getIntegrationsInfo } from './utils/integrations';
import { fromPeriodicityToDates } from './utils/date';
import { BitGoSingleton } from './third-parties';
import PusherSingleton from './third-parties/pusher';
import Mailer from './services/mailer';
import { GenerateLink } from '../helpers/generateLink';
import { getVirtualAmountFromRealCurrency } from '../helpers/virtualWallet';

import {getBalancePerCurrency} from './utils/getBalancePerCurrency';
import { resetPassword } from '../api/controllers/user';
import { IS_DEVELOPMENT, USER_KEY, MS_MASTER_URL } from "../config";
import { cryptoEth, cryptoBtc } from './third-parties/cryptoFactory';
import { getCurrencyAmountFromBitGo } from "./third-parties/bitgo/helpers";

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

    __resendEmail: async (params) => {

        const user = await UsersRepository.prototype.findUserById(params.user);
        if (!user) { throwError('USER_NOT_EXISTENT') }

        const app = await AppRepository.prototype.findAppById(user.app_id, "simple");
        if (!app) { throwError("APP_NOT_EXISTENT");}

        let tokenConfirmEmail = MiddlewareSingleton.generateTokenEmail(user.email);
        let url = GenerateLink.confirmEmail([app.web_url, app.id, tokenConfirmEmail]);

        const normalized = {
            app,
            url,
            user
        }
        return normalized;
    },
    __confirmEmail: async (params) => {

        const payload = MiddlewareSingleton.resultTokenEmail(params.token);
        if (!payload) {
            throwError('TOKEN_INVALID');
        }
        if (payload.email == undefined ) {
            throwError('TOKEN_INVALID');
        }
        const email = payload.email;
        const user = await UsersRepository.prototype.findUserByEmail(email);
        if (!user) { throwError('USER_NOT_EXISTENT') }

        const normalized = {
            user_id: user._id
        }
        return normalized;
    },
    __login: async (params) => {
        var input_params = params;
        let normalized = {};
        var username = new String(params.username).toLowerCase().trim();
        let user = await __private.db.findUser(username);
        if (!user) { throwError('USER_NOT_EXISTENT') }
        if (!user.security) { throwError('UNKNOWN'); };

        let has2FASet = user.security['2fa_set'];
        let newBearerToken = MiddlewareSingleton.sign(user._id);
        var app = user.app_id;

        app = await AppRepository.prototype.findAppById(user.app_id, "simple");
        if (!app) { throwError("APP_NOT_EXISTENT");}

        var user_in_app = (app._id == params.app);
        const { integrations } = app;
        if (user) {
            normalized = {
                app_id: user.app_id,
                user_id: user._id,
                has2FASet,
                newBearerToken,
                user_in_app,
                username: username,
                user : user,
                password: input_params.password,
                security_id: user.security._id,
                verifiedAccount: new Security().unhashPassword(input_params.password, user.hash_password),
                integrations: getIntegrationsInfo({ integrations, user_id: username }),
                ...user
            }
        }
        return normalized;
    },
    __resetPassword: async (params) => {
        const user = await __private.db.findUser(params.username_or_email);
        if (!user) { throwError("USERNAME_OR_EMAIL_NOT_EXISTS"); }
        
        var app = await AppRepository.prototype.findAppById(user.app_id, "simple");
        if (!app) { throwError("APP_NOT_EXISTENT"); }
      

        let normalized = {
            name: user.name,
            user : user,
            app : app,
            user_id: user._id,
            url: app.web_url,
            app_id: app._id
        };
        return normalized;
    },
    __setPassword: async (params) => {
        const payload = MiddlewareSingleton.resultTokenDate(params.token);
        if (!payload) {
            throwError('TOKEN_INVALID');
        }

        if (Number((new Date()).getTime()) > Number(payload.time)) {
            throwError('TOKEN_EXPIRED');
        }
        const findToken = await TokenRepository.prototype.findByToken(params.token);

        if (!findToken || (String(findToken.user) !== String(params.user_id))) {
            throwError('TOKEN_INVALID');
        }

        let hash_password = new Security(params.password).hash();

        let updatePassword = await UsersRepository.prototype.updateUser({ id: params.user_id, param: { hash_password } });

        if (!updatePassword) {
            throwError('UNKNOWN');
        }

        let normalized = {
        }

        return normalized;
    },
    __login2FA: async (params) => {
        var username = new String(params.username).toLowerCase().trim();

        // Get User by Username
        let user = await __private.db.findUser(username);

        if (!user) { throwError('USER_NOT_EXISTENT') };
        if (!user.security) { throwError('UNKNOWN');    };

        var has2FASet = user.security['2fa_set'];
        var secret2FA = user.security['2fa_secret'];

        // is 2FA not Setup
        if ((!has2FASet) || (!secret2FA)) { throwError('USER_HAS_2FA_DEACTIVATED') }

        let isVerifiedToken2FA = (new Security()).isVerifiedToken2FA({
            secret: secret2FA,
            token: params['2fa_token']
        });
        let newBearerToken = MiddlewareSingleton.sign(user._id);

        var app = user.app_id;
        var user_in_app = (app._id == params.app);
        const { integrations } = app;

        let normalized = {
            has2FASet,
            secret2FA,
            newBearerToken,
            user_in_app,
            user,
            isVerifiedToken2FA,
            username: user.username,
            password: params.password,
            security_id: user.security._id,
            verifiedAccount: new Security().unhashPassword(params.password, user.hash_password),
            integrations: getIntegrationsInfo({ integrations, user_id: user.username }),
            ...user
        }

        return normalized;
    },
    __auth: async (params) => {
        // Get User by Username
        let user = await __private.db.findUserById(params.user);
        if (!user) { throwError('USER_NOT_EXISTENT') };
        if (!user.security) { throwError('UNKNOWN') };
        let normalized = user;
        return normalized;
    },
    __set2FA: async (params) => {
        // Get User by Username
        let user = await __private.db.findUserById(params.user);

        if (!user) { throwError('USER_NOT_EXISTENT') };
        if (!user.security) { throwError('UNKNOWN') };

        let isVerifiedToken2FA = (new Security()).isVerifiedToken2FA({
            secret: params['2fa_secret'],
            token: params['2fa_token']
        })
        let normalized = {
            newSecret: params['2fa_secret'],
            username: user.username,
            isVerifiedToken2FA,
            user_id: params.user,
            security_id: user.security._id,
            ...user
        }
        return normalized;
    },
    __register: async (params) => {
        var username = new String(params.username).toLowerCase().trim();
        let email = new String(params.email).toLowerCase().trim();
        let userEmail = await __private.db.findUserByEmail(email);
        if (userEmail) { throwError('ALREADY_EXISTING_EMAIL') }
        let userUsername = await __private.db.findUser(username);
        if (userUsername) { throwError('USERNAME_ALREADY_EXISTS') }

        const { affiliateLink, affiliate } = params;
        var input_params = params;
        //Set up Password Structure
        let user, hash_password;

        let app = await AppRepository.prototype.findAppById(params.app, "simple");
        if (!app) { throwError('APP_NOT_EXISTENT') }

        let balanceInitial = null;
        if(app.addOn != null) {
            balanceInitial = app.addOn.balance;
        }

        if (params.user_external_id) {
            // User is Extern (Only Widget Clients)
            user = await AppRepository.prototype.findUserByExternalId(input_params.app, input_params.user_external_id);
        } else {
            // User is Intern 
            user = await UsersRepository.prototype.findUser(username);
        }

        let alreadyExists = user ? true : false;
        // TO DO : Hash Password on Client Side
        if (params.password)
            hash_password = new Security(params.password).hash();

        let tokenConfirmEmail = MiddlewareSingleton.generateTokenEmail(params.email);
        let url = GenerateLink.confirmEmail([app.web_url, app.id, tokenConfirmEmail]);

        let normalized = {
            alreadyExists: alreadyExists,
            username: username,
            full_name: params.full_name,
            affiliate: affiliate,
            name: params.name,
            address: params.address,
            hash_password,
            register_timestamp: new Date(),
            nationality: params.nationality,
            age: params.age,
            security: params.security,
            email: new String(params.email).toLowerCase().trim(),
            affiliateLink,
            app: app,
            app_id: app.id,
            external_user: params.user_external_id ? true : false,
            external_id: params.user_external_id,
            balanceInitial,
            url
        }
        return normalized;
    },
    __summary: async (params) => {
        let normalized = {
            type: new String(params.type).toLowerCase().trim(),
            user: new String(params.user).trim(),
            opts: {
                dates: fromPeriodicityToDates({ periodicity: params.periodicity }),
                currency: params.currency
                // Add more here if needed
            }
        }
        return normalized;
    },
    __userGetBets: async (params) => {
        let bets = await UsersRepository.prototype.getUserBets({
            _id: params.user,
            offset: params.offset,
            size: params.size,
            bet: params.bet == undefined ? {} : {_id : params.bet},
            currency: params.currency == undefined ? {} : {currency : params.currency},
            game: params.game == undefined ? {} : {game : params.game}
        });
        return bets;
    },
    __getDepositAddress: async (params) => {
        var { currency, id, app } = params;
        /* Get User Id */
        let user = await UsersRepository.prototype.findUserById(id);
        app = await AppRepository.prototype.findAppById(app, "simple");
        if (!app) { throwError('APP_NOT_EXISTENT') }
        if (!user) { throwError('USER_NOT_EXISTENT') }
        if (!user.email_confirmed) { throwError('UNCONFIRMED_EMAIL') }
        const app_wallet = app.wallet.find(w => new String(w.currency._id).toString() == new String(currency).toString());
        var user_wallet = user.wallet.find(w => new String(w.currency._id).toString() == new String(currency).toString());
        if(user_wallet.currency.erc20){
            // Is ERC20 Token simulate use of eth wallet
            user_wallet = user.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String('eth').toLowerCase());
        }

        return {
            app_wallet,
            user,
            app,
            user_wallet
        };

    },
    __updateWallet: async (params) => {
        try {
            console.log("paramsUpdateWallet:::",params)
            var { currency, id } = params;

            /* Get User Info */
            let user = await UsersRepository.prototype.findUserById(id);
            if (!user) { throwError('USER_NOT_EXISTENT') }
            const wallet = user.wallet.find(w => new String(w.currency._id).toString() == new String(currency).toString());
            if (!wallet || !wallet.currency) { throwError('CURRENCY_NOT_EXISTENT') };
            
            /* Get App Info */
            var app = await AppRepository.prototype.findAppById(user.app_id._id, "simple");
            if (!app) { throwError('APP_NOT_EXISTENT') }
            let ticker = params.ticker;
            var amount = null;
            switch (ticker.toLowerCase()) {
                case 'eth':
                    amount = getCurrencyAmountFromBitGo({
                        amount: params.payload.value,
                        ticker
                    });
                    break;
                default:
                    amount = params.payload.value
                    break;
            }
            console.log("amount:::", amount)
            const app_wallet = app.wallet.find(w => new String(w.currency.ticker).toLowerCase() == new String(ticker).toLowerCase());
            currency = app_wallet.currency._id;
            if (!app_wallet || !app_wallet.currency) { throwError('CURRENCY_NOT_EXISTENT') };
            let addOn = app.addOn;
            let fee = 0;
            if(addOn && addOn.txFee && addOn.txFee.isTxFee){
                fee = addOn.txFee.deposit_fee.find(c => new String(c.currency).toString() == new String(currency).toString()).amount;
            }
            // /* Verify if the transactionHash was created */
            // const { state, entries, value: amount, type, txid: transactionHash, wallet: bitgo_id, label } = wBT;

            const from  = params.payload.from;
            const to    = params.payload.to;
            var isPurchase = false, virtualWallet = null, appVirtualWallet = null;
            const isValid = (params.payload.status === "0x1");
            console.log("wallet:: ", wallet.depositAddresses.find(c => new String(c.currency).toString() == new String(currency).toString()).address )
            console.log("wallet.bank_address:: ", wallet.bank_address)
            console.log("From:: ", from)
            if(wallet.depositAddresses.find(c => new String(c.currency).toString() == new String(currency).toString()).address == from){throwError('PAYMENT_FORWARDING_TRANSACTION')}

            /* Verify if this transactionHashs was already added */
            let deposit = await DepositRepository.prototype.getDepositByTransactionHash(params.txHash);
            let wasAlreadyAdded = deposit ? true : false;

            /* Verify if User is in App */
            let user_in_app = (app.users.findIndex(x => (x.toString() == user._id.toString())) > -1);

            let depositBonusValue = 0;
            let minBetAmountForBonusUnlocked = 0;
            let hasBonus = false;

            /* Verify it is a virtual casino purchase */
            if(app.virtual == true){
                isPurchase = true;
                virtualWallet = user.wallet.find( w => w.currency.virtual == true);
                appVirtualWallet = app.wallet.find( w => w.currency.virtual == true);
                if (!virtualWallet || !virtualWallet.currency) { throwError('CURRENCY_NOT_EXISTENT') };
            } else { /* Verify it not is a virtual casino purchase */
                /* Verify AddOn Deposit Bonus */
                if(addOn && addOn.depositBonus && addOn.depositBonus.isDepositBonus){
                    hasBonus = addOn.depositBonus.isDepositBonus;
                    let min_deposit = addOn.depositBonus.min_deposit.find(c => new String(c.currency).toString() == new String(currency).toString()).amount;
                    let percentage = addOn.depositBonus.percentage.find(c => new String(c.currency).toString() == new String(currency).toString()).amount;
                    let max_deposit = addOn.depositBonus.max_deposit.find(c => new String(c.currency).toString() == new String(currency).toString()).amount;
                    console.log(addOn.depositBonus.multiplier.find(c => new String(c.currency).toString() == new String(currency).toString()))
                    let multiplierNeeded = addOn.depositBonus.multiplier.find(c => new String(c.currency).toString() == new String(currency).toString()).multiple;
                    if (amount >= min_deposit && amount <= max_deposit){
                        depositBonusValue = (amount * (percentage/100));
                        minBetAmountForBonusUnlocked = (depositBonusValue*multiplierNeeded);
                    }
                }
            }

            let res = {
                maxDeposit: (app_wallet.max_deposit == undefined) ? 1 : app_wallet.max_deposit,
                app,
                app_wallet,
                user_in_app,
                isPurchase,
                virtualWallet,
                appVirtualWallet,
                user: user,
                wasAlreadyAdded,
                user_id: user._id,
                wallet: wallet,
                creationDate: new Date(),
                transactionHash: params.txHash,
                from: from,
                currencyTicker: wallet.currency.ticker,
                amount,
                isValid,
                fee,
                depositBonusValue,
                hasBonus,
                minBetAmountForBonusUnlocked
            }

            return res;
        } catch (err) {
            throw err;
        }
    },
    __getBets: async (params) => {
        if(!params.currency){
            params.currency = null
        }
        if(!params.game){
            params.game = null
        }
        let bets = await UsersRepository.prototype.getBets({
            _id: params.user,
            size: params.size,
            offset: params.offset,
            currency: params.currency,
            game : params.game,
            dates: fromPeriodicityToDates({ periodicity: params.periodicity })
        });
        return bets;
    },
    __getInfo: async (params) => {
        const { user, currency } = params;
        let res = await UsersRepository.prototype.findUserById(user);
        let userStats = await UsersRepository.prototype.findUserStatsById(user, currency);
        let statsObject = !userStats[0] ? {} : userStats[0];
        let normalized = {
            ...res._doc,
            ...statsObject
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

    __resendEmail: async (params) => {

        /* attributes  */
        let attributes = {
            URL: params.url
        };

        /* Send Email */
        new Mailer().sendEmail({app_id : params.app.id, user: params.user, action : 'USER_REGISTER', attributes});

        return {};
    },
    __confirmEmail: async (params) => {

        await UsersRepository.prototype.updateUser({
            id      : params.user_id,
            param   : {
                email_confirmed : true
            }
        });

        return {};
    },
    __login: async (params) => {
        await SecurityRepository.prototype.setBearerToken(params.security_id, params.newBearerToken);
        /* Send Login Email ASYNC - so that it is not dependent on user login */
        new Mailer().sendEmail({app_id : params.app_id, user : params.user, action : 'USER_LOGIN'});
        return {...params, bearerToken: params.newBearerToken};
    },
    __login2FA: async (params) => {
        await SecurityRepository.prototype.setBearerToken(params.security_id, params.newBearerToken);
        /* Send Login Email ASYNC - so that it is not dependent on user login */
        new Mailer().sendEmail({app_id : params.app_id, user : params.user, action : 'USER_LOGIN'});
        return {...params, bearerToken: params.newBearerToken};
    },
    __auth: async (params) => {
        return params;
    },
    __set2FA: async (params) => {
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
        const { name, user_id, url, app_id, user } = params;
        //expires in 1 days
        let bearerToken = MiddlewareSingleton.generateTokenDate((new Date(((new Date()).getTime() + 1 * 24 * 60 * 60 * 1000))).getTime());

        await (new Token({ user: user._id, token: bearerToken })).register();

        let attributes = {
            YOURNAME: name,
            TOKEN: bearerToken,
            USER: user_id,
            URL: GenerateLink.resetPassword([url, bearerToken, user_id])
        };
        new Mailer().sendEmail({app_id : app_id, user, action : 'USER_RESET_PASSWORD', attributes});
        return true;
    },
    __register: async (params) => {
        try {
            const { affiliate, app, balanceInitial } = params;

            /* Register of Available Wallets on App */
            params.wallet = await Promise.all(app.wallet.map(async w => {
                return (await (new Wallet({
                    currency : w.currency,
                    playBalance : getBalancePerCurrency(balanceInitial, w.currency._id)
                })).register())._doc._id;
            }));

            let user = await self.save(params);

            /* Register of Affiliate Link */
            let affiliateLinkObject = await (new AffiliateLink({
                userAffiliated: user._id,
                app_id: params.app.id,
                affiliateLink: params.affiliateLink
            })).register();

            /* Add affiliateLink _id */
            await UsersRepository.prototype.setAffiliateLink(user._id, affiliateLinkObject._id);
            /* Add Affiliate to Affiliate Link */
            await AffiliateLinkRepository.prototype.setAffiliate(affiliateLinkObject._id, affiliate);
            /* Add Afiliate Link to Parent Affiliates */
            let promisesId = affiliateLinkObject.parentAffiliatedLinks.map(async paf =>
                await AffiliateRepository.prototype.addAffiliateLinkChild(paf.affiliate, affiliateLinkObject._id)
            )
            await Promise.all(promisesId);

            /* Add to App */
            await AppRepository.prototype.addUser(params.app_id, user);

            /* attributes  */
            let attributes = {
                URL: params.url
            };

            /* Send Email */
            new Mailer().sendEmail({app_id : params.app.id, user, action : 'USER_REGISTER', attributes});
            user = await __private.db.findUserById(user._id);
            return user;
        } catch (err) {
            throw err;
        }
    },
    __summary: async (params) => {
        let res = await UsersRepository.prototype.getSummaryStats(params.type, params.user, params.opts);
        let normalized = {
            ...res
        }
        return normalized;
    },
    __userGetBets: async (params) => {
        return params;
    },
    __getDepositAddress: async (params) => {
        const { app_wallet, user_wallet, user, app } = params;

        let walletToAddress2 = await BitGoSingleton.getWallet({ ticker: app_wallet.currency.ticker, id: app_wallet.bitgo_id });
        console.log("1 ", walletToAddress2);
        let bitgo_address2;
        console.log("2 ", app_wallet.bitgo_id_not_webhook);
        if(!app_wallet.bitgo_id_not_webhook) {
            try {
                bitgo_address2 = await BitGoSingleton.generateDepositAddress({ wallet : walletToAddress2, label: `${app._id}-${app_wallet.currency.ticker}`});
            } catch(err) {console.log("test error ", err)}
            console.log("3 ", bitgo_address2.id);
            await WalletsRepository.prototype.updateBitgoIdNotWebhook(app_wallet._id, bitgo_address2.id);
            throwError('WALLET_WAIT');
        }
        if(!app_wallet.bank_address_not_webhook) {
            bitgo_address2 = await BitGoSingleton.generateDepositAddress({ wallet : walletToAddress2, label: `${app._id}-${app_wallet.currency.ticker}`, id: app_wallet.bitgo_id_not_webhook});
            console.log("3 ", bitgo_address2);
            if(!bitgo_address2.address) throwError('WALLET_WAIT');
            await WalletsRepository.prototype.updateAddress2(app_wallet._id, bitgo_address2.address)
        }

        let addresses = user_wallet.depositAddresses;
        let address = addresses.find( a => a.address);
        if(!address){


            // let bitgo_address = await BitGoSingleton.generateDepositAddress({ wallet, label: user._id, id: bitgo_id });
            var crypto_address = null;
            switch ((app_wallet.currency.ticker).toLowerCase()) {
                case 'btc': {
                    crypto_address = await cryptoBtc.CryptoBtcSingleton.generateDepositAddress();
                    console.log("app_wallet.::", app_wallet)
                    console.log("app_wallet.bank_address_not_webhook::", app_wallet.bank_address_not_webhook)
                    /* Import address to HD Wallet */
                    await cryptoBtc.CryptoBtcSingleton.importAddressAsWallet({
                        walletName  : `${user._id}-${user_wallet.currency.ticker}`, 
                        address     : crypto_address.payload.address,
                        password    : USER_KEY,
                        privateKey  : crypto_address.payload.privateKey
                    });
                    /* Record webhooks */
                    await cryptoBtc.CryptoBtcSingleton.addAppDepositWebhook({
                        address     : crypto_address.payload.address,
                        app_id      : user._id,
                        currency_id : user_wallet.currency._id,
                        isApp       : false
                    });
                    /* Record Payment Forwarding webhooks */
                    await cryptoBtc.CryptoBtcSingleton.createPaymentForwarding({
                        from: crypto_address.payload.address, 
                        to: app_wallet.bank_address_not_webhook, 
                        callbackURL: `${MS_MASTER_URL}/api/user/paymentForwarding?id=${user._id}&currency=${user_wallet.currency._id}&isApp=${false}`, 
                        wallet: `${user._id}-${user_wallet.currency.ticker}`, 
                        password: USER_KEY, 
                        confirmations: 3
                    }); 
                    break;
                };
                case 'eth': {
                    crypto_address = await cryptoEth.CryptoEthSingleton.generateDepositAddress();
                    /* Record webhooks */
                    await cryptoEth.CryptoEthSingleton.addAppDepositWebhook({
                        address     : crypto_address.payload.address,
                        app_id      : user._id,
                        currency_id : user_wallet.currency._id,
                        isApp       : false
                    });
                    /* Record Payment Forwarding webhooks */
                    await cryptoEth.CryptoEthSingleton.createPaymentForwarding({
                        from: crypto_address.payload.address, 
                        to: app_wallet.bank_address_not_webhook, 
                        callbackURL: `${MS_MASTER_URL}/api/user/paymentForwarding?id=${user._id}&currency=${user_wallet.currency._id}&isApp=${false}`, 
                        wallet: crypto_address.payload.address, 
                        privateKey: crypto_address.payload.privateKey,
                        confirmations: 3
                    }); 
                    break;
                };
            }

            address = {
                address: crypto_address.payload.address,
                hashed_private_key: Security.prototype.encryptData(crypto_address.payload.privateKey),
                wif: !crypto_address.payload.wif ? '' : crypto_address.payload.wif
            };
            // Bitgo has created the address
            let addressObject = (await (new Address({ currency: user_wallet.currency._id, user: user._id, address: address.address, wif_btc: address.wif, hashed_private_key : address.hashed_private_key})).register())._doc;
            // Add Deposit Address to User Deposit Addresses
            await WalletsRepository.prototype.addDepositAddress(user_wallet._id, addressObject._id);
        }else{
            // System already has an address
        }

        if (address.address) {
            //Address Existent
            return {
                address: address.address,
                currency: user_wallet.currency.ticker
            }
        } else {
            // Not existent
            return {
                message: 'Waiting for address initialization'
            }
        }

    },
    __updateWallet: async (params) => {

        try {
            let { virtualWallet, appVirtualWallet, isPurchase, wallet, amount, fee, app_wallet, depositBonusValue, hasBonus, minBetAmountForBonusUnlocked } = params;
            var message;

            /* Condition to set value of deposit amount and fee */
            if(amount <= fee){
                fee = amount;
                amount = 0;
            }else{
                amount = amount - fee;
            }
            
            const options = {
                purchaseAmount : isPurchase ? getVirtualAmountFromRealCurrency({
                    currency : wallet.currency,
                    currencyAmount : amount,
                    virtualWallet : appVirtualWallet
                }) : amount,
                isPurchase : isPurchase,
            }

            /* Create Deposit Object */
            let deposit = new Deposit({
                user: params.user_id,
                transactionHash: params.transactionHash,
                creation_timestamp: params.creationDate,
                isPurchase : options.isPurchase,
                last_update_timestamp: params.creationDate,
                purchaseAmount : options.purchaseAmount,
                address: params.from,                         // Deposit Address 
                currency: wallet.currency._id,
                amount: amount,
                fee: fee,
                hasBonus: hasBonus,
                bonusAmount: depositBonusValue
            })

            /* Save Deposit Data */
            let depositSaveObject = await deposit.createDeposit();

            if(isPurchase){
                /* User Purchase - Virtual */
                await WalletsRepository.prototype.updatePlayBalance(virtualWallet, options.purchaseAmount);
                message = `Bought ${options.purchaseAmount} ${virtualWallet.currency.ticker} in your account with ${amount} ${wallet.currency.ticker}`
            }else{
                /* Add bonus amount */
                await WalletsRepository.prototype.updatePlayBalanceBonus(wallet._id, depositBonusValue);
                await WalletsRepository.prototype.updateMinBetAmountForBonusUnlocked(wallet._id, minBetAmountForBonusUnlocked);
                /* User Deposit - Real */
                await WalletsRepository.prototype.updatePlayBalance(app_wallet._id, fee);
                await WalletsRepository.prototype.updatePlayBalance(wallet._id, amount);
                message = `Deposited ${amount} ${wallet.currency.ticker} in your account`
            }
            /* Add Deposit to user */
            await UsersRepository.prototype.addDeposit(params.user_id, depositSaveObject._id);
            
            /* Push Webhook Notification */
            PusherSingleton.trigger({
                channel_name: params.user_id,
                isPrivate: true,
                message,
                eventType: 'DEPOSIT'
            });

            /* Send Email */
            let mail = new Mailer();
            let attributes = {
                TEXT: mail.setTextNotification('DEPOSIT', amount, params.wallet.currency.ticker)
            };

            mail.sendEmail({app_id : params.app.id, user : params.user, action : 'USER_NOTIFICATION', attributes});
            return params;
        } catch (err) {
            throw err;
        }
    },
    __getBets: async (params) => {
        return params;
    },
    __getInfo: async (params) => {
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
            db: scope.db,
            __normalizedSelf: null
        };

        library = {
            process: processActions,
            progress: progressActions
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
        try {
            switch (processAction) {
                case 'Login': {
                    return await library.process.__login(params); break;
                };
                case 'Login2FA': {
                    return await library.process.__login2FA(params);
                };
                case 'Auth': {
                    return await library.process.__auth(params);
                };
                case 'Set2FA': {
                    return await library.process.__set2FA(params);
                };
                case 'Register': {
                    return await library.process.__register(params); break;
                };
                case 'Summary': {
                    return await library.process.__summary(params); break;
                };
                case 'UserGetBets': {
                    return await library.process.__userGetBets(params); break;
                };
                case 'GetDepositAddress': {
                    return await library.process.__getDepositAddress(params);
                };
                case 'UpdateWallet': {
                    return await library.process.__updateWallet(params);
                };
                case 'GetBets': {
                    return await library.process.__getBets(params); break;
                };
                case 'GetInfo': {
                    return await library.process.__getInfo(params); break;
                };
                case 'ResetPassword': {
                    return await library.process.__resetPassword(params); break;
                };
                case 'SetPassword': {
                    return await library.process.__setPassword(params); break;
                };
                case 'ConfirmEmail': {
                    return await library.process.__confirmEmail(params); break;
                }
                case 'ResendEmail': {
                    return await library.process.__resendEmail(params); break;
                }
            }
        } catch (err) {
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

    async testParams(params, action) {
        try {
            error.user(params, action);
        } catch (err) {
            throw err;
        }
    }


    async progress(params, progressAction) {
        try {
            switch (progressAction) {
                case 'Login': {
                    return await library.progress.__login(params);
                };
                case 'Login2FA': {
                    return await library.progress.__login2FA(params);
                };
                case 'Auth': {
                    return await library.progress.__auth(params);
                };
                case 'Set2FA': {
                    return await library.progress.__set2FA(params);
                };
                case 'Register': {
                    return await library.progress.__register(params);
                };
                case 'Summary': {
                    return await library.progress.__summary(params);
                };
                case 'UserGetBets': {
                    return await library.progress.__userGetBets(params); break;
                };
                case 'GetDepositAddress': {
                    return await library.progress.__getDepositAddress(params);
                };
                case 'UpdateWallet': {
                    return await library.progress.__updateWallet(params);
                };
                case 'GetBets': {
                    return await library.progress.__getBets(params); break;
                };
                case 'GetInfo': {
                    return await library.progress.__getInfo(params); break;
                };
                case 'ResetPassword': {
                    return await library.progress.__resetPassword(params); break;
                };
                case 'SetPassword': {
                    return await library.progress.__setPassword(params); break;
                };
                case 'ConfirmEmail': {
                    return await library.progress.__confirmEmail(params); break;
                };
                case 'ResendEmail': {
                    return await library.progress.__resendEmail(params); break;
                };
            }
        } catch (err) {
            throw err;
        }
    }
}

// Export Default Module
export default UserLogic;