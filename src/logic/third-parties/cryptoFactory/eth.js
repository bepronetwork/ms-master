import { throwError } from "../../../controllers/Errors/ErrorManager";
import { CryptoSingleton } from "./crypto";
import { USER_KEY, IS_DEVELOPMENT, MS_MASTER_URL} from "../../../config";

class CryptoEthClass {
    constructor() {
        this.cryptoApi = CryptoSingleton.init();
    }

    async generateAccount(passphrase) {
        try {
            let account = await this.cryptoApi.BC.ETH.address.generateAccount(passphrase);
            console.log("account:: ", account)
            return account;
        } catch (err) {
            console.log("Error:: ", err)
            throwError('WEAK_PASSWORD')
        }
    }

    async getTransaction(txHash) {
        try {
            let network = await this.cryptoApi.BC.ETH.getSelectedNetwork();
            console.log(":::network::::", network)
            let transaction = await this.cryptoApi.BC.ETH.transaction.getTransaction(txHash) ;
            console.log("getTransaction:: ", transaction)
            return transaction;
        } catch (err) {
            console.log(err)
        }
    }
    async addAppDepositWebhook({ address, app_id, currency_id, isApp }) {
        try {
            let url = `${MS_MASTER_URL}/api/user/webhookDeposit?id=${app_id}&currency=${currency_id}&isApp=${isApp}`
            let confirmations = 3
            let webhook = await this.cryptoApi.BC.ETH.webhook.createAddressTransactionWebHook(url, address, confirmations)
            console.log("addAppDepositWebhook:: ", webhook)
            return webhook;
        } catch (err) {
            console.log(err)
        }
    }
    async generateDepositAddress() {
        try {
            let depositAddress = await this.cryptoApi.BC.ETH.address.generateAccount(USER_KEY)
            console.log("depositAddress:: ", depositAddress)
            return depositAddress;
        } catch (err) {
            console.log(err)
        }
    }

    async getAddressInfo(address) {
        try {
            let addressInfo = await this.cryptoApi.BC.ETH.address.getInfo(address)
            console.log("addressInfo:: ", addressInfo)
            return addressInfo;
        } catch (err) {
            console.log(err)
        }
    }

    async createPaymentForwarding({from, to, callbackURL, wallet, password, confirmations}) {
        try {
            let createPaymentForwarding = await this.cryptoApi.BC.ETH.paymentForwarding.createPaymentForwarding(from, to, callbackURL, wallet, password, confirmations)
            console.log("createPaymentForwarding:: ", createPaymentForwarding)
            return createPaymentForwarding;
        } catch (err) {
            console.log(err)
        }
    }
}

var CryptoEthSingleton = new CryptoEthClass();

export {
    CryptoEthSingleton
}