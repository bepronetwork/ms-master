import { app_object } from "../Structures/app";

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
            "currency": object.currency ? object.currency.map(currency => {
                return ({
                    "_id": currency._id,
                    "image": currency.image,
                    "ticker": currency.ticker,
                    "decimals": currency.decimals,
                    "name": currency.name,
                    "address": currency.address,
                    "virtual": currency.virtual
                })
            }) : object.currency,
            "user": {
                ...bets_object(object),
                "deposits": object.deposits ? object.deposits.map(deposit_id => { return ({_id: deposit_id }) } ) : object.deposits,
                "withdraws": object.withdraws ? object.withdraws.map(withdraw_id => { return ({_id: withdraw_id }) } ) : object.withdraws,
                "wallet": object.wallet ? object.wallet.map(wallet_id => { return ({_id: wallet_id }) } ) : object.wallet,
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
                ...security_object(object),
                "email": object.email,
                "app_id": object.app_id,
                "external_user": object.external_user,
                "external_id": object.external_id,
                "__v": object.__v,
                "affiliateLink": object.affiliateLink
            },
            ...app_object(object.app),
            "outcomeResultSpace": !object.outcomeResultSpace ? {} : {
                "key": object.outcomeResultSpace.key,
                "start": object.outcomeResultSpace.start,
                "end": object.outcomeResultSpace.end,
                "probability": object.outcomeResultSpace.probability,
                "index": object.outcomeResultSpace.index,
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