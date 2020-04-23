
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getLastBets: (object) => {
        return object.map(object => {
            return ({
                "_id": object._id,
                "currency": object.currency,
                "betAmount": object.betAmount,
                "timestamp": object.timestamp,
                "isWon": object.isWon,
                "winAmount": object.winAmount,
                "username": object.username,
                "game": object.game
            })
        })
    }
}


class MapperGetLastBets {

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
            GetLastBets: 'getLastBets'
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

let MapperGetLastBetsSingleton = new MapperGetLastBets();

export {
    MapperGetLastBetsSingleton
}