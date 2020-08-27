import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editTypography: (object) => {
        return {
            "typography": object.typography ? { name: object.typography.name, url: object.typography.url } : object.typography
        }
    },
}


class MapperEditTypography {

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
            EditTypography: 'editTypography'
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

let MapperEditTypographySingleton = new MapperEditTypography();

export {
    MapperEditTypographySingleton
}