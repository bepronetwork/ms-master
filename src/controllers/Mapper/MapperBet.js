
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
                        "_id"  : object.result._id,
                        "place": object.result.place,
                        "value": object.result.value,
                        "__v": object.result.__v
                    }
                ],
                "isResolved": object.isResolved,
                "_id": object._id,
                "user": object.user,
                "app": object.app,
                "outcomeResultSpace": {
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
                "__v": object.__v
            },
            "user_in_app": object.value,
            "isUserWithdrawingAPI": object.value,
            "isAppWithdrawingAPI": object.value,
            "user_delta": object.value,
            "app_delta": object.value,
            "isUserAffiliated": object.value,
            "affiliateReturns": [
                object.value
            ],
            "totalAffiliateReturn": object.value,
            "tableLimit": object.value,
            "user": object.value,
            "app": object.value,
            "outcomeResultSpace": {
                "key":object.value,
                "start": object.value,
                "end": object.value,
                "probability": object.value,
                "index": object.value
            },
            "isWon": object.value,
            "game": object.value,
            "betSystem": object.value,
            "appWallet": object.value,
            "wallet": object.value,
            "possibleWinAmount": object.value,
            "winAmount": object.value,
            "betAmount": object.value,
            "fee": object.value,
            "result": [
                {
                    "_id": object.value,
                    "place": object.value,
                    "value": object.value,
                    "__v": object.value
                }
            ],
            "timestamp": object.value,
            "nonce": object.value,
            "clientSeed": object.value,
            "serverHashedSeed": {
                "$super": {
                    "$super": {}
                },
                "words": [
                    object.value
                ],
                "sigBytes": object.value
            },
            "serverSeed": object.value,
            "isResolved": object.value
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