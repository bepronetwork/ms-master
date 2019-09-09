import {
    casino
} from "./interfaces";
import contract from "./models/contract";
import { fromBigNumberToInteger, fromDecimals, fromExponential } from "../services/services";
import ERC20TokenContract from "./ERC20Contract";

import Numbers from "../services/numbers";
let self;

class CasinoContract{

    constructor(params){
        try{
            let erc20TokenContract =  
                params.erc20TokenContract ? params.erc20TokenContract : 
                    new ERC20TokenContract({
                        web3 : params.web3,
                        contractAddress : params.tokenAddress
                    });

            self = {
                contract : 
                new contract({
                    web3 : params.web3,
                    contract : casino, 
                    address : params.contractAddress,
                    tokenTransferAmount : params.tokenTransferAmount
                }),
                erc20TokenContract,
                ...params
            }
        }catch(err){console.log(err)}
      
    }

      /**
     * @constructor Starting Function
     */

    async __init__(){
        try{
            let contractDepolyed = await this.deploy();
            let response = await this.sendTokensToCasinoContract(self.tokenTransferAmount);
            this.__assert(contractDepolyed);
            return {
                amount : self.tokenAddress,
                transactionHash : response.transactionHash
            };
        }catch(err){
            console.log(err)
        }
    }
    
    isAuthorized = async (address) => {
        try{
            return await self.contract.getContract().methods.authorized(address).call();
        }catch(err){
            console.log(err);
        }   
    }

    __assert(){
        self.contract.use(
            casino,
            self.contractAddress
        );
    }


    async getWithdrawalTimeLimit(){
        try{
            return Numbers.fromSmartContractTimeToMinutes(await self.contract.getContract().methods.releaseTime().call());
        }catch(err){
            console.log(err)
            return 'N/A';
        }
    }

    async getApprovedWithdrawAmount({address, decimals=self.decimals}){
        try{
            let res = await self.contract.getContract().methods.withdrawals(address).call();
            if(!res || (parseFloat(res) == 0)){
                return 0;
            }else{
                return Numbers.toFloat(Numbers.fromDecimals(res.amount, decimals))
            }
        }catch(err){
            throw err;
        }
    }

    async getHouseBalance(){
        try{
            let playersTokenAmount = await this.getPlayersBalance();
            let houseAmount = await this.getTotalLiquidity();
            return houseAmount - playersTokenAmount;
        }catch(err){
            return 'N/A';
        }
    }

    async getUserBalance(address){
        try{
            return fromBigNumberToInteger(await self.contract.getContract().methods.balances(address).call());
        }catch(err){
            console.log(err);
            return 'N/A';
        }
    }

    async getPlayersBalance(){
        try{
            return fromBigNumberToInteger(await self.contract.getContract().methods.totalPlayerBalance().call());
        }catch(err){
            console.log(err);
            return 'N/A';
        }
    }


    async getMaxDeposit(){
        try{
            return fromBigNumberToInteger(await self.contract.getContract().methods.maxDeposit().call());
        }catch(err){
            console.log(err);
            return 'N/A';
        }
    }
    async getTotalLiquidity(){
        try{
            return fromBigNumberToInteger(await self.erc20TokenContract.getTokenAmount(this.getAddress()));
        }catch(err){
            console.log(err);
            return 'N/A';
        }
    }

    getAddress(){
        return self.contractAddress;
    }

    async isPaused(){
        try{
            return await self.contract.getContract().methods.paused().call();
        }catch(err){
            return 'N/A';
        }
    }

}



export default CasinoContract;