import { edit_game_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    setMaxBet: (object) => {
        return {
            ...edit_game_object(object)
        }
    },
}


class MapperSetMaxBet {

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
            SetMaxBet: 'setMaxBet'
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

let MapperSetMaxBetSingleton = new MapperSetMaxBet();

export {
    MapperSetMaxBetSingleton
}