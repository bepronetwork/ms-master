import { wallet_object, bets_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    userRegister: (object) => {
        return {
            ...bets_object(object),
            "deposits": object.deposits ? object.deposits.map(deposit_id => { return ({_id: deposit_id }) } ) : object.deposits,
            "withdraws": object.withdraws ? object.withdraws.map(withdraw_id => { return ({_id: withdraw_id }) } ) : object.withdraws,
            "isWithdrawing": object.isWithdrawing,
            "_id": object._id,
            "username": object.username,
            "full_name": object.full_name,
            "affiliate": {
                "affiliatedLinks": object.affiliate.affiliatedLinks ? object.affiliate.affiliatedLinks.map(affiliatedLink_id => affiliatedLink_id) : object.affiliate.affiliatedLinks,
                "isNew": object.affiliate.isNew,
                "_doc": {
                    "wallet": object.affiliate._doc.wallet.map(wallet => {
                        return ({
                            "playBalance": wallet.playBalance,
                            "max_deposit": wallet.max_deposit,
                            "max_withdraw": wallet.max_withdraw,
                            "min_withdraw": wallet.min_withdraw,
                            "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(depositAddress_id => { return ({_id: depositAddress_id }) } ) : wallet.depositAddresses,
                            "link_url": wallet.link_url,
                            "_id": wallet._id,
                            "currency": {
                                "_id": wallet.currency._id,
                                "image": wallet.currency.image,
                                "ticker": wallet.currency.ticker,
                                "decimals": wallet.currency.decimals,
                                "name": wallet.currency.name,
                                "address": wallet.currency.address
                            },
                        })
                    }),
                    "affiliatedLinks": object.affiliate._doc.affiliatedLinks ? object.affiliate._doc.affiliatedLinks.map(affiliatedLink_id => affiliatedLink_id) : object.affiliate._doc.affiliatedLinks,
                    "_id": object.affiliate._doc._id
                },
            },
            "name": object.name,
            ...wallet_object(object),
            "register_timestamp": object.register_timestamp,
            "nationality": object.nationality,
            "age": object.age,
            "email": object.email,
            "external_user": object.external_user,
            "external_id": object.external_id,
            "affiliateLink": {
                "parentAffiliatedLinks": object.affiliateLink.parentAffiliatedLinks ? object.affiliateLink.parentAffiliatedLinks.map(parentAffiliatedLink_id => parentAffiliatedLink_id) : object.affiliateLink.parentAffiliatedLinks,
                "_id": object.affiliateLink._id,
                "userAffiliated": object.affiliateLink.userAffiliated,
                "affiliateStructure": {
                    "isActive": object.affiliateLink.affiliateStructure.isActive,
                    "_id": object.affiliateLink.affiliateStructure._id,
                    "level": object.affiliateLink.affiliateStructure.level,
                    "percentageOnLoss": object.affiliateLink.affiliateStructure.percentageOnLoss
                },
                "affiliate": object.affiliateLink.affiliate
            }
        }
    },
}


class MapperRegisterUser {

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
            UserRegister: 'userRegister'
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

let MapperRegisterUserSingleton = new MapperRegisterUser();

export {
    MapperRegisterUserSingleton
}