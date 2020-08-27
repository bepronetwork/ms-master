import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editSubSections: (object) => {
        return {
            "subSections": !object.subSections ? [] : object.subSections.map(subSection => {
                return ({
                    "title": subSection.title,
                    "text": subSection.text,
                    "image_url": subSection.image_url,
                    "background_url": subSection.background_url,
                    "background_color": subSection.background_color,
                    "position": subSection.position,
                    "location": subSection.location
                })
            })
        }
    },
}


class MapperEditSubSections {

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
            EditSubSections: 'editSubSections'
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

let MapperEditSubSectionsSingleton = new MapperEditSubSections();

export {
    MapperEditSubSectionsSingleton
}