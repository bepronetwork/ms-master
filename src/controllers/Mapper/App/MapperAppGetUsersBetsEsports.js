import { bets_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    appGetBetsEsports: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "_id": list._id,
                    "betAmount": list.betAmount,
                    "currency": list.currency,
                    "user": !list.user ? {} : {
                        "_id": list.user._id,
                        "username": list.user.username,
                    },
                    "app": list.app,
                    "isWon": list.isWon,
                    "market": list.market,
                    "winAmount": list.winAmount,
                    "betType": list.betType,
                    "statistic": list.statistic,
                    "finished": list.finished,
                    "created_at": list.created_at,
                    "result": list.result,
                    "type": list.type,
                    "tag": list.tag,
                    "__v": list.__v,
                })
            }),
            "totalCount": object.totalCount
        }
    }
}


class MapperAppGetBetsEsports {

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
            AppGetBetsEsports: 'appGetBetsEsports'
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

let MapperAppGetBetsEsportsSingleton = new MapperAppGetBetsEsports();

export {
    MapperAppGetBetsEsportsSingleton
}