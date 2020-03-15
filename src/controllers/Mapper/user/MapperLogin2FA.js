
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
            "id": object.id,
            "name": object.name,
            "email_confirmed": object.email_confirmed,
            "wallet": object.wallet.map(wallet => {
                return ({
                    "_id": wallet._id,
                    "playBalance": wallet.playBalance,
                    "max_deposit": wallet.max_deposit,
                    "max_withdraw": wallet.max_withdraw,
                    "depositAddresses": [
                        ...wallet.depositAddresses
                    ],
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
            }),
            "affiliateWallet": object.affiliateWallet == (undefined || null) ? [] : object.affiliateWallet.map(affiliateWallet => {
                return ({
                    "_id": affiliateWallet._id,
                    "playBalance": affiliateWallet.playBalance,
                    "max_deposit": affiliateWallet.max_deposit,
                    "max_withdraw": affiliateWallet.max_withdraw,
                    "depositAddresses": [
                        ...affiliateWallet.depositAddresses
                    ],
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
            }),
            "withdraws": [
                ...object.withdraws
            ],
            "bearerToken": object.bearerToken,
            "deposits": [
                ...object.deposits
            ],
            "verifiedAccounts": object.verifiedAccounts,
            "integrations": {
                "chat": {
                    "token": object.integrations.chat.token,
                    "publicKey": object.integrations.chat.publicKey
                }
            },
            "affiliateId": object.affiliateId,
            "affilateLinkInfo": object.affilateLinkInfo == (undefined || null) ? { } : {
                "_id": object.affilateLinkInfo._id,
                "parentAffiliatedLinks": [
                    ...object.affilateLinkInfo.parentAffiliatedLinks
                ],
                "isCustom": object.affilateLinkInfo.isCustom,
                "userAffiliated": object.affilateLinkInfo.userAffiliated,
                "affiliateStructure": {
                    "_id": object.affilateLinkInfo.affiliateStructure._id,
                    "isActive": object.affilateLinkInfo.affiliateStructure.isActive,
                    "level": object.affilateLinkInfo.affiliateStructure.level,
                    "percentageOnLoss": object.affilateLinkInfo.affiliateStructure.percentageOnLoss,
                },
                "affiliate": object.affilateLinkInfo.affiliate,
            },
            "affiliateInfo": object.affiliateInfo == (undefined || null) ? { } : {
                "_id": object.affiliateInfo._id,
                "wallet": object.affiliateInfo.map(wallet => {
                    return ({
                        "_id": wallet._id,
                        "playBalance": wallet.playBalance,
                        "max_deposit": wallet.max_deposit,
                        "max_withdraw": wallet.max_withdraw,
                        "depositAddresses": [
                            ...wallet.depositAddresses
                        ],
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
                }),
                "affiliatedLinks": [
                    ...object.affiliateInfo.affiliatedLinks
                ],
            },
            "security": {
                "id": object.security.id,
                "2fa_set": object.security['2fa_set'],
                "email_verified": object.security.email_verified,
                "bearerToken": object.security.bearerToken,
            },
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