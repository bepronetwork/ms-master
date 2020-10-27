
let self;


/**
 * @Outputs
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    betCasinoBetscan: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "_id": list._id,
                    "result": list.result,
                    "isResolved": list.isResolved,
                    "ticker": list.currency.ticker,
                    "user": list.user,
                    "app": list.app,
                    "isWon": list.isWon,
                    "game": list.game,
                    "winAmount": list.winAmount,
                    "betAmount": list.betAmount,
                    "fee": list.fee,
                    "timestamp": list.timestamp,
                    "clientSeed": list.clientSeed,
                    "serverSeed": list.serverSeed,
                })
            }),
            "totalCount": object.totalCount,
        }
    },
}


class MapperGetBetCasinoBetscan {

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
            GetBetCasinoBetscan: 'betCasinoBetscan'
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

let MapperGetBetCasinoBetscanSingleton = new MapperGetBetCasinoBetscan();

export {
    MapperGetBetCasinoBetscanSingleton
}