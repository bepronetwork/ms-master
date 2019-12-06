
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    walletTransaction: (object) => {
        return {
            app: {
                isValid: object.app.isValid,
                ownerAddress: object.app.ownerAddress,
                authorizedAddresses: [
                    ...object.app.authorizedAddresses
                ],
                croupierAddress: object.app.croupierAddress,
                games: [
                    ...object.app.games
                ],
                listAdmins: [
                    ...object.app.listAdmins
                ],
                services: [
                    ...object.app.services
                ],
                users: object.app.users.map(data => {
                    return ({
                        bets: [
                            ...data.bets
                        ],
                        deposits: [
                            ...data.deposits
                        ],
                        withdraws: [
                            ...data.withdraws
                        ],
                        isWithdrawing: data.isWithdrawing,
                        _id: data._id,
                        username: data.username,
                        full_name: data.full_name,
                        affiliate: data.affiliate,
                        name: data.name,
                        address: data.address,
                        wallet: data.wallet,
                        register_timestamp: data.register_timestamp,
                        nationality: data.nationality,
                        age: data.age,
                        email: data.email,
                        app_id: data.app_id,
                        external_user: data.external_user,
                        external_id: data.external_id,
                        affiliateLink: data.affiliateLink
                    })
                }),
                external_users: [
                    ...object.app.external_users
                ],
                deposits: [
                    ...object.app.deposits
                ],
                withdraws: [
                    ...object.app.withdraws
                ],
                countriesAvailable: [
                    ...object.app.countriesAvailable
                ],
                licensesId: [
                    ...object.app.licensesId
                ],
                isWithdrawing: object.app.isWithdrawing,
                _id: object.app._id,
                wallet: {
                    playBalance: object.app.wallet.playBalance,
                    _id: object.app.wallet._id
                },
                name: object.app.name,
                affiliateSetup: {
                    isActive: object.app.affiliateSetup.isActive,
                    affiliateStructures: object.app.affiliateSetup.affiliateStructures.map(data => {
                        return ({
                            isActive: data.isActive,
                            _id: data._id,
                            level: data.level,
                            percentageOnLoss: data.percentageOnLoss
                        })
                    }),
                    _id: object.app.affiliateSetup._id
                },
                customization: {
                    _id: object.app.customization._id,
                    topBar: {
                        isActive: object.app.customization.topBar.isActive,
                        _id: object.app.customization.topBar._id
                    },
                    banners: {
                        ids: [
                            ...object.app.customization.banners.ids
                        ],
                        autoDisplay: object.app.customization.banners.autoDisplay,
                        _id: object.app.customization.banners._id
                    }
                },
                integrations: {
                    _id: object.app.integrations._id,
                    chat: {
                        isActive: object.app.integrations.chat.isActive,
                        name: object.app.integrations.chat.name,
                        metaName: object.app.integrations.chat.metaName,
                        link: object.app.integrations.chat.link,
                        _id: object.app.integrations.chat._id,
                        privateKey: object.app.integrations.chat.privateKey,
                        publicKey: object.app.integrations.chat.publicKey
                    }
                },
                description: object.app.description,
                bearerToken: object.app.bearerToken,
                __v: object.app.__v,
                currencyTicker: object.app.currencyTicker,
                decimals: object.app.decimals,
                platformAddress: object.app.platformAddress,
                platformBlockchain: object.app.platformBlockchain,
                platformTokenAddress: object.app.platformTokenAddress
            },
            app_id: object.app_id,
            wallet: {
                playBalance: object.wallet.playBalance,
                _id: object.wallet._id
            },
            creationDate: object.creationDate,
            transactionHash: object.transactionHash,
            from: object.from,
            currencyTicker: object.currencyTicker,
            amount: object.amount,
            wasAlreadyAdded: object.wasAlreadyAdded,
            isValid: object.isValid
        }
    },
}


class MapperWallet {

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
            WalletTransaction: 'walletTransaction'
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

let MapperWalletSingleton = new MapperWallet();

export {
    MapperWalletSingleton
}