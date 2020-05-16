let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editTheme: (object) => {
        return {
            "app": object.app,
            "customization": object.customization,
            "theme": object.theme,
        }
    },
}


class MapperEditTheme {

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
            EditTheme: 'editTheme'
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

let MapperEditThemeSingleton = new MapperEditTheme();

export {
    MapperEditThemeSingleton
}