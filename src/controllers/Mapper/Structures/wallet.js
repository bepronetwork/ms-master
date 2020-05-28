
const wallet_object = (object) => {
    return {
        "wallet": object.wallet ? object.wallet.map(wallet => {
            return ({
                "_id": wallet._id,
                "image" :wallet.image,
                "playBalance": wallet.playBalance,
                "max_deposit": wallet.max_deposit,
                "max_withdraw": wallet.max_withdraw,
                "min_withdraw": wallet.min_withdraw,
                "affiliate_min_withdraw": wallet.affiliate_min_withdraw,
                "depositAddresses": wallet.depositAddresses ? wallet.depositAddresses.map(deposit_address_id => deposit_address_id) : wallet.depositAddresses,
                "link_url": wallet.link_url,
                "currency": !wallet.currency ? {} : {
                    "_id": wallet.currency._id,
                    "image": (wallet.image == null || wallet.image == '') ? wallet.currency.image : wallet.image,
                    "ticker": wallet.currency.ticker,
                    "decimals": wallet.currency.decimals,
                    "name": wallet.currency.name,
                    "address": wallet.currency.address,
                    "virtual": wallet.currency.virtual,
                },
                "price": wallet.price,
                "bitgo_id": wallet.bitgo_id,
                "bank_address": wallet.bank_address
            })
        }) : object.wallet,
    }
}


export {
    wallet_object
}