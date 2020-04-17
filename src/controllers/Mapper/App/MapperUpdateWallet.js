import { app_object, wallet_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    updateWallet: (object) => {
        return {
            ...app_object(object),
            ...wallet_object(object),
            "creationDate": object.creationDate,
            "transactionHash": object.transactionHash,
            "from": object.from,
            "amount": object.amount,
            "wasAlreadyAdded": object.wasAlreadyAdded,
            "isValid": object.isValid,
        }
    },
}


class MapperUpdateWallet {

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
            UpdateWallet: 'updateWallet'
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

let MapperUpdateWalletSingleton = new MapperUpdateWallet();

export {
    MapperUpdateWalletSingleton
}