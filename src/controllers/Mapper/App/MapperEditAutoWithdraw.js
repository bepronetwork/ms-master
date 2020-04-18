import { auto_withdraw_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editAddonAutoWithdraw: (object) => {
        return {
            ...auto_withdraw_object(object)
        }
    },
}


class MappereditAddonAutoWithdraw {

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
            editAddonAutoWithdraw: 'editAddonAutoWithdraw'
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

let MappereditAddonAutoWithdrawSingleton = new MappereditAddonAutoWithdraw();

export {
    MappereditAddonAutoWithdrawSingleton
}