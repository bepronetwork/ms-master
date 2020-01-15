import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { getAppAuth, updateUserWallet, getUserAuth } from '../../../methods';
import { get_app } from '../../../models/apps';
import { globalsTest } from '../../../GlobalsTest';
import { generateEthAccountWithTokensAndEthereum } from '../../../utils/eth';
import { getNonce } from '../../../lib';
import { shouldntUpdateWalletWithPendingTransaction } from '../../output/AppTestMethod'
const expect = chai.expect;
const erc20Ticker = 'DAI';
const depositAmount = 4;
const ethDepositAmount = 0.002;

context(`ERC20 (${erc20Ticker})`, async () => {
    var app, user, currencyWallet, tx, eth_account, erc20Contract;

    before( async () =>  {
        app = (await getAppAuth(get_app(global.test.app.id), global.test.app.bearerToken, {id : global.test.app.id})).data.message;
        user = global.test.user;
        currencyWallet = app.wallet.find( w => new String(w.currency.ticker).toLowerCase() == new String(erc20Ticker).toLowerCase());
        eth_account = await generateEthAccountWithTokensAndEthereum({tokenAddress :  currencyWallet.currency.address, decimals : currencyWallet.currency.decimals, ETHAmount : ethDepositAmount, tokenAmount : depositAmount});
        erc20Contract = globalsTest.getERC20Contract(currencyWallet.currency.address);
    });

    it('should´nt update wallet with pending transaction', mochaAsync(async () => {
        /* Create Deposit App Transaction - Tokens Sent with not wrong token amount */ 
        tx = await new Promise( async  (resolve, reject) => {
            try{
                await erc20Contract.transferTokenAmount(
                    {   
                        fromAccount : eth_account, 
                        toAddress : currencyWallet.bank_address, 
                        tokenAmount : depositAmount,
                        decimals : currencyWallet.currency.decimals, 
                        options : { gasPrice : 1, gas : 23592 },
                        callback :  async ({transactionHash}) => {
                            resolve(transactionHash);
                        }
                    });
            }catch(err){reject(err)}
        });

        const postData = {
            app : app.id,
            amount : depositAmount,
            nonce : getNonce(),
            transactionHash : tx,
            user : user.id,
            currency : currencyWallet.currency._id
        }

        let res = await updateUserWallet(postData, user.bearerToken, {id : user.id});
        detectValidationErrors(res);
        shouldntUpdateWalletWithPendingTransaction(res.data, expect);
    })); 
    
    it('should update Wallet with verified transaction', mochaAsync(async () => {
        let tx = await erc20Contract.transferTokenAmount(
            {   
                fromAccount : eth_account, 
                toAddress : currencyWallet.bank_address, 
                tokenAmount : depositAmount,
                decimals : currencyWallet.currency.decimals, 
                options : {}
            });
    
        const postData = {
            app : app.id,
            amount : depositAmount,
            nonce : getNonce(),
            transactionHash : tx.transactionHash,
            user : user.id,
            currency : currencyWallet.currency._id
        }
        let res = updateUserWallet(postData, user.bearerToken, {id : user.id});
        let res_replay_atack = await updateUserWallet(postData,  user.bearerToken, {id : user.id});
        let ret = await Promise.resolve(await res);
        let status_1 = ret.data.status;
        const { status } = res_replay_atack.data;
        
        // Confirm either one or the other tx got phroibited
        if(status_1 == 200){
            expect(status_1).to.be.equal(200);
            expect(status).to.be.equal(14);
        }else{
            expect(status_1).to.be.equal(14);
            expect(status).to.be.equal(200);
        }

        let res_user = await getUserAuth({user : user.id}, user.bearerToken, {id : user.id});
        detectValidationErrors(res_user);
        global.test.user = res_user.data.message;
        
        const walletCurrencyUser = global.test.user.wallet.find( c => new String(c.currency.ticker).toLowerCase() == erc20Ticker.toLowerCase());
        expect(walletCurrencyUser.playBalance).to.be.equal(parseFloat(depositAmount));
    })); 
    
});
