import { result_space_object, wallets_object } from '../Structures';

var mongoose = require('mongoose'); 

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editGameEdge: (object) => {
        return {
            "_id": object._id,
            ...result_space_object(object),
            "result": object.result ? object.result.map(result_id => {
                return({
                    "_id": result_id
                })
            }) : object.result,
            "bets": object.bets ? object.bets.map(bet_id => {
                return({
                    "_id": bet_id
                })
            }) : object.bets,
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
            "__v": object.__v,
        }
    },
}


class MapperEditGameEdge {

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
            EditGameEdge: 'editGameEdge'
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

let MapperEditGameEdgeSingleton = new MapperEditGameEdge();

export {
    MapperEditGameEdgeSingleton
}