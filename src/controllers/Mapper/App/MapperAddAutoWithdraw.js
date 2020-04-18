import { auto_withdraw_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    addAutoWithdraw: (object) => {
        return {
            ...auto_withdraw_object(object)
        }
    },
}


class MapperAddAutoWithdraw {

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
            AddAutoWithdraw: 'addAutoWithdraw'
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

let MapperAddAutoWithdrawSingleton = new MapperAddAutoWithdraw();

export {
    MapperAddAutoWithdrawSingleton
}