
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getPopularNumbers: (object) => {
        return object[0] == undefined ? {} : {
            "_id": object[0]._id,
            "app": object[0].app,
            "timestamp": object[0].timestamp,
            "popularNumbers": !object[0].popularNumbers ? [] : object[0].popularNumbers.map(popularNumbers => {
                return ({
                    "_id": popularNumbers._id,
                    "game": popularNumbers.game,
                    "numbers": !popularNumbers.numbers ? [] : popularNumbers.numbers.map(number => {
                        return ({
                            "key": number.key,
                            "index": number.index,
                            "probability": number.probability,
                            "resultAmount": number.resultAmount
                        })
                    })
                })
            }),
            "__v": object[0].__v,
        }
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