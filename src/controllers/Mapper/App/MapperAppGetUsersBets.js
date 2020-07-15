import { bets_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    appGetBets: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "_id": list._id,
                    "result": !list.result ? [] : list.result.map(result_id => {
                        return ({
                            "_id": result_id,
                        })
                    }),
                    "isResolved": list.isResolved,
                    "currency": list.currency,
                    "user": !list.user ? {} : {
                        "_id": list.user._id,
                        "username": list.user.username,
                    },
                    "app": list.app,
                    "outcomeResultSpace": !list.outcomeResultSpace ? {} : {
                        "key": list.outcomeResultSpace.key,
                        "start": list.outcomeResultSpace.start,
                        "end": list.outcomeResultSpace.end,
                        "probability": list.outcomeResultSpace.probability,
                        "index": list.outcomeResultSpace.index,
                    },
                    "isJackpot": !list.isJackpot ? false : list.isJackpot,
                    "isWon": list.isWon,
                    "game": list.game,
                    "winAmount": list.winAmount,
                    "betAmount": list.betAmount,
                    "fee": list.fee,
                    "timestamp": list.timestamp,
                    "nonce": list.nonce,
                    "clientSeed": list.clientSeed,
                    "serverHashedSeed": list.serverHashedSeed,
                    "serverSeed": list.serverSeed,
                    "tag": list.tag,
                    "__v": list.__v,
                })
            }),
            "totalCount": object.totalCount
        }
    }
}


class MapperAppGetBets {

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
            AppGetBets: 'appGetBets'
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

let MapperAppGetBetsSingleton = new MapperAppGetBets();

export {
    MapperAppGetBetsSingleton
}