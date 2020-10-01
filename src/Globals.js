import { Mongoose } from "mongoose";
import Web3 from 'web3';
import CasinoContract from "./logic/eth/CasinoContract";
import interfaces from "./logic/eth/interfaces";
import ERC20TokenContract from "./logic/eth/ERC20Contract";
import { ETH_NETWORK, ETH_NET_NAME, MONGO_CONNECTION_STRING } from './config';
import { IPRunning } from "./helpers/network";
import { Logger } from "./helpers/logger";
import bluebird from 'bluebird';
import { BitGoSingleton } from "./logic/third-parties";
import { TIMEOUT_MONGO_MS } from "./config";
import Security from "./controllers/Security/Security";

class Globals{
    constructor(){
        this.web3 = new Web3(new Web3.providers.HttpProvider(ETH_NETWORK.url));
    }

    async __init__(){
        console.log((new Security().decryptData('58c18b4ee8860188c7e1ee426ff505a0e1ad4791357b796723986a9f66387912aa17c988baf9bb360d710570daeb522c62136bb34dde16bf55cf48b2af0da7746898fb7ef1a260900c69d49cd330ad7998e9c3836c476740ad18716f68f85b2eb243b5b802f3b87d684932007f1b3108759e3a36c926cc5f3082f719b767ede52b2bc09656fc6b6c03d673ed5d8d5ff193045f42f1ee13e89b9fe66b2cad99c5')));
        /* Init BitGo */
        await BitGoSingleton.__init__();
        /* Init Mongo */
        await this.startDatabase();
    }

    verify(){
        //Display All and Confirm Running
        globals.log();
    }

    getCasinoContract(address, tokenAddress){
        return new CasinoContract({
            web3 : this.web3,
            contractDeployed : interfaces.casino,
            erc20TokenContract : tokenAddress,
            contractAddress : address
        })
    }

    getERC20Contract(tokenAddress){
        let erc20Contract = new ERC20TokenContract({
            web3 : this.web3,
            contractAddress : tokenAddress,
            accountPrivateKey : ETH_NETWORK.keys.home,
        });

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

    
    set(item, value){
        Object.defineProperty(this, item, value);
    }

    get(item){
        if( Object.getOwnPropertyDescriptor(this, item) ) {
            return this.mongo[item];
        }else{
            throw new Error("Key does not exist");
        }
    }
    
    log(){
        Logger.info(`ETH`, `${ETH_NET_NAME}`);
        Logger.info(`IP`, `${IPRunning()}`);
    }

    async startDatabase(){
        // Main DB
        this.main_db = new Mongoose();
        this.main_db.set('useFindAndModify', false);
        await this.main_db.connect(`${MONGO_CONNECTION_STRING}/main?ssl=true&authSource=admin&retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
        this.main_db.set('maxTimeMS', !TIMEOUT_MONGO_MS ? (15*1000) : (TIMEOUT_MONGO_MS*1000));
        this.main_db.Promise = bluebird;
        // Ecosystem DB
        this.ecosystem_db = new Mongoose();
        this.ecosystem_db.set('useFindAndModify', false);
        await this.ecosystem_db.connect(`${MONGO_CONNECTION_STRING}/ecosystem?ssl=true&authSource=admin&retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
        this.ecosystem_db.set('maxTimeMS', !TIMEOUT_MONGO_MS ? (15*1000) : (TIMEOUT_MONGO_MS*1000));
        this.ecosystem_db.Promise = bluebird;
        // Redis DB
        this.redis_db = new Mongoose();
        this.redis_db.set('useFindAndModify', false);
        await this.redis_db.connect(`${MONGO_CONNECTION_STRING}/redis?ssl=true&authSource=admin&retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
        this.redis_db.set('maxTimeMS', !TIMEOUT_MONGO_MS ? (15*1000) : (TIMEOUT_MONGO_MS*1000));
        this.redis_db.Promise = bluebird;
        // Main DB
        this.default = new Mongoose();
        this.default.Promise = bluebird;
        return true;
        
    }
}

let globals = new Globals(); // Singleton

export {
    globals
}
