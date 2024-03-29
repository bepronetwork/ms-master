
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getLastBets: (object) => {
        return  object[0] == undefined ? {} : {
            "_id": object[0]._id,
            "app": object[0].app,
            "timestamp": object[0].timestamp,
            "lastBets": !object[0].lastBets ? [] : object[0].lastBets.map(lastBets => {
                return ({
                    "_id": lastBets._id,
                    "bet": {
                        "_id": lastBets.bet._id,
                        "betAmount": lastBets.bet.betAmount,
                        "winAmount": lastBets.bet.winAmount,
                        "isWon": lastBets.bet.isWon,
                        "timestamp": lastBets.bet.timestamp,
                    },
                    "currency": {
                        "_id": lastBets.currency._id,
                        "image": lastBets.currency.image,
                        "ticker": lastBets.currency.ticker,
                        "name": lastBets.currency.name,
                    },
                    "game": {
                        "_id": lastBets.game._id,
                        "name": lastBets.game.name,
                        "image_url": lastBets.game.image_url,
                        "metaName": lastBets.game.metaName,
                    },
                    "user": {
                        "_id": lastBets.user._id,
                        "username": lastBets.user.username,
                    }
                })
            }),
            "__v": object[0].__v,
        }
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