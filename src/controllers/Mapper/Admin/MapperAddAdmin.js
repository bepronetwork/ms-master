import { app_object, permission_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    addAdmin: (object) => {
        return {
            "_id": object._id,
            "username": object.username,
            "name": object.name,
            "security": {
                "_id": object.security._id,
                "2fa_set": object.security['2fa_set'],
                "email_verified": object.security.email_verified,
                "bearerToken": object.security['bearerToken'],
            },
            "email": object.email,
            ...app_object(object),
            "registered": object.registered,
            ...permission_object(object),
            "__v": object.__v
        }
    },
}


class MapperAddAdmin {

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
            AddAdmin: 'addAdmin'
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

let MapperAddAdminSingleton = new MapperAddAdmin();

export {
    MapperAddAdminSingleton
}