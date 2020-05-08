import { permission_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editAdminType: (object) => {
        return {
            "admin": object.admin,
            ...permission_object(object),
        }
    },
}


class MapperEditAdminType {

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
            EditAdminType: 'editAdminType'
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

let MapperEditAdminTypeSingleton = new MapperEditAdminType();

export {
    MapperEditAdminTypeSingleton
}