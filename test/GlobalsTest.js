const __config = require('./config/config');
import Web3 from 'web3';
import CasinoContract from "./logic/eth/CasinoContract";
import interfaces from "./logic/eth/interfaces";
import ERC20TokenContract from "./logic/eth/ERC20Contract";

let ETH_NETWORK = __config.default.eth.network;

const constants = {
    net             : ETH_NETWORK,
    key             : __config.default.eth.keys.home,
    eth_url         : __config.default.eth.url,
    casino          : interfaces.casino,
    tokenDecimals   : 18
}

class GlobalsTest{
    constructor(){
        this.constants = constants;
        this.web3 = new Web3(new Web3.providers.HttpProvider(constants.eth_url));
    }

    getCasinoContract(address, tokenAddress){
        return new CasinoContract({
            web3 : this.web3,
            contractDeployed : constants.casino,
            erc20TokenContract : tokenAddress,
            contractAddress : address
        })
    }

    getERC20Contract(tokenAddress){
        let erc20Contract = new ERC20TokenContract({
            web3 : this.web3,
            contractAddress : tokenAddress,
            accountPrivateKey : constants.key
        })

        erc20Contract.__assert(
            {
                contractAddress : tokenAddress,
                contract_name : 'IERC20Token' 
            }
        );

        return erc20Contract;
    }

    newCasinoContract(params){
        return new CasinoContract({
            web3 : this.web3,
            contractDeployed : constants.casino,
            erc20TokenContract : params.tokenAddress,
            tokenTransferAmount : params.tokenTransferAmount
        })
    }
    
}

let globalsTest = new GlobalsTest(); // Singleton

export {
    globalsTest
}
