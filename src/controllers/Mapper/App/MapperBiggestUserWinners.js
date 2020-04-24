
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getBiggetsUserWinners: (object) => {
        return object.map(object => {
            return ({
                "_id": object._id,
                "winAmount": object.winAmount
            })
        })
    }
}


class MapperGetBiggetsUserWinners {

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
            GetBiggetsUserWinners: 'getBiggetsUserWinners'
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

let MapperGetBiggetsUserWinnersSingleton = new MapperGetBiggetsUserWinners();

export {
    MapperGetBiggetsUserWinnersSingleton
}