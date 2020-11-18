import ConverterSingleton from "../../../logic/utils/converter";
import { currencies_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */

const fixRestrictCountry = ConverterSingleton.convertCountry(require("../../../config/restrictedCountries.config.json"));

let outputs = {
    register: (object) => {
        return {
            "id": object._id,
            "isValid": object.isValid,
            "games": !object.games ? [] : object.games.map(game_id => game_id),
            "listAdmins": !object.listAdmins ? [] : object.listAdmins.map(list_admin_id => list_admin_id),
            "services": !object.services ? [] : object.services.map(service_id => service_id),
            "virtual":  object.virtual,
            ...currencies_object(object),
            "users": !object.users ? [] : object.users.map(user_id => user_id),
            "external_users": !object.external_users ? 0 : object.external_users.length,
            "wallet": !object.wallet ? [] : object.wallet.map(wallet_id => wallet_id),
            "deposits": !object.deposits ? [] : object.deposits.map(deposit_id => deposit_id),
            "withdraws": !object.withdraws ? [] : object.withdraws.map(withdraw_id => withdraw_id),
            "typography": object.typography ? { name: object.typography.name, url: object.typography.url} : object.typography,
            "countriesAvailable": !object.countriesAvailable ? [] : object.countriesAvailable.map(country_available_id => country_available_id),
            "restrictedCountries": [...(!object.restrictedCountries ? [] : object.restrictedCountries), ...fixRestrictCountry],
            "licensesId": !object.licensesId ? [] : object.licensesId.map(license_id => license_id),
            "isWithdrawing": object.isWithdrawing,
            "name": object.name,
            "affiliateSetup": object.affiliateSetup,
            "customization": object.customization,
            "integrations": object.integrations,
            "description": object.description,
            "__v": object.__v,
        }
    }
}


class MapperRegister {

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
            Register: 'register'
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

let MapperRegisterSingleton = new MapperRegister();

export {
    MapperRegisterSingleton
}