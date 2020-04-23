import { wallet_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    summaryWallet: (object) => {
        return object.item.map(object => {
            return ({
                "_id": object._id,
                ...wallet_object(object),
            })
        })
    }
}


class MapperSummaryWallet {

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
            SummaryWallet: 'summaryWallet'
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

let MapperSummaryWalletSingleton = new MapperSummaryWallet();

export {
    MapperSummaryWalletSingleton
}