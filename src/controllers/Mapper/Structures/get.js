import { games_object } from "./games"
import { currencies_object } from "./currencies"
import { wallet_object } from "./wallet"

const get_object = (object) => {
    return {
        "id": object._id,
        "isValid": object.isValid,
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
        "users": object.users ? object.users.map(user => {
            return ({
                "bets": user.bets ? user.bets.map(bet_id => {
                    return ({
                        "_id": bet_id
                    })
                }) : user.bets,
                "deposits": user.deposits ? user.deposits.map(deposit_id => {
                    return ({
                        "_id": deposit_id
                    })
                }) : user.deposits,
                "withdraws": user.withdraws ? user.withdraws.map(withdraw_id => {
                    return ({
                        "_id": withdraw_id
                    })
                }) : user.withdraws,
                "wallet": user.wallet ? user.wallet.map(wallet_id => {
                    return ({
                        "_id": wallet_id
                    })
                }) : user.wallet,
                "isWithdrawing": user.isWithdrawing,
                "email_confirmed": user.email_confirmed,
                "_id": user._id,
                "username": user.username,
                "full_name": user.full_name,
                "affiliate": user.affiliate,
                "name": user.name,
                "register_timestamp": user.register_timestamp,
                "nationality": user.nationality,
                "age": user.age,
                "security": user.security,
                "email": user.email,
                "app_id": user.app_id,
                "external_user": user.external_user,
                "external_id": user.external_id,
                "affiliateLink": user.affiliateLink
            })
        }) : object.users,
        "external_users": object.external_users ? object.external_users.map(external_user_id => external_user_id) : object.external_users,
        ...wallet_object(object),
        "deposits": object.deposits ? object.deposits.map(deposit => {
            return ({
                "_id": deposit._id,
                "confirmations": deposit.confirmations,
                "maxConfirmations": deposit.maxConfirmations,
                "confirmed": deposit.confirmed,
                "link_url": deposit.link_url,
                "app": deposit.app,
                "creation_timestamp": deposit.creation_timestamp,
                "last_update_timestamp": deposit.last_update_timestamp,
                "address": deposit.address,
                "currency": deposit.currency,
                "transactionHash": deposit.transactionHash,
                "amount": deposit.amount,
            })
        }) : object.deposits,
        "withdraws": object.withdraws ? object.withdraws.map(withdraw_id => withdraw_id) : object.withdraws,
        "typography": object.typography ? {
            "_id": object.typography._id,
            "name": object.typography.name,
            "url": object.typography.url
        } : object.typography,
        "countriesAvailable": object.countriesAvailable ? object.countriesAvailable.map(country_available => country_available) : object.countriesAvailable,
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
        "addOn": object.addOn,
        "__v": object.__v,
    }
}


export {
    get_object
}