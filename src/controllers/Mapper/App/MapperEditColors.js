import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editColor: (object) => {
        return {
            "colors": !object.colors ? [] : object.colors.map(color => {
                return ({
                    "type": color.type,
                    "hex": color.hex
                })
            })
        }
    },
}


class MapperEditColors {

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
            EditColor: 'editColor'
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

let MapperEditColorsSingleton = new MapperEditColors();

export {
    MapperEditColorsSingleton
}