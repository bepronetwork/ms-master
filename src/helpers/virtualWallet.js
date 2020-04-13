import { compareCurrencyId } from "./currency";

export function getVirtualAmountFromRealCurrency({currency, virtualWallet, currencyAmount}){
    console.log("virtual Wallet", virtualWallet.price);
    console.log("Currency", currency);
    console.log("Currency Amount", currencyAmount);

    const priceObject = virtualWallet.price.find( c => compareCurrencyId(c, currency));
    return parseFloat(parseFloat(priceObject.amount) * parseFloat(currencyAmount))
}