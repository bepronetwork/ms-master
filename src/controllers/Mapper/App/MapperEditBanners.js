import { app_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editBanners: (object) => {
        return {
            "banners": !object.banners ? [] : object.banners.map(banner => {
                return ({
                    "image_url": banner.image_url,
                    "link_url": banner.link_url,
                    "button_text": banner.button_text,
                    "title": banner.title,
                    "subtitle": banner.subtitle,
                })
            }),
            "app": app_object(object),
            "autoDisplay": object.autoDisplay,
            "admin": object.admin,
        }
    },
}


class MapperEditBanners {

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
            EditBanners: 'editBanners'
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

let MapperEditBannersSingleton = new MapperEditBanners();

export {
    MapperEditBannersSingleton
}