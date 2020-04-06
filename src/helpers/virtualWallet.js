import { compareCurrencyId } from "./currency";

export function getVirtualAmountFromRealCurrency({currency, virtualCurrency, currencyAmount}){
    return parseFloat(parseFloat(virtualCurrency.price[virtualCurrency.price.find( c => compareCurrencyId(c, currency))].amount) * parseFloat(currencyAmount))
}