
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    createApiTokenUser: (object) => {
        return {
            "bets": object.bets ? [
                ...object.bets
            ] : object.bets,
            "deposits": object.deposits ? [
                ...object.deposits
            ] : object.deposits,
            "withdraws": object.withdraws ? [
                ...object.withdraws
            ] : object.withdraws,
            "wallet": object.wallet ? [
                ...object.wallet
            ] : object.wallet,
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
            "affiliateLink": object.affiliateLink,
            "bearerToken": object.bearerToken,
        }
    },
}


class MapperCreateApiTokenUser {

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
            CreateApiTokenUser: 'createApiTokenUser'
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

let MapperCreateApiTokenUserSingleton = new MapperCreateApiTokenUser();

export {
    MapperCreateApiTokenUserSingleton
}