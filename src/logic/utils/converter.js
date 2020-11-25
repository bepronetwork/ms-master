import CoinmarketcapSingleton from "../coinmarketcap/coinmarketcap";
const JSON_CONVERT_TICKER=require("./converter/convertTicker.json");
const JSON_CONVERT_VALUE=require("./converter/convertValue.json");
import { IS_DEVELOPMENT } from "../../config";
const __rates = {
    // Each BPRO Costs x in Currency
    eth : 0.00002,
}

 /**
     * @class Converter
     * @param {fuctions} convertToBPRO
     * @return {bool || Exception}  
*/

class Converter{

    toUSD = async (currency, amount) => {
        return await CoinmarketcapSingleton.getCurrencyPrice(currency, amount)
    }
    convertTickerProvider = (ticker) => {
        let tickers = JSON_CONVERT_TICKER;
        return (!tickers[ticker]) ? String(ticker).toUpperCase() : tickers[ticker];
    }
    convertAmountProviderBigger = (ticker, value) => {
        let tickers = JSON_CONVERT_VALUE;
        return (!tickers[ticker]) ? value : (value * tickers[ticker]);
    }
    convertAmountProviderSmaller = (ticker, value) => {
        let tickers = JSON_CONVERT_VALUE;
        return (!tickers[ticker]) ? value :(value/tickers[ticker]);
    }
    convertCountry = (data) => {
        return IS_DEVELOPMENT ? [] : data;
    }
}


let ConverterSingleton = new Converter();

export default ConverterSingleton;