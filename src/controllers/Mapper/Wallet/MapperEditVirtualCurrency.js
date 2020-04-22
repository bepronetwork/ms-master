

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    editVirtualCurrency: (object) => {
        return {
            "currency": object.currency,
            "price": object.price,
            "app": object.app,
            "admin": object.admin,
            "min_withdraw": object.min_withdraw,
            "wallet": object.wallet,
            "image": object.image
        }
    },
}


class MapperEditVirtualCurrency {

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
            EditVirtualCurrency: 'editVirtualCurrency'
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

let MapperEditVirtualCurrencySingleton = new MapperEditVirtualCurrency();

export {
    MapperEditVirtualCurrencySingleton
}