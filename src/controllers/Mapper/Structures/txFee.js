
const tx_fee_object = (object) => {
    return {
        "_id": object._id,
        "isTxFee": object.isTxFee,
        "deposit_fee": !object.deposit_fee ? [] : object.deposit_fee.map(max_withdraw_amount_cumulative => {
            return ({
                "_id": max_withdraw_amount_cumulative._id,
                "amount": max_withdraw_amount_cumulative.amount,
                "currency": max_withdraw_amount_cumulative.currency
            })
        }),
        "withdraw_fee": !object.withdraw_fee ? [] : object.withdraw_fee.map(max_withdraw_amount_per_transaction => {
            return ({
                "_id": max_withdraw_amount_per_transaction._id,
                "amount": max_withdraw_amount_per_transaction.amount,
                "currency": max_withdraw_amount_per_transaction.currency
            })
        }),
        "__v": object.__v,
    }
}


export {
    tx_fee_object
}