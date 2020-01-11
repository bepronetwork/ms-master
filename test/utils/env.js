import { generateEthAccountWithTokensAndEthereum, fundEthAccountWithTokensAndEthereum } from "./eth";

export async function createEthAccount({ethAmount, tokenAmount}){
    /* Create User Address and give it ETH */
    var eth_account = await generateEthAccountWithTokensAndEthereum({ETHAmount : ethAmount, tokenAmount : tokenAmount});
    return eth_account;
}


export async function provideFunds({account, ethAmount, tokenAmount, erc20Address}){
    /* Create User Address and give it ETH */
    return await fundEthAccountWithTokensAndEthereum({account, ethAmount ,tokenAmount, erc20Address});
}

