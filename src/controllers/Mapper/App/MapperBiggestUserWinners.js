
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getBiggetsUserWinners: (object) => {
        return object[0] == undefined ? {} : {
            "_id": object[0]._id,
            "app": object[0].app,
            "timestamp": object[0].timestamp,
            "biggestUserWinner": !object[0].biggestUserWinner ? [] : object[0].biggestUserWinner.map(biggestUserWinner => {
                return ({
                    "_id": biggestUserWinner._id,
                    "winAmount": biggestUserWinner.winAmount,
                    "currency": {
                        "_id": biggestUserWinner.currency._id,
                        "image": biggestUserWinner.currency.image,
                        "ticker": biggestUserWinner.currency.ticker,
                        "name": biggestUserWinner.currency.name,
                    },
                    "game": {
                        "_id": biggestUserWinner.game._id,
                        "name": biggestUserWinner.game.name,
                        "image_url": biggestUserWinner.game.image_url,
                        "metaName": biggestUserWinner.game.metaName,
                    },
                    "user": {
                        "_id": biggestUserWinner.user._id,
                        "username": biggestUserWinner.user.username,
                    }
                })
            }),
            "__v": object[0].__v,
        }
    }
}


class MapperGetBiggetsUserWinners {

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
            GetBiggetsUserWinners: 'getBiggetsUserWinners'
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

let MapperGetBiggetsUserWinnersSingleton = new MapperGetBiggetsUserWinners();

export {
    MapperGetBiggetsUserWinnersSingleton
}