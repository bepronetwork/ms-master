import account from "../../logic/eth/models/account";
import { globalsTest } from "../../GlobalsTest";

const detectValidationErrors = (res) => {
    if(res.message == 'Validation errors'){
        return res.errors[0];
    }else{
        return null;
    }
}

const generateEthAccountWithTokensAndEthereum = async ({tokenAddress, tokenAmount, ETHAmount, decimals}) => {

    let acc = new account(global.web3, global.web3.eth.accounts.create());
    let erc20Contract = globalsTest.getERC20Contract(tokenAddress);
    //Transfer Tokens
    await erc20Contract.transferTokenAmount({fromAccount : global.masterAccount, toAddress : acc.getAddress(), tokenAmount : tokenAmount, decimals : decimals});
    //Transfer Ethereum
    await global.masterAccount.sendEther(ETHAmount, acc.getAddress());
    return acc;
}

export {
    detectValidationErrors,
    generateEthAccountWithTokensAndEthereum
}