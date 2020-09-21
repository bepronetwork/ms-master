import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editTopBar: (object) => {
        return {
            "backgroundColor": object.backgroundColor,
            "textColor": object.textColor,
            "text": object.text,
            "isActive": object.isActive
        }
    },
}


class MapperEditTopBar {

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
            EditTopBar: 'editTopBar'
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

let MapperEditTopBarSingleton = new MapperEditTopBar();

export {
    MapperEditTopBarSingleton
}