import { games_object } from "./games"
import { currencies_object } from "./currencies"
import { wallet_object } from "./wallet"
import { Security } from "../../Security"
import ConverterSingleton from "../../../logic/utils/converter";
const fixRestrictCountry = ConverterSingleton.convertCountry(require("../../../config/restrictedCountries.config.json"));

const get_object = (object) => {
    return {
        "id": object._id,
        "isValid": object.isValid,
        "casino_providers": object.casino_providers ? object.casino_providers.map(casino_provider => {
            return ({
                "_id": casino_provider._id,
                "activated": casino_provider.activated,
                "api_key": !casino_provider.api_key ? casino_provider.api_key : Security.prototype.decryptData(casino_provider.api_key),
                "name": casino_provider.name,
                "logo": casino_provider.logo,
                "api_url": casino_provider.api_url,
                "partner_id": casino_provider.partner_id,
                "providerEco": casino_provider.providerEco,
            })
        }) : object.casino_providers,
        "analytics": object.analytics ? {
            "_id": object.analytics._id,
            "google_tracking_id": !object.analytics.google_tracking_id ? object.analytics.google_tracking_id : Security.prototype.decryptData(object.analytics.google_tracking_id),
            "isActive": !object.analytics.isActive ? false : object.analytics.isActive
        } : object.analytics,
        "storeAddOn": object.storeAddOn,
        "virtual": object.virtual,
        "licenseID": object.licenseID,
        ...games_object(object),
        "listAdmins": object.listAdmins ? object.listAdmins.map(list_admin_id => {
            return ({
                "_id": list_admin_id
            })
        }) : object.listAdmins,
        "services": object.services ? object.services.map(service => service) : object.services,
        ...currencies_object(object),
        "external_users": object.external_users ? object.external_users.length : 0,
        ...wallet_object(object),
        "typography": object.typography ? {
            "_id": object.typography._id,
            "name": object.typography.name,
            "url": object.typography.url
        } : object.typography,
        "countriesAvailable": object.countriesAvailable ? object.countriesAvailable.map(country_available => country_available) : object.countriesAvailable,
        "restrictedCountries": [...(object.restrictedCountries ? object.restrictedCountries : []), ...fixRestrictCountry],
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
            "socialLink": object.customization.socialLink,
            "languages": object.customization.languages,
            "skin": object.customization.skin,
            "icons": object.customization.icons,
            "colors": object.customization.colors ? object.customization.colors.map(color => {
                return ({
                    "_id": color._id,
                    "type": color.type,
                    "hex": color.hex
                })
            }) : object.customization.colors,
            "topBar": !object.customization.topBar ? {} : object.customization.topBar,
            "banners": !object.customization.banners ? {} : object.customization.banners,
            "subSections": !object.customization.subSections ? {} : object.customization.subSections,
            "logo": !object.customization.logo ? {} : {
                "_id": object.customization.logo._id,
                "id": !object.customization.logo.id ? '' : object.customization.logo.id
            },
            "background": !object.customization.background ? {} : {
                "_id": object.customization.background._id,
                "id": !object.customization.background.id ? '' : object.customization.background.id
            },
            "footer": !object.customization.footer ? {} : object.customization.footer,
            "topIcon": !object.customization.topIcon ? {} : {
                "_id": object.customization.topIcon._id,
                "id": !object.customization.topIcon.id ? '' : object.customization.topIcon.id
            },
            "loadingGif": !object.customization.loadingGif ? {} : {
                "_id": object.customization.loadingGif._id,
                "id": !object.customization.loadingGif.id ? '' : object.customization.loadingGif.id
            },
            "esportsScrenner": object.customization.esportsScrenner,
            "topTab": object.customization.topTab
        },
        "integrations": !object.integrations ? {} : {
            "_id": object.integrations._id,
            "chat": !object.integrations.chat ? {} : {
                "_id": object.integrations.chat._id,
                "isActive": object.integrations.chat.isActive,
                "name": object.integrations.chat.name,
                "metaName": object.integrations.chat.metaName,
                "link": object.integrations.chat.link,
                "privateKey": !object.integrations.chat.privateKey ? object.integrations.chat.privateKey : Security.prototype.decryptData(object.integrations.chat.privateKey),
                "publicKey": !object.integrations.chat.publicKey ? object.integrations.chat.publicKey : Security.prototype.decryptData(object.integrations.chat.publicKey),
                "token": object.integrations.chat.token
            },
            "cripsr": !object.integrations.cripsr ? {} : {
                "_id": object.integrations.cripsr._id,
                "key": !object.integrations.cripsr.key ? object.integrations.cripsr.key : Security.prototype.decryptData(object.integrations.cripsr.key),
                "isActive": object.integrations.cripsr.isActive,
                "link": object.integrations.cripsr.link,
                "name": object.integrations.cripsr.name,
                "metaName": object.integrations.cripsr.metaName,
            },
            "kyc": !object.integrations.kyc ? {} : {
                "_id": object.integrations.kyc._id,
                "clientId": !object.integrations.kyc.clientId ? null : Security.prototype.decryptData(object.integrations.kyc.clientId),
                "client_secret": !object.integrations.kyc.client_secret ? null : Security.prototype.decryptData(object.integrations.kyc.client_secret),
                "flowId": !object.integrations.kyc.flowId ? null : Security.prototype.decryptData(object.integrations.kyc.flowId),
                "link": object.integrations.kyc.link,
                "isActive": object.integrations.kyc.isActive,
                "name": object.integrations.kyc.name,
                "metaName": object.integrations.kyc.metaName,
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
            "moonpay": !object.integrations.moonpay ? {} : {
                "_id": object.integrations.moonpay._id,
                "key": !object.integrations.moonpay.key ? object.integrations.moonpay.key : Security.prototype.decryptData(object.integrations.moonpay.key),
                "link": object.integrations.moonpay.link,
                "isActive": object.integrations.moonpay.isActive,
                "name": object.integrations.moonpay.name,
                "metaName": object.integrations.moonpay.metaName,
            },
            "pusher": !object.integrations.pusher ? {} : {
                "key": object.integrations.pusher.key
            },
        },
        "description": object.description,
        "hosting_id": object.hosting_id,
        "web_url": object.web_url,
        "esports_edge": object.esports_edge,
        "addOn": object.addOn ? {
            ...object.addOn._doc,
            jackpot: object.addOn.jackpot ?  {
                ...object.addOn.jackpot._doc,
                bets: [],
                resultSpace: []
            } : {}
        } : {},
        "__v": object.__v,
    }
}


export {
    get_object
}