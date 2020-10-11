import { Security } from "../../Security"

const app_object = (object) => {
    return {
        "app": !object.app ? object.app : {
            "id": object.app._id,
            "_id": object.app._id,
            "isValid": object.app.isValid,
            "games": object.app.games ? object.app.games.map(game => {
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
                    "bets": game.bets ? game.bets.map(bet_id => {
                        return ({
                            "_id": bet_id
                        })
                    }) : game.bets,
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
                            "wallet": wallet.wallet,
                            "tableLimit": wallet.tableLimit,
                        })
                    }) : game.wallets,
                })
            }) : object.app.games,
            "listAdmins": object.app.listAdmins ? object.app.listAdmins.map(list_admin_id => {
                return ({
                    "_id": list_admin_id
                })
            }) : object.app.listAdmins,
            "services": object.app.services ? object.app.services.map(service => service) : object.app.services,
            "currencies": object.app.currencies ? object.app.currencies.map(currency => {
                return ({
                    "_id": currency._id,
                    "image": currency.image,
                    "ticker": currency.ticker,
                    "decimals": currency.decimals,
                    "name": currency.name,
                    "address": currency.address,
                    "virtual": currency.virtual
                })
            }) : object.app.currencies,
            "users": object.app.users ? object.app.users.map(user => {
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
            }) : object.app.users,
            "external_users": object.app.external_users ? object.app.external_users.length : 0,
            "wallet": object.app.wallet ? object.app.wallet.map(wallet => {
                return ({
                    "_id": wallet._id,
                    "playBalance": wallet.playBalance,
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
                    },
                    "price": wallet.price,
                    "bitgo_id": wallet.bitgo_id,
                    "bank_address": wallet.bank_address
                })
            }) : object.app.wallet,
            "deposits": object.app.deposits ? object.app.deposits.map(deposit_id => {
                return ({
                    "_id": deposit_id
                })
            }) : object.app.deposits,
            "withdraws": object.app.withdraws ? object.app.withdraws.map(withdraw_id => {
                return ({
                    "_id": withdraw_id
                })
            }) : object.app.withdraws,
            "typography": !object.app.typography ? object.app.typography : (object.app.typography.name && object.app.typography.url) == undefined ? object.app.typography._id : {
                name: object.app.typography.name,
                url: object.app.typography.url,
                _id: object.app.typography._id
            },
            "countriesAvailable": object.app.countriesAvailable ? object.app.countriesAvailable.map(country_available => country_available) : object.app.countriesAvailable,
            "restrictedCountries": object.app.restrictedCountries ? object.app.restrictedCountries : [],
            "licensesId": object.app.licensesId ? object.app.licensesId.map(license_id => license_id) : object.app.licensesId,
            "isWithdrawing": object.app.isWithdrawing,
            "virtual": object.app.virtual,
            "name": object.app.name,
            "affiliateSetup": !object.app.affiliateSetup ? {} : object.app.affiliateSetup.isActive == undefined ? object.app.affiliateSetup._id : {
                "_id": object.app.affiliateSetup._id,
                "isActive": object.app.affiliateSetup.isActive,
                "affiliateStructures": object.app.affiliateSetup.affiliateStructures ? object.app.affiliateSetup.affiliateStructures.map(affiliate_structure => {
                    return ({
                        "_id": affiliate_structure._id,
                        "isActive": affiliate_structure.isActive,
                        "level": affiliate_structure.level,
                        "percentageOnLoss": affiliate_structure.percentageOnLoss
                    })
                }) : object.app.affiliateSetup.affiliateStructures,
                "customAffiliateStructures": object.app.affiliateSetup.customAffiliateStructures ? object.app.affiliateSetup.customAffiliateStructures.map(custom_affiliate_structure_id => custom_affiliate_structure_id) : object.app.affiliateSetup.customAffiliateStructures,
            },
            "customization": !object.app.customization ? {} : object.app.customization.colors == undefined ? object.app.customization._id : {
                "_id": object.app.customization._id,
                "theme": object.app.customization.theme,
                "socialLink": object.app.customization.socialLink,
                "languages": object.app.customization.languages,
                "skin": object.app.customization.skin,
                "icons": object.app.customization.icons,
                "colors": object.app.customization.colors ? object.app.customization.colors.map(color => {
                    return ({
                        "_id": color._id,
                        "type": color.type,
                        "hex": color.hex
                    })
                }) : object.app.customization.colors,
                "topBar": !object.app.customization.topBar ? {} : {
                    "_id": object.app.customization.topBar._id,
                    "isActive": object.app.customization.topBar.isActive,
                    "backgroundColor": object.app.customization.topBar.backgroundColor,
                    "text": object.app.customization.topBar.text,
                    "textColor": object.app.customization.topBar.textColor,
                    "isTransparent": object.app.customization.topBar.isTransparent,
                },
                "banners": !object.app.customization.banners ? {} : {
                    "_id": object.app.customization.banners._id,
                    "autoDisplay": object.app.customization.banners.autoDisplay,
                    "fullWidth": object.app.customization.banners.fullWidth,
                    "ids": !object.app.customization.banners.ids ? [] : object.app.customization.banners.ids.map(id => {
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
                "subSections": !object.app.customization.subSections ? {} : {
                    "_id": object.app.customization.subSections._id,
                    "ids": !object.app.customization.subSections.ids ? [] : object.app.customization.subSections.ids.map(id => {
                        return ({
                            "_id": id._id,
                            "title": id.title,
                            "text": id.text,
                            "image_url": id.image_url,
                            "background_url": id.background_url,
                            "background_color": id.background_color,
                            "position": id.position,
                            "location": id.location
                        })
                    })
                },
                "logo": !object.app.customization.logo ? {} : {
                    "_id": object.app.customization.logo._id,
                    "id": !object.app.customization.logo.id ? '' : object.app.customization.logo.id
                },
                "background": !object.app.customization.background ? {} : {
                    "_id": object.app.customization.background._id,
                    "id": !object.app.customization.background.id ? '' : object.app.customization.background.id
                },
                "footer": !object.app.customization.footer ? {} : {
                    "_id": object.app.customization.footer._id,
                    "supportLinks": !object.app.customization.footer.supportLinks ? [] : object.app.customization.footer.supportLinks.map(support_link => {
                        return ({
                            "_id": support_link._id,
                            "name": support_link.name,
                            "href": support_link.href,
                            "image_url": support_link.image_url,
                        })
                    }),
                    "communityLinks": !object.app.customization.footer.communityLinks ? [] : object.app.customization.footer.communityLinks.map(community_link => {
                        return ({
                            "_id": community_link._id,
                            "name": community_link.name,
                            "href": community_link.href,
                            "image_url": community_link.image_url,
                        })
                    })
                },
                "topIcon": !object.app.customization.topIcon ? {} : {
                    "_id": object.app.customization.topIcon._id,
                    "id": !object.app.customization.topIcon.id ? '' : object.app.customization.topIcon.id
                },
                "loadingGif": !object.app.customization.loadingGif ? {} : {
                    "_id": object.app.customization.loadingGif._id,
                    "id": !object.app.customization.loadingGif.id ? '' : object.app.customization.loadingGif.id
                },
                "esportsScrenner": object.app.customization.esportsScrenner,
                "topTab": object.app.customization.topTab
            },
            "integrations": !object.app.integrations ? {} : (!object.app.integrations.chat && !object.app.integrations.mailSender && !object.app.integrations.pusher) ? object.app.customization._id : {
                "_id": object.app.integrations._id,
                "chat": !object.app.integrations.chat ? {} : {
                    "_id": object.app.integrations.chat._id,
                    "isActive": object.app.integrations.chat.isActive,
                    "name": object.app.integrations.chat.name,
                    "metaName": object.app.integrations.chat.metaName,
                    "link": object.app.integrations.chat.link,
                    "privateKey": !object.app.integrations.chat.privateKey ? object.app.integrations.chat.privateKey : Security.prototype.decryptData(object.app.integrations.chat.privateKey),
                    "publicKey": !object.app.integrations.chat.publicKey ? object.app.integrations.chat.publicKey : Security.prototype.decryptData(object.app.integrations.chat.publicKey),
                    "token": object.app.integrations.chat.token
                },
                "cripsr": !object.app.integrations.cripsr ? {} : {
                    "_id": object.app.integrations.cripsr._id,
                    "key": !object.app.integrations.cripsr.key ? object.app.integrations.cripsr.key : Security.prototype.decryptData(object.app.integrations.cripsr.key),
                    "isActive": object.app.integrations.cripsr.isActive,
                    "link": object.app.integrations.cripsr.link,
                    "name": object.app.integrations.cripsr.name,
                    "metaName": object.app.integrations.cripsr.metaName,
                },
                "kyc": !object.app.integrations.kyc ? {} : {
                    "_id": object.app.integrations.kyc._id,
                    "clientId": !object.app.integrations.kyc.clientId ? null : Security.prototype.decryptData(object.app.integrations.kyc.clientId),
                    "flowId": !object.app.integrations.kyc.flowId ? null : Security.prototype.decryptData(object.app.integrations.kyc.flowId),
                    "link": object.app.integrations.kyc.link,
                    "isActive": object.app.integrations.kyc.isActive,
                    "name": object.app.integrations.kyc.name,
                    "metaName": object.app.integrations.kyc.metaName,
                },
                "mailSender": !object.app.integrations.mailSender ? {} : {
                    "_id": object.app.integrations.mailSender._id,
                    "apiKey": object.app.integrations.mailSender.apiKey,
                    "templateIds": !object.app.integrations.mailSender.templateIds ? [] : object.app.integrations.mailSender.templateIds.map(template => {
                        return ({
                            "template_id": template.template_id,
                            "functionName": template.functionName,
                            "contactlist_Id": template.contactlist_Id
                        })
                    }),
                },
                "moonpay": !object.app.integrations.moonpay ? {} : {
                    "_id": object.app.integrations.moonpay._id,
                    "key": !object.app.integrations.moonpay.key ? object.app.integrations.moonpay.key : Security.prototype.decryptData(object.app.integrations.moonpay.key),
                    "link": object.app.integrations.moonpay.link,
                    "isActive": object.app.integrations.moonpay.isActive,
                    "name": object.app.integrations.moonpay.name,
                    "metaName": object.app.integrations.moonpay.metaName,
                },
                "pusher": !object.app.integrations.pusher ? {} : {
                    "key": object.app.integrations.pusher.key
                },
            },
            "description": object.app.description,
            "hosting_id": object.app.hosting_id,
            "web_url": object.app.web_url,
            "addOn": object.app.addOn,
            "esports_edge": object.app.esports_edge,
            "whitelistedAddresses": object.app.whitelistedAddresses,
            "__v": object.app.__v,
        }
    }
}


export {
    app_object
}