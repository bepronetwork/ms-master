
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getPopularNumbers: (object) => {
        return object.map(object => {
            return ({
                "game": object.game,
                "numbers": !object.numbers ? [] : object.numbers.map(number => {
                    return({
                        "key": number.key,
                        "index": number.index,
                        "probability": number.probability,
                        "resultAmount": number.resultAmount
                    })
                })
            })
        })
    }
}


class MapperGetPopularNumbers {

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
            GetPopularNumbers: 'getPopularNumbers'
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

let MapperGetPopularNumbersSingleton = new MapperGetPopularNumbers();

export {
    MapperGetPopularNumbersSingleton
}