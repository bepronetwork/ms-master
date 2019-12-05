
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    userRegister: (object) => {
        return {
            bets: [
                ...object.bets
            ],
            deposits: [
                ...object.deposits
            ],
            withdraws: [
                ...object.withdraws
            ],
            isWithdrawing: object.isWithdrawing,
            _id: object._id,
            username: object.username,
            full_name: object.full_name,
            affiliate: {
                affiliatedLinks: [
                    ...object.affiliate.affiliatedLinks
                ],
                _id: object.affiliate._id,
                wallet: {
                    playBalance: object.affiliate.wallet.playBalance,
                    _id: object.affiliate.wallet._id
                }
            },
            name: object.name,
            address: object.address,
            wallet: {
                playBalance: object.wallet.playBalance,
                _id: object.withdraws._id
            },
            register_timestamp: object.register_timestamp,
            nationality: object.nationality,
            age: object.age,
            email: object.email,
            app_id: {
                isValid: object.app_id.isValid,
                ownerAddress: object.app_id.ownerAddress,
                authorizedAddresses: [
                    ...object.app_id.authorizedAddresses
                ],
                croupierAddress: object.app_id.croupierAddress,
                games: [
                    ...object.app_id.games
                ],
                listAdmins: [
                    ...object.app_id.listAdmins
                ],
                services: [
                    ...object.app_id.services
                ],
                users: [
                    ...object.app_id.users
                ],
                external_users: [
                    ...object.app_id.external_users
                ],
                deposits: [
                    ...object.app_id.deposits
                ],
                withdraws: [
                    ...object.app_id.withdraws
                ],
                countriesAvailable: [
                    ...object.app_id.countriesAvailable
                ],
                licensesId: [
                    ...object.app_id.licensesId
                ],
                isWithdrawing: object.app_id.isWithdrawing,
                _id: object.app_id._id,
                wallet: {
                    playBalance: object.app_id.wallet.playBalance,
                    _id: object.app_id.wallet._id
                },
                name: object.app_id.name,
                affiliateSetup: object.app_id.affiliateSetup,
                customization: object.app_id.customization,
                integrations: {
                    _id: object.app_id.integrations._id,
                    chat: {
                        isActive: object.app_id.integrations.chat.isActive,
                        name: object.app_id.integrations.chat.name,
                        metaName: object.app_id.integrations.chat.metaName,
                        link: object.app_id.integrations.chat.link,
                        _id: object.app_id.integrations.chat._id,
                        privateKey: object.app_id.integrations.chat.privateKey,
                        publicKey: object.app_id.integrations.chat.publicKey
                    }
                },
                description: object.app_id.description,
            },
            external_user: object.external_user,
            external_id: object.external_id,
            __v: object.__v,
            affiliateLink: {
                parentAffiliatedLinks: [
                    ...object.affiliateLink.parentAffiliatedLinks
                ],
                _id: object.affiliateLink._id,
                userAffiliated: object.affiliateLink.userAffiliated,
                affiliateStructure: {
                    isActive: object.affiliateLink.affiliateStructure.isActive,
                    _id: object.affiliateLink.affiliateStructure._id,
                    level: object.affiliateLink.affiliateStructure.level,
                    percentageOnLoss: object.affiliateLink.affiliateStructure.percentageOnLoss
                },
                affiliate: object.affiliateLink.affiliate
            }
        }
    },
}


class MapperUser {

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

let MapperUserSingleton = new MapperUser();

export {
    MapperUserSingleton
}