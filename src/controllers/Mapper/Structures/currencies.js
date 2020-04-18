
const currencies_object = (object) => {
    return {
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
    }
}


export {
    currencies_object
}