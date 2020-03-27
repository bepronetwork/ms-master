
let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    addGame: (object) => {
        return {
            "wallets": !object.wallets ? [] : object.wallets.map(wallet => {
                return ({
                    "wallet": wallet.wallet,
                    "tableLimit": wallet.tableLimit,
                })
            }),
            "gameEcosystem": !object.gameEcosystem ? {} : {
                "_id": object.gameEcosystem._id,
                "name": object.gameEcosystem.name,
                "isValid": object.gameEcosystem.isValid,
                "metaName": object.gameEcosystem.metaName,
                "description": object.gameEcosystem._id,
                "image_url": object.gameEcosystem.image_url,
                "rules": object.gameEcosystem.rules,
                "resultSpace": !object.gameEcosystem.resultSpace ? [] : object.gameEcosystem.resultSpace.map(result_space => {
                    return ({
                        "_id": result_space._id,
                        "formType": result_space.formType,
                        "probability": result_space.probability,
                        "multiplier": !result_space.multiplier ? '' : result_space.multiplier,
                        "__v": result_space.__v,
                    })
                }),
                "__v": object.gameEcosystem.__v,
            },
            "app": !object.app ? {} : {
                "_id": object.app._id,
                "isValid": object.app.isValid,
                "games": object.app.games ? object.app.games.map(game_id => game_id) : object.app.games,
                "listAdmins": object.app.listAdmins ? object.app.listAdmins.map(list_admin_id => list_admin_id) : object.app.listAdmins,
                "services": object.app.services ? object.app.services.map(service => service) : object.app.services,
                "currencies": object.app.currencies ? object.app.currencies.map(currency_id => currency_id) : object.app.currencies,
                "users": object.app.users ? object.app.users.map(user_id => user_id) : object.app.users,
                "external_users": object.app.external_users ? object.app.external_users.map(external_user_id => external_user_id) : object.app.external_users,
                "wallet": object.app.wallet ? object.app.wallet.map(wallet_id => wallet_id) : object.app.wallet,
                "deposits": object.app.deposits ? object.app.deposits.map(deposit_id => deposit_id) : object.app.deposits,
                "withdraws": object.app.withdraws ? object.app.withdraws.map(withdraw_id => withdraw_id) : object.app.withdraws,
                "typography": object.app.typography ? object.app.typography.map(typography_id => typography_id) : object.app.typography,
                "countriesAvailable": object.app.countriesAvailable ? object.app.countriesAvailable.map(country_available => country_available) : object.app.countriesAvailable,
                "licensesId": object.app.licensesId ? object.app.licensesId.map(license_id => license_id) : object.app.licensesId,
                "isWithdrawing": object.app.isWithdrawing,
                "name": object.app.name,
                "affiliateSetup": object.app.affiliateSetup,
                "customization": object.app.customization,
                "integrations": object.app.integrations,
                "description": object.app.description,
                "hosting_id": object.app.hosting_id,
                "web_url": object.app.web_url,
                "__v": object.app.__v,
            },
        }
    },
}


class MapperAddGame {

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
            AddGame: 'addGame'
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

let MapperAddGameSingleton = new MapperAddGame();

export {
    MapperAddGameSingleton
}