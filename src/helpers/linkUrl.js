import { ENV } from "../config";

export const setLinkUrl = ({ ticker, address }) => {
    var link_url;
    if (ENV === "development") {
        switch (new String(ticker).toLowerCase().trim()) {
            case 'eth': {
                link_url = `https://kovan.etherscan.io/address/${address}`;
                return link_url;
            };
            default:
                link_url = address;
                return link_url;
        }
    } else if (ENV === "production") {
        switch (new String(ticker).toLowerCase().trim()) {
            case 'eth': {
                link_url = `https://etherscan.io/address/${address}`;
                return link_url;
            };
            default:
                link_url = address;
                return link_url;
        }
    }
}