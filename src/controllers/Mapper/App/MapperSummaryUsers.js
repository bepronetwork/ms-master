
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    summaryUsers: (object) => {
        return object.item.map(object => {
            return ({
                "_id": object._id,
                "name": object.name,
                "email": object.email,
                "bets": object.bets,
                "betAmount": object.betAmount,
                "winAmount": object.winAmount,
                "profit": object.profit,
                "playBalance": object.playBalance
            })
        })
    }
}


class MapperSummaryUsers {

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
            SummaryUsers: 'summaryUsers'
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

let MapperSummaryUsersSingleton = new MapperSummaryUsers();

export {
    MapperSummaryUsersSingleton
}