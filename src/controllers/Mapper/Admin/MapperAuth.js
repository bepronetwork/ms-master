import { app_object, permission_object, security_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    auth: (object) => {
        return {
            "id": object._id,
            "username": object.username,
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


class MapperAuthAdmin {

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
            Auth: 'auth'
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

let MapperAuthAdminSingleton = new MapperAuthAdmin();

export {
    MapperAuthAdminSingleton
}