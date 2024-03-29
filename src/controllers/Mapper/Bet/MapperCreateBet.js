
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    bet: (object) => {
        return {
            "bet": {
                "result": !object.bet.result ? [] : object.bet.result.map(result => {
                    return ({
                        _id: result._id,
                        place: result.place,
                        value: result.value,
                        __v: result.__v
                    })
                }),
                "isResolved": object.bet.isResolved,
                "_id": object.bet._id,
                "currency": object.bet.currency,
                "user": object.bet.user,
                "app": object.bet.app,
                "outcomeResultSpace": Array.isArray(object.bet.outcomeResultSpace) ? object.bet.outcomeResultSpace.map(outcomeResultSpace => {
                    return ({
                        "key": outcomeResultSpace.key,
                        "start": outcomeResultSpace.start,
                        "end": outcomeResultSpace.end,
                        "probability": outcomeResultSpace.probability,
                        "index": outcomeResultSpace.index
                    })
                }) : {
                    "key": object.bet.outcomeResultSpace.key,
                    "start": object.bet.outcomeResultSpace.start,
                    "end": object.bet.outcomeResultSpace.end,
                    "probability": object.bet.outcomeResultSpace.probability,
                    "index": object.bet.outcomeResultSpace.index
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
            "totalBetAmount": object.totalBetAmount,
            "jackpotAmount": object.bet.jackpotAmount,
            "user_in_app": object.user_in_app,
            "isUserWithdrawingAPI": object.isUserWithdrawingAPI,
            "isAppWithdrawingAPI": object.isAppWithdrawingAPI,
            "user_delta": object.user_delta,
            "app_delta": object.app_delta,
            "isUserAffiliated": object.isUserAffiliated,
            "affiliateReturns": !object.affiliateReturns ? [] : object.affiliateReturns.map(affiliate_return_id => {
                return ({
                    "_id": affiliate_return_id
                })
            }),
            "totalAffiliateReturn": object.totalAffiliateReturn,
            "currency": object.currency,
            "tableLimit": object.tableLimit,
            "wallet": !object.wallet ? {} : {
                "_id": object.wallet._id,
                "playBalance": object.wallet.playBalance,
                "max_deposit": object.wallet.max_deposit,
                "max_withdraw": object.wallet.max_withdraw,
                "min_withdraw": object.wallet.min_withdraw,
                "affiliate_min_withdraw": object.wallet.affiliate_min_withdraw,
                "depositAddresses": object.wallet.depositAddresses ? object.wallet.depositAddresses.map(deposit_address => {
                    return ({
                        "_id": deposit_address._id,
                        "currency": deposit_address.currency,
                        "user": deposit_address.user,
                        "bitgo_id": deposit_address.bitgo_id,
                    })
                }) : object.wallet.depositAddresses,
                "link_url": object.wallet.link_url,
                "currency": {
                    "_id": object.wallet.currency._id,
                    "image": object.wallet.currency.image,
                    "ticker": object.wallet.currency.ticker,
                    "decimals": object.wallet.currency.decimals,
                    "name": object.wallet.currency.name,
                    "address": object.wallet.currency.address
                }
            },
            "user": object.user,
            "app": object.app,
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
            "betSystem": object.betSystem,
            "playBalance": object.playBalance,
            "possibleWinAmount": object.possibleWinAmount,
            "possibleWinBalance": object.possibleWinBalance,
            "winAmount": object.winAmount,
            "betAmount": object.betAmount,
            "fee": object.fee,
            "result": object.result.map(result => {
                return ({
                    _id: result._id,
                    place: result.place,
                    value: result.value
                })
            }),
            "timestamp": object.timestamp,
            "nonce": object.nonce,
            "clientSeed": object.clientSeed,
            "serverHashedSeed": {
                "$super": {
                    "$super": {}
                },
                "words": !object.serverHashedSeed.words ? [] : object.serverHashedSeed.words.map(word => word),
                "sigBytes": object.sigBytes
            },
            "serverSeed": object.serverSeed,
            "isResolved": object.isResolved
        }
    },
}


class MapperBet {

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
            Bet: 'bet'
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

let MapperBetSingleton = new MapperBet();

export {
    MapperBetSingleton
}