import { currencies_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getEcosystemData: (object) => {
        return {
            ...currencies_object(object),
            "blockchains": object.blockchains ? object.blockchains.map(blockchain =>{
                return({
                    "_id": blockchain._id,
                    "ticker": blockchain.ticker,
                    "name": blockchain.name,
                })
            }) : object.blockchains,
            "addresses": object.addresses ? object.addresses.map(address =>{
                return({
                    "_id": address._id,
                    "address": address.address
                })
            }) : object.addresses,
        }
    },
}


class MapperGetEcosystemData {

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
            GetEcosystemData: 'getEcosystemData'
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

let MapperGetEcosystemDataSingleton = new MapperGetEcosystemData();

export {
    MapperGetEcosystemDataSingleton
}