import chai from 'chai';
import Numbers from '../../src/logic/services/numbers';
const expect = chai.expect;


export async function digestBetResult({newBalance, res, previousBalance, edge, previousBalanceApp, newBalanceApp}){
    const { winAmount, betAmount, fee, isWon, outcomeResultSpace, result, user_delta, app_delta, jackpotAmount, totalBetAmount } = res.data.message;
    console.log(winAmount, isWon, user_delta, newBalance, previousBalance)
    if(isWon){
        /* Verify if Fee is right */
        expect(Numbers.toFormatBet(fee)).to.be.equal(Numbers.toFormatBet(totalBetAmount*(edge/100)))
        /* Verify if Jackpot Value is right */
        expect(Numbers.toFormatBet(totalBetAmount)).to.be.equal(Numbers.toFormatBet(betAmount + jackpotAmount + fee ))
        /* Verify if WinAmount is ight Value is right */
        expect(winAmount).to.be.greaterThan(0)
        // Confirm delta is positive
        expect(user_delta).to.be.greaterThan(0);
        // Confirm New User Balance is equal to previous plus delta
        expect(Numbers.toFormatBet(newBalance)).to.be.equal(Numbers.toFormatBet(previousBalance+user_delta));

    }else{
        // Confirm delta is negative
        expect(Numbers.toFormatBet(user_delta)).to.be.equal(Numbers.toFormatBet(-betAmount));
        // Confirm Win Amount is 0
        expect(winAmount).to.be.equal(0);
    }

    // Confirm app and user deltas are opposite
    expect(Numbers.toFormatBet(app_delta)).to.be.equal(Numbers.toFormatBet(-user_delta));
    // Confirm New User Balance is equal to previous plus delta
    expect(Numbers.toFormatBet(newBalance)).to.be.equal(Numbers.toFormatBet(previousBalance+user_delta));
    // Confim balance of App to be the diff
    expect(Numbers.toFormatBet(newBalanceApp)).to.be.equal(Numbers.toFormatBet(previousBalanceApp+app_delta));

    return true;
}

export async function getUserAuth({username, password, app}){
    let res = await loginUser({username, password, app});
    detectValidationErrors(res);
    let USER_BEARER_TOKEN = res.data.message.bearerToken;
    let USER_ID = res.data.message.id;
    let USER_ADDRESS = res.data.message.address;
    let WITHDRAWS = res.data.message.withdraws;
    let USER_BALANCE = res.data.message.wallet.playBalance;
    return { USER_ID, USER_BEARER_TOKEN, USER_BALANCE, USER_ADDRESS, WITHDRAWS };
}

export async function getWithdrawAmount({casinoContract, address, decimals}){
    return await casinoContract.getApprovedWithdrawAmount({address, decimals});
} 

export async function getAllContractLiquidity({casinoContract}){
    return await casinoContract.getTotalLiquidity();
} 
