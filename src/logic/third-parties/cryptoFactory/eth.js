import { throwError } from "../../../controllers/Errors/ErrorManager";
import { CryptoSingleton } from "./crypto";
import { USER_KEY, IS_DEVELOPMENT} from "../../../config";

class CryptoEthClass {
    constructor() {
        this.cryptoApi = CryptoSingleton.init();
        if(IS_DEVELOPMENT){ this.cryptoApi.BC.ETH.switchNetwork('rinkeby')}
    }

    async generateAccount({ passphrase }) {
        try {
            let account = await this.cryptoApi.BC.ETH.address.generateAccount(passphrase);
            return account;
        } catch (err) {
            console.log("Error:: ", err)
            throwError('WEAK_PASSWORD')
        }
    }

    async getTransaction({ txHash }) {
        try {
            let network = await this.cryptoApi.BC.ETH.getSelectedNetwork();
            console.log(":::network::::", network)
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
            // let url = `https://webhook.site/74f3ff3d-2b88-4c3a-8f17-583be05633e4?id=${app_id}&currency=${currency_id}&isApp=${isApp}`
            let confirmations = 3
            let webhook = await this.cryptoApi.BC.ETH.webhook.createAddressTransactionWebHook(url, address, confirmations)
            console.log("webhook:: ", webhook)
            return webhook;
        } catch (err) {
            console.log(err)
        }
    }
    async generateDepositAddress() {
        try {
            let depositAddress = await this.cryptoApi.BC.ETH.address.generateAccount(USER_KEY)
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