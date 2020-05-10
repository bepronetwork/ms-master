import { wallet_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    getUsers: (object) => {
        return object.map(object => {
            return ({
                "_id": object._id,
                "bets": object.bets ? object.bets.map(bet => {return {"_id" : bet}}) : object.bets,
                "deposits": object.deposits ? object.deposits.map(deposit_id => {
                    return ({
                        "_id": deposit_id
                    })
                }) : object.deposits,
                "withdraws": object.withdraws ? object.withdraws.map(withdraw_id => {
                    return ({
                        "_id": withdraw_id
                    })
                }) : object.withdraws,
                ...wallet_object(object),
                "username": object.username,
                "full_name": object.full_name,
                "affiliate": !object.affiliate ? {} : {
                    "wallet": object.affiliate.wallet ? object.affiliate.wallet.map(wallet => {
                        return ({
                            "_id": wallet._id,
                            "playBalance": wallet.playBalance,
                            "max_deposit": wallet.max_deposit,
                            "max_withdraw": wallet.max_withdraw,
                            "min_withdraw": wallet.min_withdraw,
                            "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(deposit_address_id => deposit_address_id) : wallet.depositAddresses,
                            "link_url": wallet.link_url,
                            "currency": !wallet.currency ? {} : {
                                "_id": wallet.currency._id,
                                "image": wallet.currency.image,
                                "ticker": wallet.currency.ticker,
                                "decimals": wallet.currency.decimals,
                                "name": wallet.currency.name,
                                "address": wallet.currency.address,
                                "virtual": wallet.currency.virtual,
                            },
                            "price": wallet.price,
                            "bitgo_id": wallet.bitgo_id,
                            "bank_address": wallet.bank_address
                        })
                    }) : object.wallet,
                },
                "name": object.name,
                "register_timestamp": object.register_timestamp,
                "nationality": object.nationality,
                "age": object.age,
                "email": object.email
            })
        })
    },
}


class MapperGetUsers {

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
            GetUsers: 'getUsers'
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

let MapperGetUsersSingleton = new MapperGetUsers();

export {
    MapperGetUsersSingleton
}