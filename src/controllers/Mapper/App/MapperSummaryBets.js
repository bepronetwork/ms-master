
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    summaryBets: (object) => {
        return object.item.map(object => {
            return ({
                "date": !object.date ? {} : {
                    "week": object.date.week,
                    "year": object.date.year,
                },
                "bets": !object.bets ? {} : {
                    "avg_bet": object.bets.avg_bet,
                    "avg_bet_return": object.bets.avg_bet_return,
                    "won": object.bets.won,
                    "percentage_won": object.bets.percentage_won,
                    "amount": object.bets.amount,
                },
            })
        })
    }
}


class MapperSummaryBets {

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
            SummaryBets: 'summaryBets'
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

let MapperSummaryBetsSingleton = new MapperSummaryBets();

export {
    MapperSummaryBetsSingleton
}