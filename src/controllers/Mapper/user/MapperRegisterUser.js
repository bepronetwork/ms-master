
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    userRegister: (object) => {
        return {
            "bets": [
                ...object.bets
            ],
            "deposits": [
                ...object.deposits
            ],
            "withdraws": [
                ...object.withdraws
            ],
            "isWithdrawing": object.isWithdrawing,
            "_id": object._id,
            "username": object.username,
            "full_name": object.full_name,
            "affiliate": {
                "affiliatedLinks": [
                    ...object.affiliate.affiliatedLinks
                ],
                "isNew": object.affiliate.isNew,
                "_doc": {
                    "wallet": object.affiliate._doc.wallet.map(wallet => {
                        return ({
                            "playBalance": wallet.playBalance,
                            "max_deposit": wallet.max_deposit,
                            "max_withdraw": wallet.max_withdraw,
                            "depositAddresses": [
                                ...wallet.depositAddresses
                            ],
                            "link_url": wallet.link_url,
                            "_id": wallet._id,
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
                        ...object.affiliate._doc.affiliatedLinks
                    ],
                    "_id": object.affiliate._doc._id
                },
            },
            "name": object.name,
            "wallet": object.wallet.map(wallet => {
                return ({
                    "playBalance": wallet.playBalance,
                    "max_deposit": wallet.max_deposit,
                    "max_withdraw": wallet.max_withdraw,
                    "depositAddresses": [
                        ...wallet.depositAddresses
                    ],
                    "link_url": wallet.link_url,
                    "_id": wallet._id,
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
            "register_timestamp": object.register_timestamp,
            "nationality": object.nationality,
            "age": object.age,
            "email": object.email,
            "app_id": {
                "isValid": object.app_id.isValid,
                "games": [
                    ...object.app_id.games
                ],
                "listAdmins": [
                    ...object.app_id.listAdmins
                ],
                "services": [
                    ...object.app_id.services
                ],
                "countriesAvailable": [
                    ...object.app_id.countriesAvailable
                ],
                "licensesId": [
                    ...object.app_id.licensesId
                ],
                "_id": object.app_id._id,
                "wallet": object.app_id.wallet.map(wallet => {
                    return ({
                        "playBalance": wallet.playBalance,
                        "max_deposit": wallet.max_deposit,
                        "max_withdraw": wallet.max_withdraw,
                        "depositAddresses": [
                            ...wallet.depositAddresses
                        ],
                        "link_url": wallet.link_url,
                        "_id": wallet._id,
                        "currency": {
                            "_id": wallet.currency._id,
                            "image": wallet.currency.image,
                            "ticker": wallet.currency.ticker,
                            "decimals": wallet.currency.decimals,
                            "name": wallet.currency.name,
                            "address": wallet.currency.address
                        },
                        "bitgo_id": wallet.bitgo_id,
                        "bank_address": wallet.bank_address,
                        "hashed_passphrase": wallet.hashed_passphrase,
                    })
                }),
                "name": object.app_id.name,
                "affiliateSetup": object.app_id.affiliateSetup,
                "customization": object.app_id.customization,
                "integrations": {
                    "_id": object.app_id.integrations._id,
                    "chat": {
                        "isActive": object.app_id.integrations.chat.isActive,
                        "name": object.app_id.integrations.chat.name,
                        "metaName": object.app_id.integrations.chat.metaName,
                        "link": object.app_id.integrations.chat.link,
                        "_id": object.app_id.integrations.chat._id,
                        "privateKey": object.app_id.integrations.chat.privateKey,
                        "publicKey": object.app_id.integrations.chat.publicKey
                    }
                },
                "description": object.app_id.description,
            },
            "external_user": object.external_user,
            "external_id": object.external_id,
            "affiliateLink": {
                "parentAffiliatedLinks": [
                    ...object.affiliateLink.parentAffiliatedLinks
                ],
                "_id": object.affiliateLink._id,
                "userAffiliated": object.affiliateLink.userAffiliated,
                "affiliateStructure": {
                    "isActive": object.affiliateLink.affiliateStructure.isActive,
                    "_id": object.affiliateLink.affiliateStructure._id,
                    "level": object.affiliateLink.affiliateStructure.level,
                    "percentageOnLoss": object.affiliateLink.affiliateStructure.percentageOnLoss
                },
                "affiliate": object.affiliateLink.affiliate
            }
        }
    },
}


class MapperRegisterUser {

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
            UserRegister: 'userRegister'
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

let MapperRegisterUserSingleton = new MapperRegisterUser();

export {
    MapperRegisterUserSingleton
}