let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    userGetBets: (object) => {
        return object.map(object => {
            return ({
                "_id": object._id,
                "bet": !object.bet ? {} : {
                    "_id": object.bet._id,
                    "result": !object.bet.result ? [] : object.bet.result.map(result_id => {
                        return ({
                            "_id": result_id,
                        })
                    }),
                    "isResolved": object.bet.isResolved,
                    "currency": object.bet.currency,
                    "user": object.bet.user,
                    "app": object.bet.app,
                    "outcomeResultSpace": !object.bet.outcomeResultSpace ? {} : {
                        "key": object.bet.outcomeResultSpace.key,
                        "start": object.bet.outcomeResultSpace.start,
                        "end": object.bet.outcomeResultSpace.end,
                        "probability": object.bet.outcomeResultSpace.probability,
                        "index": object.bet.outcomeResultSpace.index,
                    },
                    "isWon": object.bet.isWon,
                    "game": object.bet.game,
                    "winAmount": object.bet.winAmount,
                    "betAmount": object.bet.betAmount,
                    "fee": object.bet.fee,
                    "timestamp": object.bet.timestamp,
                    "nonce": object.bet.nonce,
                    "clientSeed": object.bet.clientSeed,
                    "serverHashedSeed": object.bet.serverHashedSeed,
                    "serverSeed": object.bet.serverSeed,
                    "__v": object.bet.__v,
                },
                "games": !object.games ? {} : {
                    "_id": object.games._id,
                    "result": !object.games.result ? [] : object.games.result.map(result_id => {
                        return ({
                            "_id": result_id,
                        })
                    }),
                    "resultSpace": !object.games.resultSpace ? [] : object.games.resultSpace.map(result_space_id => {
                        return ({
                            "_id": result_space_id,
                        })
                    }),
                    "bets": !object.games.bets ? [] : object.games.bets.map(bet_id => {
                        return ({
                            "_id": bet_id,
                        })
                    }),
                    "isClosed": object.games.isClosed,
                    "maxBet": object.games.maxBet,
                    "background_url": object.games.background_url,
                    "name": object.games.name,
                    "edge": object.games.edge,
                    "app": object.games.app,
                    "betSystem": object.games.betSystem,
                    "timestamp": object.games.timestamp,
                    "image_url": object.games.image_url,
                    "metaName": object.games.metaName,
                    "rules": object.games.rules,
                    "description": object.games.description,
                    "wallets": !object.games.wallets ? [] : object.games.wallets.map(wallet => {
                        return ({
                            "_id": wallet._id,
                            "wallet": wallet.wallet,
                            "tableLimit": wallet.tableLimit,
                        })
                    }),
                    "__v": object.games.__v,
                },
                "currency": !object.currency ? {} : {
                    "_id": object.currency._id,
                    "image": object.currency.image,
                    "ticker": object.currency.ticker,
                    "decimals": object.currency.decimals,
                    "name": object.currency.name,
                    "address": object.currency.address
                },
                "bet_result_space": !object.bet_result_space ? [] : object.bet_result_space.map(bet_result_space => {
                    return ({
                        "_id": bet_result_space._id,
                        "place": bet_result_space.place,
                        "value": bet_result_space.value,
                        "__v": bet_result_space.__v
                    })
                }),
                "user": !object.user ? {} : {
                    "_id": object.user._id,
                    "bets": !object.user.bets ? [] : object.user.bets.map(bet_id => {
                        return ({
                            "_id": bet_id,
                        })
                    }),
                    "deposits": !object.user.deposits ? [] : object.user.deposits.map(deposit_id => {
                        return ({
                            "_id": deposit_id,
                        })
                    }),
                    "withdraws": !object.user.withdraws ? [] : object.user.withdraws.map(withdraw_id => {
                        return ({
                            "_id": withdraw_id,
                        })
                    }),
                    "wallet": !object.user.wallet ? [] : object.user.wallet.map(wallet_id => {
                        return ({
                            "_id": wallet_id,
                        })
                    }),
                    "isWithdrawing": object.user.isWithdrawing,
                    "username": object.user.username,
                    "affiliate": object.user.affiliate,
                    "name": object.user.name,
                    "register_timestamp": object.user.register_timestamp,
                    "security": object.user.security,
                    "email": object.user.email,
                    "app_id": object.user.app_id,
                    "external_user": object.user.external_user,
                    "email_confirmed": object.user.email_confirmed,
                    "affiliateLink": object.user.affiliateLink,
                    "__v": object.user.__v,
                },
            })
        })
    }
}


class MapperUserGetBets {

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
            UserGetBets: 'userGetBets'
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

let MapperUserGetBetsSingleton = new MapperUserGetBets();

export {
    MapperUserGetBetsSingleton
}