import { CryptoSingleton } from "./crypto";
import { throwError } from "../../../controllers/Errors/ErrorManager";

class CryptoBtcClass {
    constructor() {
        this.cryptoApi = CryptoSingleton.init();
    }

    async createHDWallet({ label, passphrase }) {
        try {
            let name = label;
            let addressCount = 1;
            let password = passphrase;
            let wallet = await this.cryptoApi.BC.BTC.wallet.createHDWallet(name, addressCount, password);
            return wallet;
        } catch (err) {
            console.log("Error:: ", err)
            throwError('WEAK_PASSWORD')
        }
    }

    async getTransaction({ txHash }) {
        try {
            let transaction = await this.cryptoApi.BC.ETH.transaction.getTransaction(txHash) ;
            console.log("webhook:: ", transaction)
            return transaction;
        } catch (err) {
            console.log(err)
        }
    }
    async addAppDepositWebhook({ address, app_id, currency_id, isApp }) {
        try {
            let urlMaster = "https://ms-master-issue-666-zw4rzsgd95.herokuapp.com"; //TODO remove
            let url = `${urlMaster}/api/app/webhookDeposit?id=${app_id}&currency=${currency_id}&isApp=${isApp}`
            let confirmations = 3
            let webhook = await this.cryptoApi.BC.BTC.webhook.createAddressTransactionWebHook(url, address, confirmations)
            console.log("webhook:: ", webhook)
            return webhook;
        } catch (err) {
            console.log(err)
        }
    }
    async generateDepositAddress() {
        try {
            let depositAddress = await this.cryptoApi.BC.BTC.address.generateAddress()
            return depositAddress;
        } catch (err) {
            console.log(err)
        }
    }

    async getAddressInfo(address) {
        try {
            let addressInfo = await this.cryptoApi.BC.BTC.address.getInfo(address)
            return addressInfo;
        } catch (err) {
            console.log(err)
        }
    }
}

var CryptoBtcSingleton = new CryptoBtcClass();

export {
    CryptoBtcSingleton
}