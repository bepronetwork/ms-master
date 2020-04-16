import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editLogo: (object) => {
        return {
            "logo": object.logo,
            "app": app_object(object),
            "admin": object.admin,
        }
    },
}


class MapperEditLogo {

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
            EditLogo: 'editLogo'
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

let MapperEditLogoSingleton = new MapperEditLogo();

export {
    MapperEditLogoSingleton
}