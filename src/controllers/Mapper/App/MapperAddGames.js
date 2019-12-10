
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    addGames: (object) => {
        return {
            gameEcosystem: {
                resultSpace: object.gameEcosystem.resultSpace.map(data => {
                    return ({
                        _id: data._id,
                        formType: data.formType,
                        probability: data.probability
                    })
                }),
                isValid: object.gameEcosystem.isValid,
                _id: object.gameEcosystem._id,
                name: object.gameEcosystem.name,
                metaName: object.gameEcosystem.metaName,
                description: object.gameEcosystem.description,
                image_url: object.gameEcosystem.image_url
            },
            app: {
                isValid: object.app.isValid,
                ownerAddress: object.app.ownerAddress,
                authorizedAddresses:[
                    object.app.authorizedAddresses
                ],
                croupierAddress: [
                    object.app.croupierAddress
                ],
                games: [
                    ...object.app.games
                ],
                listAdmins: [
                    ...object.app.listAdmins
                ],
                services: [
                    ...object.app.services
                ],
                users: [
                    ...object.app.users
                ],
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
                wallet: object.app.wallet,
                name: object.app.name,
                affiliateSetup: object.app.affiliateSetup,
                customization: object.app.customization,
                integrations: object.app.integrations,
                description: object.app.description,
                currencyTicker: object.app.currencyTicker,
                decimals: object.app.decimals,
                platformAddress: object.app.platformAddress,
                platformBlockchain: object.app.platformBlockchain,
                platformTokenAddress: object.app.platformTokenAddress
            }
        }
    },
}


class MapperAddGames {

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
            AddGames: 'addGames'
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

let MapperAddGamesSingleton = new MapperAddGames();

export {
    MapperAddGamesSingleton
}