import { deposit_bonus_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editAddonDepositBonus: (object) => {
        return {
            ...deposit_bonus_object(object)
        }
    },
}


class MapperEditAddonDepositBonus {

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
            EditAddonDepositBonus: 'editAddonDepositBonus'
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

let MapperEditAddonDepositBonusSingleton = new MapperEditAddonDepositBonus();

export {
    MapperEditAddonDepositBonusSingleton
}