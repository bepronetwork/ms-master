
let self;


/**
 * @Outputs
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    userBetscan: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "_id": list._id,
                    "wallet": list.wallet,
                })
            }),
            "totalCount": object.totalCount,
        }
    },
}


class MapperGetUserBetscan {

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
            GetUserBetscan: 'userBetscan'
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

let MapperGetUserBetscanSingleton = new MapperGetUserBetscan();

export {
    MapperGetUserBetscanSingleton
}