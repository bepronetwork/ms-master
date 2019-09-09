const __config = require('./config/config');
import Web3 from 'web3';
import CasinoContract from "./logic/eth/CasinoContract";
import interfaces from "./logic/eth/interfaces";
import ERC20TokenContract from "./logic/eth/ERC20Contract";

let ETH_NETWORK = __config.default.eth.network;

const CONSTANTS = {
    net : ETH_NETWORK,
    key : __config.default.eth.keys.home,
    eth_url : __config.default.eth.url,
    casino        : interfaces.casino
}

Object.assign(global, CONSTANTS);

class GlobalsTest{
    constructor(){
        this.web3 = new Web3(new Web3.providers.HttpProvider(CONSTANTS.eth_url));
    }

    getCasinoContract(address, tokenAddress){
        return new CasinoContract({
            web3 : this.web3,
            contractDeployed : CONSTANTS.casino,
            erc20TokenContract : tokenAddress,
            contractAddress : address
        })
    }

    getERC20Contract(tokenAddress){
        let erc20Contract = new ERC20TokenContract({
            web3 : this.web3,
            contractAddress : tokenAddress,
            accountPrivateKey : CONSTANTS.key
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
            contractDeployed : CONSTANTS.casino,
            erc20TokenContract : params.tokenAddress,
            tokenTransferAmount : params.tokenTransferAmount
        })
    }
    
}

let globalsTest = new GlobalsTest(); // Singleton

export {
    globalsTest
}
