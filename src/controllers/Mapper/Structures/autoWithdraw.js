
const auto_withdraw_object = (object) => {
    return {
        "_id": object._id,
        "isAutoWithdraw": object.isAutoWithdraw,
        "verifiedKYC": object.verifiedKYC,
        "maxWithdrawAmountCumulative": !object.maxWithdrawAmountCumulative ? [] : object.maxWithdrawAmountCumulative.map(max_withdraw_amount_cumulative => {
            return ({
                "_id": max_withdraw_amount_cumulative._id,
                "amount": max_withdraw_amount_cumulative.amount,
                "currency": max_withdraw_amount_cumulative.currency
            })
        }),
        "maxWithdrawAmountPerTransaction": !object.maxWithdrawAmountPerTransaction ? [] : object.maxWithdrawAmountPerTransaction.map(max_withdraw_amount_per_transaction => {
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
    auto_withdraw_object
}