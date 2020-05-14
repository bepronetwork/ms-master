import { tx_fee_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editAddonTxFee: (object) => {
        return {
            ...tx_fee_object(object)
        }
    },
}


class MapperEditAddonTxFee {

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
            EditAddonTxFee: 'editAddonTxFee'
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

let MapperEditAddonTxFeeSingleton = new MapperEditAddonTxFee();

export {
    MapperEditAddonTxFeeSingleton
}