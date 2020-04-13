import { compareCurrencyId } from "./currency";

export function getVirtualAmountFromRealCurrency({currency, virtualWallet, currencyAmount}){
    const priceObject = virtualWallet.price.find( c => compareCurrencyId(c, currency._id));
    return parseFloat(parseFloat(priceObject.amount) * parseFloat(currencyAmount))
}