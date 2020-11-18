import ConverterSingleton from "../../../logic/utils/converter";
import { wallet_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */

const fixRestrictCountry = ConverterSingleton.convertCountry(require("../../../config/restrictedCountries.config.json"));


let outputs = {
    getUserInfo: (object) => {
        return ({
            "_id": object._id,
            "bets": object.bets ? object.bets.map(bet => { return { "_id": bet } }) : object.bets,
            "deposits": object.deposits ? object.deposits.map(deposit_id => {
                return ({
                    "_id": deposit_id
                })
            }) : object.deposits,
            "withdraws": object.withdraws ? object.withdraws.map(withdraw_id => {
                return ({
                    "_id": withdraw_id
                })
            }) : object.withdraws,
            ...wallet_object(object),
            "isWithdrawing": object.isWithdrawing,
            "email_confirmed": object.email_confirmed,
            "kyc_needed":object.kyc_needed,
            "kyc_status":object.kyc_status,
            "points": !object.points ? 0 : object.points,
            "username": object.username,
            "full_name": object.full_name,
            "affiliate": !object.affiliate ? {} : {
                "_id": object.affiliate._id,
                "affiliatedLinks": object.affiliate.affiliatedLinks,
                "wallet": object.affiliate.wallet ? object.affiliate.wallet.map(wallet => {
                    return ({
                        "_id": wallet._id,
                        "playBalance": wallet.playBalance,
                        "max_deposit": wallet.max_deposit,
                        "max_withdraw": wallet.max_withdraw,
                        "min_withdraw": wallet.min_withdraw,
                        "affiliate_min_withdraw": wallet.affiliate_min_withdraw,
                        "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(deposit_address_id => deposit_address_id) : wallet.depositAddresses,
                        "link_url": wallet.link_url,
                        "virtual": wallet.virtual,
                        "image": wallet.image,
                        "bonusAmount": wallet.bonusAmount,
                        "minBetAmountForBonusUnlocked": wallet.minBetAmountForBonusUnlocked,
                        "incrementBetAmountForBonus": wallet.incrementBetAmountForBonus,
                        "availableDepositAddresses": wallet.availableDepositAddresses,
                        "currency": !wallet.currency ? {} : {
                            "_id": wallet.currency._id,
                            "image": wallet.currency.image,
                            "ticker": wallet.currency.ticker,
                            "decimals": wallet.currency.decimals,
                            "name": wallet.currency.name,
                            "address": wallet.currency.address,
                            "virtual": wallet.currency.virtual,
                        },
                        "price": wallet.price,
                        "bitgo_id": wallet.bitgo_id,
                        "bank_address": wallet.bank_address
                    })
                }) : object.wallet,
            },
            "name": object.name,
            "register_timestamp": object.register_timestamp,
            "nationality": object.nationality,
            "age": object.age,
            "email": object.email,
            "security": !object.security ? {} : {
                "_id": object.security._id,
                "2fa_set": object.security['2fa_set'],
                "email_verified": object.security.email_verified,
            },
            "app_id": !object.app_id ? {} : {
                "_id": object.app_id._id,
                "isValid": object.app_id.isValid,
                "games": object.app_id.games,
                "listAdmins": object.app_id.listAdmins,
                "services": object.app_id.services,
                "currencies": object.app_id.currencies,
                "users": object.app_id.users,
                "external_users": object.app_id.external_users.length,
                "wallet": object.app_id.wallet,
                "deposits": object.app_id.deposits,
                "withdraws": object.app_id.withdraws,
                "countriesAvailable": object.app_id.countriesAvailable,
                "licensesId": object.app_id.licensesId,
                "isWithdrawing": object.app_id.isWithdrawing,
                "isUsersAllLocked": object.app_id.isUsersAllLocked,
                "virtual": object.app_id.virtual,
                "restrictedCountries": [...object.app_id.restrictedCountries, ...fixRestrictCountry],
                "typography": object.app_id.typography,
                "name": object.app_id.name,
                "affiliateSetup": object.app_id.affiliateSetup,
                "customization": object.app_id.customization,
                "integrations": object.app_id.integrations,
                "description": object.app_id.description,
                "hosting_id": object.app_id.hosting_id,
                "web_url": object.app_id.web_url,
                "addOn": object.app_id.addOn,
                "whitelistedAddresses": object.app_id.whitelistedAddresses
            },
            "external_user": object.external_user,
            "affiliateLink": object.affiliateLink,
            "betAmount": !object.betAmount ? 0 : object.betAmount,
            "winAmount": !object.winAmount ? 0 : object.winAmount,
            "profit": !object.profit ? 0 : object.profit,
            "playBalance": !object.playBalance ? object.wallet.map(wallet => wallet.playBalance) : object.playBalance,
            "currency": !object.currency ? null : object.currency,
        })
    },
}


class MapperGetUserInfo {

    constructor() {
        self = {
            outputs: outputs
        }

        /**
         * @object KEYS for Output Mapping
         * @key Input of Output Function <-> Output for Extern of the API
         * @value Output of Function in Outputs
         */

        this.KEYS = {
            GetUserInfo: 'getUserInfo'
        }
    }

    output(key, value) {
        try {
            return self.outputs[this.KEYS[key]](value);
        } catch (err) {
            throw err;
        }
    }
}

let MapperGetUserInfoSingleton = new MapperGetUserInfo();

export {
    MapperGetUserInfoSingleton
}