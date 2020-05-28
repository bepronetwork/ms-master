
const deposit_bonus_object = (object) => {
    return {
        "_id": object._id,
        "isDepositBonus": object.isDepositBonus,
        "min_deposit": !object.min_deposit ? [] : object.min_deposit.map(min_deposit => {
            return ({
                "_id": min_deposit._id,
                "amount": min_deposit.amount,
                "currency": min_deposit.currency
            })
        }),
        "percentage": !object.percentage ? [] : object.percentage.map(percentage => {
            return ({
                "_id": percentage._id,
                "amount": percentage.amount,
                "currency": percentage.currency
            })
        }),
        "max_deposit": !object.max_deposit ? [] : object.max_deposit.map(max_deposit => {
            return ({
                "_id": max_deposit._id,
                "amount": max_deposit.amount,
                "currency": max_deposit.currency
            })
        }),
        "__v": object.__v,
    }
}


export {
    deposit_bonus_object
}