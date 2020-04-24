let self;

/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getLogs: (object) => {
        return {
            "list": object.list.map((list) => {
                return {
                    "_id"           : list._id,
                    "ip"            : list.ip,
                    "process"       : list.process,
                    "countryCode"   : list.countryCode,
                    "route"         : list.route,
                    "creatorId"     : list.creatorId,
                    "creatorType"   : list.creatorType,
                    "createdAt"     : list.createdAt,
                    "updatedAt"     : list.updatedAt
                }
            }),
            "size": object.size
        }
    }
}


class MapperGetLogs {

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
            GetLogs: 'getLogs'
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

let MapperGetLogsSingleton = new MapperGetLogs();

export {
    MapperGetLogsSingleton
}