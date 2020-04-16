import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editFooter: (object) => {
        return {
            "supportLinks": !object.supportLinks ? [] : object.supportLinks.map(support_link => {
                return ({
                    "name": support_link.name,
                    "href": support_link.href
                })
            }),
            "communityLinks": !object.communityLinks ? [] : object.communityLinks.map(community_link => {
                return ({
                    "name": community_link.name,
                    "href": community_link.href
                })
            }),
            "app": app_object(object),
            "admin": object.admin,
        }
    },
}


class MapperEditFooter {

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
            EditFooter: 'editFooter'
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

let MapperEditFooterSingleton = new MapperEditFooter();

export {
    MapperEditFooterSingleton
}