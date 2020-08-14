const CryptoApis = require('cryptoapis.io');
import { CRYPTO_API, MS_MASTER_URL } from "../../../config";
import { throwError } from "../../../controllers/Errors/ErrorManager";

class CryptoEthClass {
    constructor() {
        this.cryptoApi = new CryptoApis(CRYPTO_API)
    }

    async generateAccount({ passphrase }) {
        try {
            let account = await this.cryptoApi.BC.ETH.address.generateAccount({ password: passphrase });
            return account;
        } catch (err) {
            console.log("Error:: ", err)
            throwError('WEAK_PASSWORD')
        }
    }
    async addAppDepositWebhook({ address, app_id, currency_id }) {
        try {
            let urlMaster = "https://ms-master-issue-666-zw4rzsgd95.herokuapp.com"; //TODO remove
            let url = `${urlMaster}/api/app/webhookDeposit?id=${app_id}&currency=${currency_id}`
            let event = "ADDRESS"
            let confirmations = 3
            let webhook = await this.cryptoApi.BC.ETH.webhook.createAddressTransactionWebHook(url, event, confirmations, address)
            console.log("webhook:: ", webhook)
            return webhook;
        } catch (err) {
            console.log(err)
        }
    }
    async generateDepositAddress() {
        try {
            let depositAddress = await this.cryptoApi.BC.ETH.address.generateAddress()
            return depositAddress;
        } catch (err) {
            console.log(err)
        }
    }

    async getAddressInfo(address) {
        try {
            let addressInfo = await this.cryptoApi.BC.ETH.address.getInfo(address)
            return addressInfo;
        } catch (err) {
            console.log(err)
        }
    }
}

var CryptoEthSingleton = new CryptoEthClass();

export {
    CryptoEthSingleton
}