import { edit_game_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editGameImage: (object) => {
        return {
            ...edit_game_object(object)
        }
    },
}


class MapperEditGameImage {

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
            EditGameImage: 'editGameImage'
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

let MapperEditGameImageSingleton = new MapperEditGameImage();

export {
    MapperEditGameImageSingleton
}