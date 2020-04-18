import { result_space_object } from "./result_space"
import { result_object } from "./result"
import { bets_object } from "./bets"
import { wallets_object } from "./wallets_object"

const edit_game_object = (object) => {
    return {
        "_id": object._id,
        ...result_space_object(object),
        ...result_object(object),
        ...bets_object(object),
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
}


export {
    edit_game_object
}