const CryptoApis = require('cryptoapis.io');
import { CRYPTO_API, MS_MASTER_URL } from "../../../config";

class CryptoEthClass {
    constructor() {
        this.cryptoApi = new CryptoApis(CRYPTO_API)
    }

    async generateAccount({ passphrase }) {
        try {
            let account = await this.cryptoApi.BC.ETH.address.generateAccount({ password: passphrase })
            return account;
        } catch (err) {
            throwError('WEAK_PASSWORD')
        }
    }

    async addAppDepositWebhook({ address, app_id, currency_id }) {
        // try {
            let url = `${MS_MASTER_URL}/api/app/webhookBitgoDeposit?id=${app_id}&currency=${currency_id}`
            let event = "ADDRESS"
            let confirmations = 3
            let webhook = await this.cryptoApi.BC.ETH.webhook.createAddressTransactionWebHook( url, event, confirmations, address)
            console.log("webhook:: ",webhook)
            return webhook;
        // } catch (err) {
        //     console.log(err)
        // }

    }
}

var CryptoEthSingleton = new CryptoEthClass();

export {
    CryptoEthSingleton
}