import { wallet_object, security_object, bets_object } from "../Structures";
import { Security } from "../../Security";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    loginRegister: (object) => {
        return {
            "username": object.username,
            "email": object.email,
            "id": object._id,
            "name": object.name,
            "bearerToken": object.bearerToken,
            "email_confirmed": object.email_confirmed,
            ...wallet_object(object),
            "affiliateWallet": object.affiliate.wallet ? object.affiliate.wallet.map(affiliateWallet => {
                return ({
                    "_id": affiliateWallet._id,
                    "playBalance": affiliateWallet.playBalance,
                    "max_deposit": affiliateWallet.max_deposit,
                    "max_withdraw": affiliateWallet.max_withdraw,
                    "min_withdraw": affiliateWallet.min_withdraw,
                    "affiliate_min_withdraw": affiliateWallet.affiliate_min_withdraw,
                    "depositAddresses": affiliateWallet.depositAddresses ? affiliateWallet.depositAddresses.map(depositAddress_id => { return ({_id: depositAddress_id }) } ) : affiliateWallet.depositAddresses,
                    "link_url": affiliateWallet.link_url,
                    "currency": {
                        "_id": affiliateWallet.currency._id,
                        "image": affiliateWallet.currency.image,
                        "ticker": affiliateWallet.currency.ticker,
                        "decimals": affiliateWallet.currency.decimals,
                        "name": affiliateWallet.currency.name,
                        "address": affiliateWallet.currency.address
                    },
                })
            }) : object.affiliate.wallet,
            "withdraws": object.withdraws ? object.withdraws.map(withdraw_id => { return ({_id: withdraw_id }) } ) : object.withdraws,
            "deposits": object.deposits ? object.deposits.map(deposit_id => { return ({_id: deposit_id }) } ) : object.deposits,
            ...bets_object(object),
            "verifiedAccounts": object.verifiedAccounts,
            "integrations": {
                "chat": {
                    "_id": object.integrations.chat._id,
                    "isActive": object.integrations.chat.isActive,
                    "name": object.integrations.chat.name,
                    "metaName": object.integrations.chat.metaName,
                    "link": object.integrations.chat.link,
                    "privateKey": object.integrations.chat.privateKey,
                    "publicKey": object.integrations.chat.publicKey,
                    "token": object.integrations.chat.token
                },
                "cripsr": !object.integrations.cripsr ? {} : {
                    "_id": object.integrations.cripsr._id,
                    "key": !object.integrations.cripsr.key ? object.integrations.cripsr.key : Security.prototype.decryptData(object.integrations.cripsr.key),
                    "isActive": object.integrations.cripsr.isActive,
                    "link": object.integrations.cripsr.link,
                    "name": object.integrations.cripsr.name,
                    "metaName": object.integrations.cripsr.metaName,
                },
                "kyc": !object.integrations.kyc ? {} : {
                    "_id": object.integrations.kyc._id,
                    "clientId": !object.integrations.kyc.clientId ? null : Security.prototype.decryptData(object.integrations.kyc.clientId),
                    "flowId": !object.integrations.kyc.flowId ? null : Security.prototype.decryptData(object.integrations.kyc.flowId),
                    "link": object.integrations.kyc.link,
                    "isActive": object.integrations.kyc.isActive,
                    "name": object.integrations.kyc.name,
                    "metaName": object.integrations.kyc.metaName,
                },
            },
            "affiliateId": object.affiliateLink._id,
            "affilateLinkInfo": object.affiliateLink ? {
                "_id": object.affiliateLink._id,
                "parentAffiliatedLinks": object.affiliateLink.parentAffiliatedLinks ? object.affiliateLink.parentAffiliatedLinks.map(parentAffiliatedLink_id => parentAffiliatedLink_id) : object.affiliateLink.parentAffiliatedLinks,
                "isCustom": object.affiliateLink.isCustom,
                "userAffiliated": object.affiliateLink.userAffiliated,
                "affiliateStructure": {
                    "_id": object.affiliateLink.affiliateStructure._id,
                    "isActive": object.affiliateLink.affiliateStructure.isActive,
                    "level": object.affiliateLink.affiliateStructure.level,
                    "percentageOnLoss": object.affiliateLink.affiliateStructure.percentageOnLoss,
                },
                "affiliate": object.affiliateLink.affiliate,
            } : object.affiliateLink,
            "affiliateInfo": object.affiliate ? {
                "_id": object.affiliate._id,
                "wallet": object.affiliate.wallet ? object.affiliate.wallet.map(wallet => {
                    return ({
                        "_id": wallet._id,
                        "playBalance": wallet.playBalance,
                        "max_deposit": wallet.max_deposit,
                        "max_withdraw": wallet.max_withdraw,
                        "min_withdraw": wallet.min_withdraw,
                        "affiliate_min_withdraw": wallet.affiliate_min_withdraw,
                        "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(depositAddress_id => { return ({_id: depositAddress_id }) } ) : wallet.depositAddresses,
                        "link_url": wallet.link_url,
                        "currency": {
                            "_id": wallet.currency._id,
                            "image": wallet.currency.image,
                            "ticker": wallet.currency.ticker,
                            "decimals": wallet.currency.decimals,
                            "name": wallet.currency.name,
                            "address": wallet.currency.address
                        },
                    })
                }) : object.affiliate.wallet,
                "affiliatedLinks": object.affiliate.affiliatedLinks ? object.affiliate.affiliatedLinks.map(affiliatedLink_id => affiliatedLink_id) : object.affiliate.affiliatedLinks,
            } : object.affiliate,
            ...security_object(object),
        }
    },
}


class MapperLoginUser {

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
            LoginRegister: 'loginRegister'
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

let MapperLoginUserSingleton = new MapperLoginUser();

export {
    MapperLoginUserSingleton
}