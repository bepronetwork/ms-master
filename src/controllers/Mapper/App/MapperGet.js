import { get_object, games_object, currencies_object, wallet_object } from "../Structures";

let self;


/**
 * @Outputs 
 * @method Private Outputs Functions
 * @default 1Level Tier Object
 */



let outputs = {
    get: (object) => {
        return {
            "id": object._id,
            "isValid": object.isValid,
            "storeAddOn": object.storeAddOn,
            "virtual": object.virtual,
            "licenseID": object.licenseID,
            "games": object.games ? object.games.map(game => {
                return ({
                    "_id": game._id,
                    "resultSpace": !game.resultSpace ? [] : game.resultSpace.map(result_space => {
                        return ({
                            "_id": result_space._id,
                            "formType": result_space.formType,
                            "probability": result_space.probability,
                            "multiplier": result_space.multiplier,
                        })
                    }),
                    "result": game.result ? game.result.map(result_id => {
                        return ({
                            "_id": result_id
                        })
                    }) : game.result,
                    "isClosed": game.isClosed,
                    "maxBet": game.maxBet,
                    "background_url": game.background_url,
                    "name": game.name,
                    "edge": game.edge,
                    "app": game.app,
                    "betSystem": game.betSystem,
                    "timestamp": game.isClosed,
                    "image_url": game.image_url,
                    "metaName": game.metaName,
                    "rules": game.rules,
                    "description": game.description,
                    "wallets": game.wallets ? game.wallets.map(wallet => {
                        return ({
                            "_id": wallet._id,
                            "tableLimit": wallet.tableLimit,
                        })
                    }) : game.wallets,
                })
            }) : object.games,
            "services": object.services ? object.services.map(service => service) : object.services,
            "currencies": object.currencies ? object.currencies.map(currency => {
                return ({
                    "_id": currency._id,
                    "image": currency.image,
                    "ticker": currency.ticker,
                    "decimals": currency.decimals,
                    "name": currency.name,
                    "address": currency.address,
                    "virtual": currency.virtual
                })
            }) : object.currencies,
            "external_users": object.external_users ? object.external_users.map(external_user_id => external_user_id) : object.external_users,
            "wallet": object.wallet ? object.wallet.map(wallet => {
                return ({
                    "_id": wallet._id,
                    "max_deposit": wallet.max_deposit,
                    "max_withdraw": wallet.max_withdraw,
                    "min_withdraw": wallet.min_withdraw,
                    "affiliate_min_withdraw": wallet.affiliate_min_withdraw,
                    "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(deposit_address_id => deposit_address_id) : wallet.depositAddresses,
                    "link_url": wallet.link_url,
                    "currency": !wallet.currency ? {} : {
                        "_id": wallet.currency._id,
                        "image": wallet.currency.image,
                        "ticker": wallet.currency.ticker,
                        "decimals": wallet.currency.decimals,
                        "name": wallet.currency.name,
                        "address": wallet.currency.address,
                        "virtual": wallet.currency.virtual,
                    },
                    "price": wallet.price
                })
            }) : object.wallet,
            "typography": object.typography ? {
                "_id": object.typography._id,
                "name": object.typography.name,
                "url": object.typography.url
            } : object.typography,
            "countriesAvailable": object.countriesAvailable ? object.countriesAvailable.map(country_available => country_available) : object.countriesAvailable,
            "restrictedCountries": object.restrictedCountries ? object.restrictedCountries : [],
            "licensesId": object.licensesId ? object.licensesId.map(license_id => license_id) : object.licensesId,
            "isWithdrawing": object.isWithdrawing,
            "name": object.name,
            "affiliateSetup": !object.affiliateSetup ? {} : {
                "_id": object.affiliateSetup._id,
                "isActive": object.affiliateSetup.isActive,
                "affiliateStructures": object.affiliateSetup.affiliateStructures ? object.affiliateSetup.affiliateStructures.map(affiliate_structure => {
                    return ({
                        "_id": affiliate_structure._id,
                        "isActive": affiliate_structure.isActive,
                        "level": affiliate_structure.level,
                        "percentageOnLoss": affiliate_structure.percentageOnLoss
                    })
                }) : object.affiliateSetup.affiliateStructures,
                "customAffiliateStructures": object.affiliateSetup.customAffiliateStructures ? object.affiliateSetup.customAffiliateStructures.map(custom_affiliate_structure_id => custom_affiliate_structure_id) : object.affiliateSetup.customAffiliateStructures,
            },
            "customization": !object.customization ? {} : {
                "_id": object.customization._id,
                "theme": object.customization.theme,
                "colors": object.customization.colors ? object.customization.colors.map(color => {
                    return ({
                        "_id": color._id,
                        "type": color.type,
                        "hex": color.hex
                    })
                }) : object.customization.colors,
                "topBar": !object.customization.topBar ? {} : {
                    "_id": object.customization.topBar._id,
                    "isActive": object.customization.topBar.isActive,
                    "backgroundColor": object.customization.topBar.backgroundColor,
                    "text": object.customization.topBar.text,
                    "textColor": object.customization.topBar.textColor,
                },
                "banners": !object.customization.banners ? {} : {
                    "_id": object.customization.banners._id,
                    "autoDisplay": object.customization.banners.autoDisplay,
                    "ids": !object.customization.banners.ids ? [] : object.customization.banners.ids.map(id => {
                        return ({
                            "_id": id._id,
                            "image_url": id.image_url,
                            "link_url": id.link_url,
                            "button_text": id.button_text,
                            "title": id.title,
                            "subtitle": id.subtitle,
                        })
                    })
                },
                "logo": !object.customization.logo ? {} : {
                    "_id": object.customization.logo._id,
                    "id": !object.customization.logo.id ? '' : object.customization.logo.id
                },
                "background": !object.customization.background ? {} : {
                    "_id": object.customization.background._id,
                    "id": !object.customization.background.id ? '' : object.customization.background.id
                },
                "footer": !object.customization.footer ? {} : {
                    "_id": object.customization.footer._id,
                    "supportLinks": !object.customization.footer.supportLinks ? [] : object.customization.footer.supportLinks.map(support_link => {
                        return ({
                            "_id": support_link._id,
                            "name": support_link.name,
                            "href": support_link.href,
                        })
                    }),
                    "communityLinks": !object.customization.footer.communityLinks ? [] : object.customization.footer.communityLinks.map(community_link => {
                        return ({
                            "_id": community_link._id,
                            "name": community_link.name,
                            "href": community_link.href,
                        })
                    })
                },
                "topIcon": !object.customization.topIcon ? {} : {
                    "_id": object.customization.topIcon._id,
                    "id": !object.customization.topIcon.id ? '' : object.customization.topIcon.id
                },
                "loadingGif": !object.customization.loadingGif ? {} : {
                    "_id": object.customization.loadingGif._id,
                    "id": !object.customization.loadingGif.id ? '' : object.customization.loadingGif.id
                },
            },
            "integrations": !object.integrations ? {} : {
                "_id": object.integrations._id,
                "chat": !object.integrations.chat ? {} : {
                    "_id": object.integrations.chat._id,
                    "isActive": object.integrations.chat.isActive,
                    "name": object.integrations.chat.name,
                    "metaName": object.integrations.chat.metaName,
                    "link": object.integrations.chat.link,
                    "privateKey": object.integrations.chat.privateKey,
                    "publicKey": object.integrations.chat.publicKey,
                    "token": object.integrations.chat.token
                },
                "mailSender": !object.integrations.mailSender ? {} : {
                    "_id": object.integrations.mailSender._id,
                    "apiKey": object.integrations.mailSender.apiKey,
                    "templateIds": !object.integrations.mailSender.templateIds ? [] : object.integrations.mailSender.templateIds.map(template => {
                        return ({
                            "template_id": template.template_id,
                            "functionName": template.functionName,
                            "contactlist_Id": template.contactlist_Id
                        })
                    }),
                },
                "pusher": !object.integrations.pusher ? {} : {
                    "key": object.integrations.pusher.key
                },
            },
            "description": object.description,
            "hosting_id": object.hosting_id,
            "web_url": object.web_url,
            "addOn": !object.addOn ? {} : {
                autoWithdraw  : !object.addOn.autoWithdraw  ? null : object.addOn.autoWithdraw,
                balance       : !object.addOn.balance       ? null : object.addOn.balance,
                txFee         : !object.addOn.txFee       ? null : object.addOn.txFee,
                depositBonus  : !object.addOn.depositBonus       ? null : object.addOn.depositBonus
            },
            "__v": object.__v,
        }
    },
}


class MapperGet {

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
            Get: 'get'
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

let MapperGetSingleton = new MapperGet();

export {
    MapperGetSingleton
}