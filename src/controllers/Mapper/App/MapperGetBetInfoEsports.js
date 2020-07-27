import { bets_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    appGetBetInfoEsports: (object) => {
        return {
            "_id": object._id,
            "betAmount": object.betAmount,
            "currency": object.currency,
            "user": !object.user ? {} : {
                "_id": object.user._id,
                "username": object.user.username,
            },
            "app": object.app,
            "esports_edge": object.esports_edge,
            "isWon": object.isWon,
            "result": object.result,
            "type": object.type,
            "winAmount": object.winAmount,
            "created_at": object.created_at,
            "__v": object.__v,
        }
    },
}


class MapperAppGetBetInfoEsports {

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
            AppGetBetInfoEsports: 'appGetBetInfoEsports'
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

let MapperAppGetBetInfoEsportsSingleton = new MapperAppGetBetInfoEsports();

export {
    MapperAppGetBetInfoEsportsSingleton
}