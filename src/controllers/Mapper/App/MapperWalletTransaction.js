
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    walletTransaction: (object) => {
        return {
            app_id: object.app_id,
            wallet : object.app.wallet,
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