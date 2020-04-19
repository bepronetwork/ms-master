
const wallets_object = (object) => {
    return {
        "wallets": object.wallets ? object.wallets.map(wallet => {
            return ({
                "_id": wallet._id,
                "wallet": wallet.wallet,
                "tableLimit": wallet.tableLimit,
            })
        }) : object.wallets,
    }
}


export {
    wallets_object
}