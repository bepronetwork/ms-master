import Numbers from "../logic/services/numbers";
import CasinoContract from "../logic/eth/CasinoContract";
import CasinoContractETH from '../logic/eth/CasinoContractETH';
import account from "../logic/eth/models/account";
import { globalsTest } from "../GlobalsTest";

export async function getUserSignature({clientAccount, winBalance, nonce, category, decimals}){
    
    let message =  globalsTest.web3.utils.soliditySha3(
        {type: 'int128', value :  Numbers.fromExponential(Numbers.toSmartContractDecimals(winBalance, decimals))},
        {type: 'uint128', value: nonce},
        {type: 'uint8', value: category}
    );

    let response = clientAccount.getAccount().sign(message, clientAccount.getPrivateKey());

    return {
        signature : response,
        nonce,
        category,
        address : clientAccount.getAddress()
    };
}
  

export async function generateEthAccountWithTokensAndEthereum({tokenAmount, ETHAmount}){
    let acc = await generateEthAccount();
    let erc20Contract = globalsTest.getERC20Contract(global.CONSTANTS.erc20Address);
    //Transfer Tokens
    await erc20Contract.transferTokenAmount({fromAccount : global.masterAccount, toAddress : acc.getAddress(), tokenAmount : tokenAmount, decimals : globalsTest.constants.tokenDecimals});
    //Transfer Ethereum
    await global.masterAccount.sendEther(ETHAmount, acc.getAddress());
    return acc;
}

export async function fundEthAccountWithTokensAndEthereum({account, ethAmount, tokenAmount}){
    let erc20Contract = globalsTest.getERC20Contract(global.CONSTANTS.erc20Address);
    //Transfer Tokens
    await erc20Contract.transferTokenAmount({fromAccount : global.masterAccount, toAddress : account.getAddress(), tokenAmount : tokenAmount, decimals : globalsTest.constants.tokenDecimals});
    //Transfer Ethereum
    await global.masterAccount.sendEther(ethAmount, account.getAddress());
    return account;
}

export async function generateEthAccount(){
    let acc = new account(globalsTest.web3, globalsTest.web3.eth.accounts.create());
    return acc;
}

export async function deploySmartContract({eth_account, tokenAddress, decimals}){
    try{
        let erc20Contract = globalsTest.getERC20Contract(tokenAddress);

        let casino = new CasinoContract({
            web3 : global.web3,
            account : eth_account,
            erc20TokenContract : erc20Contract,
            decimals : decimals
        })
       
        let res = await casino.__init__();
        return {    
            casino : casino,
            platformTokenAddress    : global.CONSTANTS.erc20Address,
            transactionHash         : res.transactionHash,
            platformAddress         : casino.getAddress()
        };
        
    }catch(err){
        console.log(err)
        return false;
    }
}


export async function deploySmartContractETH({eth_account, decimals}){
    try{
        let casino = new CasinoContractETH({
            web3 : global.web3,
            account : eth_account
        })
       
        let res = await casino.__init__();
        return {    
            casino : casino,
            transactionHash         : res.transactionHash,
            platformAddress         : casino.getAddress()
        };
        
    }catch(err){
        console.log(err)
        return false;
    }
}

export async function userDepositToContract({eth_account, platformAddress, tokenAmount}){
    try{
        let erc20Contract = globalsTest.getERC20Contract(global.CONSTANTS.erc20Address);

        let casinoContract = new CasinoContract({
            web3 : global.web3,
            account : eth_account,
            erc20TokenContract : erc20Contract,
            contractAddress: platformAddress,
            decimals : globalsTest.constants.tokenDecimals,
        })
       
        /* Deposit Tokens */
        return await casinoContract.depositFunds({amount : tokenAmount});

    }catch(err){
        throw err;
    }
}


export async function appDepositToContract({casinoContract, tokenAmount}){
    try{        
        return await casinoContract.sendTokensToCasinoContract(tokenAmount);
    }catch(err){
        console.log(err);
        return err;
    }
}

export async function appWithdrawFromContract({casinoContract, account, address, tokenAmount}){
    try{        
        return await casinoContract.withdrawApp({ receiverAddress : address, account, amount : tokenAmount });
    }catch(err){
        return false
    }
}

