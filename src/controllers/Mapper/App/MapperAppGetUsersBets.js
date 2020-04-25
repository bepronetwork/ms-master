import { bets_object } from "../Structures";
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    appGetBets: (object) => {
        return {
            "list": !object.list ? [] : object.list.map(list => {
                return ({
                    "_id": list._id,
                    "result": !list.result ? [] : list.result.map(result_id => {
                        return ({
                            "_id": result_id,
                        })
                    }),
                    "isResolved": list.isResolved,
                    "currency": list.currency,
                    "user": !list.user ? {} : {
                        ...bets_object(object),
                        "deposits": object.deposits ? object.deposits.map(deposit_id => { return ({ _id: deposit_id }) }) : object.deposits,
                        "withdraws": object.withdraws ? object.withdraws.map(withdraw_id => { return ({ _id: withdraw_id }) }) : object.withdraws,
                        "wallet": object.wallet ? object.wallet.map(wallet_id => { return ({ _id: wallet_id }) }) : object.wallet,
                        "isWithdrawing": object.isWithdrawing,
                        "email_confirmed": object.email_confirmed,
                        "_id": object._id,
                        "username": object.username,
                        "full_name": object.full_name,
                        "affiliate": object.affiliate,
                        "name": object.name,
                        "register_timestamp": object.register_timestamp,
                        "nationality": object.nationality,
                        "age": object.age,
                        "security": object.security,
                        "email": object.email,
                        "app_id": object.app_id,
                        "external_user": object.external_user,
                        "external_id": object.external_id,
                        "__v": object.__v,
                        "affiliateLink": object.affiliateLink
                    },
                    "app": list.app,
                    "outcomeResultSpace": !list.outcomeResultSpace ? {} : {
                        "key": list.outcomeResultSpace.key,
                        "start": list.outcomeResultSpace.start,
                        "end": list.outcomeResultSpace.end,
                        "probability": list.outcomeResultSpace.probability,
                        "index": list.outcomeResultSpace.index,
                    },
                    "isWon": list.isWon,
                    "game": list.game,
                    "winAmount": list.winAmount,
                    "betAmount": list.betAmount,
                    "fee": list.fee,
                    "timestamp": list.timestamp,
                    "nonce": list.nonce,
                    "clientSeed": list.clientSeed,
                    "serverHashedSeed": list.serverHashedSeed,
                    "serverSeed": list.serverSeed,
                    "__v": list.__v,
                })
            }),
            "totalCount": object.totalCount
        }
    }
}


class MapperAppGetBets {

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
            AppGetBets: 'appGetBets'
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

let MapperAppGetBetsSingleton = new MapperAppGetBets();

export {
    MapperAppGetBetsSingleton
}