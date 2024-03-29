
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    summaryGames: (object) => {
        return object.item.map(object => {
            return ({
                "date": !object.date ? {} : {
                    "month": object.date.month,
                    "year": object.date.year,
                },
                "games": !object.games ? [] : object.games.map(game => {
                    return({
                        "_id": game._id,
                        "name": game.name,
                        "edge": game.edge,
                        "betsAmount": game.betsAmount,
                        "betAmount": game.betAmount,
                        "profit": game.profit,
                        "fees": game.fees
                    })
                }),
            })
        })
    }
}


class MapperSummaryGames {

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
            SummaryGames: 'summaryGames'
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

let MapperSummaryGamesSingleton = new MapperSummaryGames();

export {
    MapperSummaryGamesSingleton
}