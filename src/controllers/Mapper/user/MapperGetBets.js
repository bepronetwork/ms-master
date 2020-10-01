let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getBets: (object) => {
        return object.map(object => {
            return ({
                "_id": object._id,
                "betAmount": object.betAmount,
                "timestamp": object.timestamp,
                "isWon": object.isWon,
                "winAmount": object.winAmount,
                "currency": object.currency,
                "game": object.game,
                "tag": "cassino"
            })
        })
    }
}


class MapperGetBets {

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
            GetBets: 'getBets'
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

let MapperGetBetsSingleton = new MapperGetBets();

export {
    MapperGetBetsSingleton
}