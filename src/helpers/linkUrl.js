import { ENV } from "../config";

export const setLinkUrl = ({ ticker, address }) => {

    if (ENV === "development") {
        switch (new String(ticker).toLowerCase().trim()) {
            case 'eth': {
                link_url = `https://etherscan.io/address/${address}`;
                return link_url;
            };
            case 'keth': {
                link_url = `https://kovan.etherscan.io/address/${address}`;
                return link_url;
            }
            default:
                link_url = address;
                return link_url;
        }
    } else if (ENV === "production") {
        switch (new String(ticker).toLowerCase().trim()) {
            case 'eth': {
                link_url = `https://etherscan.com/address/${address}`;
                return link_url;
            };
            case 'keth': {
                link_url = `https://kovan.etherscan.io/address/${address}`;
                return link_url;
            }
            default:
                link_url = address;
                return link_url;
        }
    }
}