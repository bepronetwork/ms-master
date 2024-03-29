import { result_space_object, wallets_object, bets_object, result_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getGames: (object) => {
        return object.map(object => {
            return ({
                "_id": object._id,
                "isClosed": object.isClosed,
                "maxBet": object.maxBet,
                "background_url": object.background_url,
                "name": object.name,
                "edge": object.edge,
                "app": object.app,
                "betSystem": object.betSystem,
                "timestamp": object.timestamp,
                "image_url": object.image_url,
                "metaName": object.metaName,
                "rules": object.rules,
                "description": object.description,
                ...wallets_object(object),
            })
        })
    },
}


class MapperGetGames {

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
            GetGames: 'getGames'
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

let MapperGetGamesSingleton = new MapperGetGames();

export {
    MapperGetGamesSingleton
}