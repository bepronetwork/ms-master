const CryptoApis = require('cryptoapis.io');
import { CRYPTO_API } from "../../../config";

class CryptoEthClass {
    constructor() {
        this.cryptoApi = new CryptoApis(CRYPTO_API)
    }

    async generateAccount({passphrase}){
        let account = await this.cryptoApi.BC.ETH.address.generateAccount({ password : passphrase })
        return account;
    }

    async createWalletBitgo({label, passphrase, currency}){
        const currencyTicker = `${IS_DEVELOPMENT ? 't' : ''}${new String(currency).toLowerCase()}`;
        /* All test wallets start with t${currency_name} --- t behind the currency ex : tbtc */
        var { wallet, userKeychain, backupKeychain, bitgoKeychain } = await this.bitgo.coin(currencyTicker).wallets().generateWallet({label, passphrase, enterprise : BITGO_ENTERPRISE_ID});

        // Wait for wallet tx init - force delay
        wallet = await this.getWallet({ticker : currency, id : wallet.id()});

        let receiveAddress = (wallet._wallet.receiveAddress && wallet._wallet.receiveAddress.address) ? wallet._wallet.receiveAddress.address : wallet._wallet.coinSpecific.baseAddress;

        return { 
            wallet, 
            receiveAddress,
            keys : { 
                user : userKeychain, 
                backup : backupKeychain, 
                bitgo : bitgoKeychain
            } 
        };
    }
}

var CryptoEthSingleton = new CryptoEthClass();

export {
    CryptoEthSingleton
}