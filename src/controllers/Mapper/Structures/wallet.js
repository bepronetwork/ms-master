
const wallet_object = (object) => {
    return {
        "wallet": object.wallet ? object.wallet.map(wallet => {
            return ({
                "_id": wallet._id,
                "image": (wallet.image == null || wallet.image == '') ? wallet.currency.image : wallet.image,
                "playBalance": wallet.playBalance,
                "max_deposit": wallet.max_deposit,
                "max_withdraw": wallet.max_withdraw,
                "min_withdraw": wallet.min_withdraw,
                "affiliate_min_withdraw": wallet.affiliate_min_withdraw,
                "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(deposit_address => {
                    return ({
                        "_id": deposit_address._id,
                        "currency": deposit_address.currency,
                        "user": deposit_address.user,
                        "bitgo_id": deposit_address.bitgo_id,
                    })

                }) : wallet.depositAddresses,
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
                "price": wallet.price,
                "bitgo_id": wallet.bitgo_id,
                "bank_address": wallet.bank_address,
                "virtual": wallet.virtual,
                "bonusAmount": wallet.bonusAmount,
                "minBetAmountForBonusUnlocked": wallet.minBetAmountForBonusUnlocked,
                "incrementBetAmountForBonus": wallet.incrementBetAmountForBonus,
                "availableDepositAddresses": wallet.availableDepositAddresses
            })
        }) : object.wallet,
    }
}


export {
    wallet_object
}