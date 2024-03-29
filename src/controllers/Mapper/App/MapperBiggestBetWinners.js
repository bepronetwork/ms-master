
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getBiggetsBetWinners: (object) => {
        return object[0] == undefined ? {} : {
            "_id": object[0]._id,
            "app": object[0].app,
            "timestamp": object[0].timestamp,
            "biggestBetWinner": !object[0].biggestBetWinner ? [] : object[0].biggestBetWinner.map(biggestBetWinner => {
                return ({
                    "_id": biggestBetWinner._id,
                    "bet": {
                        "_id": biggestBetWinner.bet._id,
                        "betAmount": biggestBetWinner.bet.betAmount,
                        "winAmount": biggestBetWinner.bet.winAmount,
                        "isWon": biggestBetWinner.bet.isWon,
                        "timestamp": biggestBetWinner.bet.timestamp,
                    },
                    "currency": {
                        "_id": biggestBetWinner.currency._id,
                        "image": biggestBetWinner.currency.image,
                        "ticker": biggestBetWinner.currency.ticker,
                        "name": biggestBetWinner.currency.name,
                    },
                    "game": {
                        "_id": biggestBetWinner.game._id,
                        "name": biggestBetWinner.game.name,
                        "image_url": biggestBetWinner.game.image_url,
                        "metaName": biggestBetWinner.game.metaName,
                    },
                    "user": {
                        "_id": biggestBetWinner.user._id,
                        "username": biggestBetWinner.user.username,
                    }
                })
            }),
            "__v": object[0].__v,
        }
    }
}


class MapperGetBiggetsBetWinners {

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
            GetBiggetsBetWinners: 'getBiggetsBetWinners'
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

let MapperGetBiggetsBetWinnersSingleton = new MapperGetBiggetsBetWinners();

export {
    MapperGetBiggetsBetWinnersSingleton
}