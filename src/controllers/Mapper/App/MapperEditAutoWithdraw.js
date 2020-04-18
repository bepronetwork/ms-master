
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editAutoWithdraw: (object) => {
        return {
            ...auto_withdraw_object(object)
        }
    },
}


class MapperEditAutoWithdraw {

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
            EditAutoWithdraw: 'editAutoWithdraw'
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

let MapperEditAutoWithdrawSingleton = new MapperEditAutoWithdraw();

export {
    MapperEditAutoWithdrawSingleton
}