import { app_object } from "../Structures/app";
import { bets_object } from "../Structures/bets";
import { security_object } from "../Structures/security";

let self;


/**
 * @Outputs
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    bet: (object) => {
        return {
            "_id": object._id,
            "result": !object.result ? [] : object.result.map(result_id => {
                return ({
                    "_id": result_id,
                })
            }),
            "isResolved": object.isResolved,
            "currency": object.currency ? {
                "_id": object.currency._id,
                "image": object.currency.image,
                "ticker": object.currency.ticker,
                "decimals": object.currency.decimals,
                "name": object.currency.name,
                "address": object.currency.address,
                "virtual": object.currency.virtual
            } : object.currency,
            "user": {
                "bets": object.user.bets,
                "wallet": object.user.wallet ? object.user.wallet.map(wallet_id => { return ({ _id: wallet_id }) }) : object.user.wallet,
                "isWithdrawing": object.user.isWithdrawing,
                "email_confirmed": object.user.email_confirmed,
                "_id": object.user._id,
                "username": object.user.username,
                "full_name": object.user.full_name,
                "affiliate": object.user.affiliate,
                "name": object.user.name,
                "register_timestamp": object.user.register_timestamp,
                "nationality": object.user.nationality,
                "age": object.user.age,
                "email": object.user.email,
                "app_id": object.user.app_id,
                "external_user": object.user.external_user,
                "external_id": object.user.external_id,
                "__v": object.user.__v,
                "affiliateLink": object.user.affiliateLink
            },
            ...app_object(object.app),
            "outcomeResultSpace": Array.isArray(object.outcomeResultSpace) ? object.outcomeResultSpace.map(outcomeResultSpace => {
                return ({
                    "key": outcomeResultSpace.key,
                    "start": outcomeResultSpace.start,
                    "end": outcomeResultSpace.end,
                    "probability": outcomeResultSpace.probability,
                    "index": outcomeResultSpace.index
                })
            }) : {
                    "key": object.outcomeResultSpace.key,
                    "start": object.outcomeResultSpace.start,
                    "end": object.outcomeResultSpace.end,
                    "probability": object.outcomeResultSpace.probability,
                    "index": object.outcomeResultSpace.index
                },
            "isWon": object.isWon,
            "game": object.game,
            "winAmount": object.winAmount,
            "betAmount": object.betAmount,
            "fee": object.fee,
            "timestamp": object.timestamp,
            "nonce": object.nonce,
            "clientSeed": object.clientSeed,
            "serverHashedSeed": object.serverHashedSeed,
            "serverSeed": object.serverSeed,
            "__v": object.__v,
        }
    },
}


class MapperGetBet {

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
            GetBetInfo: 'bet'
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

let MapperGetBetSingleton = new MapperGetBet();

export {
    MapperGetBetSingleton
}