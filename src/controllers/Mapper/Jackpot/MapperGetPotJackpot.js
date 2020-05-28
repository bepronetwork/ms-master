

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getPotJackpot: (object) => {
        return {
            "pot": object.pot,
            "id": object.id
        }
    },
}


class MapperGetPotJackpot {

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
            GetPotJackpot: 'getPotJackpot'
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

let MapperGetPotJackpotSingleton = new MapperGetPotJackpot();

export {
    MapperGetPotJackpotSingleton
}