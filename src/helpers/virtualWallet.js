import { compareCurrencyId } from "./currency";

export function getVirtualAmountFromRealCurrency({currency, virtualWallet, currencyAmount}){
    return parseFloat(parseFloat(virtualWallet.price.find( c => compareCurrencyId(c, currency)).amount) * parseFloat(currencyAmount))
}