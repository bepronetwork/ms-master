import { globalsTest } from "../GlobalsTest";
import Numbers from "../logic/services/numbers";

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
  