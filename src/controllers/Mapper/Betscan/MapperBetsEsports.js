
let self;


/**
 * @Outputs
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    betEsportsBetscan: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "_id": list._id,
                    "videogames": list.videogames,
                    "appId": !list.app ? null : list.app._id,
                    "appName": !list.app ? null : list.app.name,
                    "ticker": !list.currency.ticker ? null : list.currency.ticker,
                    "user": list.user,
                    "isWon": list.isWon,
                    "result": list.result,
                    "type": list.type,
                    "betAmount": list.betAmount,
                    "winAmount": list.winAmount,
                    "resolved": list.resolved,
                    "edge": list.edge,
                    "created_at": list.created_at,
                    "updatedAt": list.updatedAt,
                })
            }),
            "totalCount": object.totalCount,
        }
    },
}


class MapperGetBetEsportsBetscan {

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
            GetBetEsportsBetscan: 'betEsportsBetscan'
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

let MapperGetBetEsportsBetscanSingleton = new MapperGetBetEsportsBetscan();

export {
    MapperGetBetEsportsBetscanSingleton
}