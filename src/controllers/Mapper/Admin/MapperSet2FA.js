import { permission_object, security_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    set2fa: (object) => {
        return {
            "newSecret": object.newSecret,
            "username": object.username,
            "isVerifiedToken2FA": object.isVerifiedToken2FA,
            "admin_id": object.admin_id,
            "security_id": object.security._id,
            "_id": object._id,
            "name": object.name,
            ...security_object(object),
            "email": object.email,
            "registered": object.registered,
            ...permission_object(object),
            "__v": object.__v
        }
    },
}


class MapperSet2FA {

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
            Set2fa: 'set2fa'
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

let MapperSet2FASingleton = new MapperSet2FA();

export {
    MapperSet2FASingleton
}