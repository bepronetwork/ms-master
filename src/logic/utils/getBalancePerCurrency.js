
function getBalancePerCurrency(balance, currency){
    if (balance == null) {
        return 0;
    }
    return (balance.initialBalanceList.find((c)=> {
        return c.currency.toString() == currency.toString()
    } )).initialBalance;
}

function getMultiplierBalancePerCurrency(balance, currency){
    if (balance == null) {
        return 0;
    }
    const multiplier = (balance.initialBalanceList.find((c)=> {
        return c.currency.toString() == currency.toString()
    } )).multiplier;

    const initialBalance = (balance.initialBalanceList.find((c)=> {
        return c.currency.toString() == currency.toString()
    } )).initialBalance;

    return (initialBalance*multiplier)
}


export {
    getBalancePerCurrency,
    getMultiplierBalancePerCurrency
}