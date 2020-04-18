import { auto_withdraw_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    addAddonAutoWithdraw: (object) => {
        return {
            ...auto_withdraw_object(object)
        }
    },
}


class MapperaddAddonAutoWithdraw {

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
            addAddonAutoWithdraw: 'addAddonAutoWithdraw'
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

let MapperaddAddonAutoWithdrawSingleton = new MapperaddAddonAutoWithdraw();

export {
    MapperaddAddonAutoWithdrawSingleton
}