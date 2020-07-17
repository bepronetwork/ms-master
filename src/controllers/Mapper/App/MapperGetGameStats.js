
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    summaryOneGames: (object) => {
        return !object ? {} : {
            "_id": object._id,
            "name": object.name,
            "edge": object.edge,
            "betsAmount": object.betsAmount,
            "betAmount": object.betAmount,
            "profit": object.profit,
            "fees": object.fees,
            "limitTable": object.limitTable
        }
    }
}


class MapperSummaryOneGames {

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
            SummaryOneGames: 'summaryOneGames'
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

let MapperSummaryOneGamesSingleton = new MapperSummaryOneGames();

export {
    MapperSummaryOneGamesSingleton
}