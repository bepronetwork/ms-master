import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editLoadingGif: (object) => {
        return {
            "loadingGif": object.loadingGif,
            "app": app_object(object),
            "admin": object.admin,
        }
    },
}


class MapperEditLoadingGif {

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
            EditLoadingGif: 'editLoadingGif'
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

let MapperEditLoadingGifSingleton = new MapperEditLoadingGif();

export {
    MapperEditLoadingGifSingleton
}