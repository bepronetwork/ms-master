
let self;


/**
 * @Outputs
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    bet: (object) => {
        return {
            "_id": object._id,
            "result": !object.result ? [] : object.result.map(result_id => {
                return ({
                    "_id": result_id,
                })
            }),
            "isResolved": object.isResolved,
            "currency": object.currency,
            "user": object.user,
            "app": object.app,
            "outcomeResultSpace": !object.outcomeResultSpace ? {} : {
                "key": object.outcomeResultSpace.key,
                "start": object.outcomeResultSpace.start,
                "end": object.outcomeResultSpace.end,
                "probability": object.outcomeResultSpace.probability,
                "index": object.outcomeResultSpace.index,
            },
            "isWon": object.isWon,
            "game": object.game,
            "winAmount": object.winAmount,
            "betAmount": object.betAmount,
            "fee": object.fee,
            "timestamp": object.timestamp,
            "nonce": object.nonce,
            "clientSeed": object.clientSeed,
            "serverHashedSeed": object.serverHashedSeed,
            "serverSeed": object.serverSeed,
            "__v": object.__v,
        }
    },
}


class MapperGetBet {

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
            GetBetInfo: 'bet'
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

let MapperGetBetSingleton = new MapperGetBet();

export {
    MapperGetBetSingleton
}