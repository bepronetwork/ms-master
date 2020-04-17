import { wallet_object, security_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    login2faUser: (object) => {
        return {
            "username": object.username,
            "email": object.email,
            "id": object._id,           
            "bearerToken": object.bearerToken,
            "name": object.name,
            "email_confirmed": object.email_confirmed,
            ...wallet_object(object),
            "bets": object.bets ? object.bets.map(bet_id => { return ({_id: bet_id }) } ) : object.bets,
            "affiliateWallet": object.affiliate.wallet ? object.affiliate.wallet.map(affiliateWallet => {
                return ({
                    "_id": affiliateWallet._id,
                    "playBalance": affiliateWallet.playBalance,
                    "max_deposit": affiliateWallet.max_deposit,
                    "max_withdraw": affiliateWallet.max_withdraw,
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
                }
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
                        "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(depositAddress_id => { return ({_id: depositAddress_id }) } ) : wallet.depositAddresses,
                        "link_url": wallet.link_url,
                        "currency": {
                            "_id": wallet.currency._id,
                            "image": wallet.currency.image,
                            "ticker": wallet.currency.ticker,
                            "decimals": wallet.currency.decimals,
                            "name": wallet.currency.name,
                            "address": wallet.currency.address,
                            "virtual": wallet.currency.virtual
                        },
                    })
                }) : object.affiliate.wallet,
                "affiliatedLinks": object.affiliate.affiliatedLinks ? object.affiliate.affiliatedLinks.map(affiliatedLink_id => affiliatedLink_id) : object.affiliate.affiliatedLinks,
            } : object.affiliate,
            ...security_object(object),
        }
    },
}


class Mapperlogin2faUser {

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
            Login2faUser: 'login2faUser'
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

let Mapperlogin2faUserSingleton = new Mapperlogin2faUser();

export {
    Mapperlogin2faUserSingleton
}