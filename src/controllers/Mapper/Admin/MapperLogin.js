import { app_object, permission_object, security_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    login: (object) => {
        return {
            "has2FASet": object.has2FASet,
            "bearerToken": object.bearerToken,
            "username": object.username,
            "password": object.password,
            "security_id": object.security._id,
            "verifiedAccount": object.verifiedAccount,
            "id": object._id,
            "name": object.name,
            ...security_object(object),
            "email": object.email,
            ...app_object(object),
            "registered": object.registered,
            ...permission_object(object),
            "__v": object.__v
        }
    },
}


class MapperLoginAdmin {

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
            Login: 'login'
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

let MapperLoginAdminSingleton = new MapperLoginAdmin();

export {
    MapperLoginAdminSingleton
}