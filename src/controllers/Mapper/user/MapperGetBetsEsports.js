let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getBetsEsports: (object) => {
        return object.map(object => {
            return ({
                "_id": object._id,
                "betAmount": object.betAmount,
                "timestamp": object.created_at,
                "isWon": object.isWon,
                "winAmount": object.winAmount,
                "currency": object.currency,
                "game": object.videogames.slug,
            })
        })
    }
}


class MapperGetBetsEsports {

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
            GetBetsEsports: 'getBetsEsports'
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

let MapperGetBetsEsportsSingleton = new MapperGetBetsEsports();

export {
    MapperGetBetsEsportsSingleton
}