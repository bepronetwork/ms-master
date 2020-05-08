
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    summaryRevenue: (object) => {
        return object.item.map(object => {
            return ({
                "date": !object.date ? {} : {
                    "hour": object.date.hour,
                    "day": object.date.day,
                    "year": object.date.year,
                },
                "financials": !object.financials ? {} : {
                    "loss": object.financials.loss,
                    "bets": object.financials.bets,
                    "revenue": object.financials.revenue,
                    "totalProfit": object.financials.totalProfit,
                    "feeProfit": object.financials.feeProfit,
                    "gambleProfit": object.financials.gambleProfit,
                },
            })
        })
    }
}


class MapperSummaryRevenue {

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
            SummaryRevenue: 'summaryRevenue'
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

let MapperSummaryRevenueSingleton = new MapperSummaryRevenue();

export {
    MapperSummaryRevenueSingleton
}