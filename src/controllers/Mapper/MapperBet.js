
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    bet : (object) => {
        return {
            "bet": {
                "result": [
                    {
                        "_id"  : object.bet.result._id,
                        "place": object.bet.result.place,
                        "value": object.bet.result.value,
                        "__v": object.bet.result.__v
                    }
                ],
                "isResolved": object.bet.isResolved,
                "_id": object.bet._id,
                "user": object.bet.user,
                "app": object.bet.app,
                "outcomeResultSpace": {
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
                "__v": object.bet.__v
            },
            "user_in_app": object.user_in_app,
            "isUserWithdrawingAPI": object.isUserWithdrawingAPI,
            "isAppWithdrawingAPI": object.isAppWithdrawingAPI,
            "user_delta": object.user_delta,
            "app_delta": object.app_delta,
            "isUserAffiliated": object.isUserAffiliated,
            "affiliateReturns": [
                object.affiliateReturns
            ],
            "totalAffiliateReturn": object.totalAffiliateReturn,
            "tableLimit": object.tableLimit,
            "user": object.user,
            "app": object.app,
            "outcomeResultSpace": {
                "key":object.outcomeResultSpace.key,
                "start": object.outcomeResultSpace.start,
                "end": object.outcomeResultSpace.end,
                "probability": object.outcomeResultSpace.probability,
                "index": object.outcomeResultSpace.index
            },
            "isWon": object.isWon,
            "game": object.game,
            "betSystem": object.betSystem,
            "appWallet": object.appWallet,
            "wallet": object.wallet,
            "possibleWinAmount": object.possibleWinAmount,
            "winAmount": object.winAmount,
            "betAmount": object.betAmount,
            "fee": object.fee,
            "result": [
                {
                    "_id": object.result._id,
                    "place": object.result.place,
                    "value": object.result.value,
                    "__v": object.result.__v
                }
            ],
            "timestamp": object.timestamp,
            "nonce": object.nonce,
            "clientSeed": object.clientSeed,
            "serverHashedSeed": {
                "$super": {
                    "$super": {}
                },
                "words": [
                    object.words
                ],
                "sigBytes": object.sigBytes
            },
            "serverSeed": object.serverSeed,
            "isResolved": object.isResolved
        }
    },
}


class MapperBet{

    constructor(){
        self = {
            outputs : outputs
        }

        /**
         * @object KEYS for Output Mapping
         * @key Input of Output Function <-> Output for Extern of the API
         * @value Output of Function in Outputs
         */

        this.KEYS = {
            Bet : 'bet'
        }
    }

    output(key, value){
        try{
            return self.outputs[this.KEYS[key]](value);
        }catch(err){
            throw err;
        }
    }
}

let MapperBetSingleton = new MapperBet();

export{
    MapperBetSingleton
}