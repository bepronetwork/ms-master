import { app_object, wallets_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    addGame: (object) => {
        return {
            ...wallets_object(object),
            "gameEcosystem": !object.gameEcosystem ? {} : {
                "_id": object.gameEcosystem._id,
                "name": object.gameEcosystem.name,
                "isValid": object.gameEcosystem.isValid,
                "metaName": object.gameEcosystem.metaName,
                "description": object.gameEcosystem._id,
                "image_url": object.gameEcosystem.image_url,
                "rules": object.gameEcosystem.rules,
                "resultSpace": !object.gameEcosystem.resultSpace ? [] : object.gameEcosystem.resultSpace.map(result_space => {
                    return ({
                        "_id": result_space._id,
                        "formType": result_space.formType,
                        "probability": result_space.probability,
                        "multiplier": result_space.multiplier,
                        "__v": result_space.__v,
                    })
                }),
                "__v": object.gameEcosystem.__v,
            }
        }
    },
}


class MapperAddGame {

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
            AddGame: 'addGame'
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

let MapperAddGameSingleton = new MapperAddGame();

export {
    MapperAddGameSingleton
}