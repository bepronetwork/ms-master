
let self;


/**
 * @Outputs
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    depositBetscan: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "externalId": list._id,
                    "user": list.user,
                    "appId": !list.app ? null : list.app._id,
                    "appName": !list.app ? null : list.app.name,
                    "timestamp": list.last_update_timestamp,
                    "ticker": !list.currency.ticker ? null : list.currency.ticker,
                    "amount": list.amount,
                    "fee": list.fee,
                    "address": list.address,
                    "link_url": list.link_url
                })
            }),
            "totalCount": object.totalCount,
        }
    },
}


class MapperGetDepositBetscan {

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
            GetDepositBetscan: 'depositBetscan'
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

let MapperGetDepositBetscanSingleton = new MapperGetDepositBetscan();

export {
    MapperGetDepositBetscanSingleton
}