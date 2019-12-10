
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    addBlockchain: (object) => {
        return {
            isValid: object.isValid,
            ownerAddress: object.ownerAddress,
            authorizedAddresses: [
                object.authorizedAddresses
            ],
            croupierAddress: object.croupierAddress,
            games: [
                object.games
            ],
            listAdmins: [
                ...object.listAdmins
            ],
            services: [
                ...object.services
            ],
            users: [
                ...object.users
            ],
            external_users: [
                ...object.external_users
            ],
            deposits: [
                ...object.deposits
            ],
            withdraws: [
                ...object.withdraws
            ],
            countriesAvailable: [
                ...object.countriesAvailable
            ],
            licensesId: [
                ...object.licensesId
            ],
            isWithdrawing: object.isWithdrawing,
            _id: object._id,
            wallet: object.wallet,
            name: object.name,
            affiliateSetup: object.affiliateSetup,
            customization: object.customization,
            integrations: object.integrations,
            description: object.description,
            currencyTicker: object.currencyTicker,
            decimals: object.decimals,
            platformAddress: object.platformAddress,
            platformBlockchain: object.platformBlockchain,
            platformTokenAddress: object.platformTokenAddress
        }
    },
}


class MapperAddBlockchain {

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
            AddBlockchain: 'addBlockchain'
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

let MapperAddBlockchainSingleton = new MapperAddBlockchain();

export {
    MapperAddBlockchainSingleton
}