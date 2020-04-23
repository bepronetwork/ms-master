let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    appGetUsersBets: (object) => {
        return object.map(object => {
            return ({
                "app_id": object.app_id,
                "bets": !object.bets ? {} : {
                    "_id": object.bets._id,
                    "result": !object.bets.result ? [] : object.bets.result.map(result_id => {
                        return ({
                            "_id": result_id,
                        })
                    }),
                    "isResolved": object.bets.isResolved,
                    "currency": object.bets.currency,
                    "user": object.bets.user,
                    "app": object.bets.app,
                    "outcomeResultSpace": !object.bets.outcomeResultSpace ? {} : {
                        "key": object.bets.outcomeResultSpace.key,
                        "start": object.bets.outcomeResultSpace.start,
                        "end": object.bets.outcomeResultSpace.end,
                        "probability": object.bets.outcomeResultSpace.probability,
                        "index": object.bets.outcomeResultSpace.index,
                    },
                    "isWon": object.bets.isWon,
                    "game": object.bets.game,
                    "winAmount": object.bets.winAmount,
                    "betAmount": object.bets.betAmount,
                    "fee": object.bets.fee,
                    "timestamp": object.bets.timestamp,
                    "nonce": object.bets.nonce,
                    "clientSeed": object.bets.clientSeed,
                    "serverHashedSeed": object.bets.serverHashedSeed,
                    "serverSeed": object.bets.serverSeed,
                    "__v": object.bets.__v,
                },
                "game": !object.game ? {} : {
                    "_id": object.game._id,
                    "result": !object.game.result ? [] : object.game.result.map(result_id => {
                        return ({
                            "_id": result_id,
                        })
                    }),
                    "resultSpace": !object.game.resultSpace ? [] : object.game.resultSpace.map(result_space_id => {
                        return ({
                            "_id": result_space_id,
                        })
                    }),
                    "bets": !object.game.bets ? [] : object.game.bets.map(bet_id => {
                        return ({
                            "_id": bet_id,
                        })
                    }),
                    "isClosed": object.game.isClosed,
                    "maxBet": object.game.maxBet,
                    "background_url": object.game.background_url,
                    "name": object.game.name,
                    "edge": object.game.edge,
                    "app": object.game.app,
                    "betSystem": object.game.betSystem,
                    "timestamp": object.game.timestamp,
                    "image_url": object.game.image_url,
                    "metaName": object.game.metaName,
                    "rules": object.game.rules,
                    "description": object.game.description,
                    "wallets": !object.game.wallets ? [] : object.game.wallets.map(wallet => {
                        return ({
                            "_id": wallet._id,
                            "wallet": wallet.wallet,
                            "tableLimit": wallet.tableLimit,
                        })
                    }),
                    "__v": object.game.__v,
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


class MapperAppGetUsersBets {

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
            AppGetUsersBets: 'appGetUsersBets'
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

let MapperAppGetUsersBetsSingleton = new MapperAppGetUsersBets();

export {
    MapperAppGetUsersBetsSingleton
}