
let self;


/**
 * @Outputs
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    withdrawBetscan: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "externalId": list._id,
                    "user": list.user,
                    "appId": !list.app ? null : list.app._id,
                    "appName": !list.app ? null : list.app.name,
                    "creation_timestamp": list.creation_timestamp,
                    "last_update_timestamp": list.last_update_timestamp,
                    "ticker": !list.currency.ticker ? null : list.currency.ticker,
                    "address": list.address,
                    "amount": list.amount,
                    "fee": list.fee,
                    "status": list.status,
                    "link_url": list.link_url,
                })
            }),
            "totalCount": object.totalCount,
        }
    },
}


class MapperGetWithdrawBetscan {

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
            GetWithdrawBetscan: 'withdrawBetscan'
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

let MapperGetWithdrawBetscanSingleton = new MapperGetWithdrawBetscan();

export {
    MapperGetWithdrawBetscanSingleton
}