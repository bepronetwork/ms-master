import request from 'supertest';
import _ from 'lodash';
import account from './logic/eth/models/account';
import CasinoContract from './logic/eth/CasinoContract';
import { globalsTest } from './GlobalsTest';

module.exports = {
    async registerUser(params) {
        return request(global.server)
        .post('/api/users/register')
        .send(params)
        .then(res => res.body)

    },
    async registerAdmin(params) {
        return request(global.server)
        .post('/api/admins/register')
        .send(params)
        .then(res => res.body)
        
    },
    async loginAdmin(params) {
        return request(global.server)
        .post('/api/admins/login')
        .send(params)
        .then(res => res.body)
        
    },
    async loginUser(params) {
        return request(global.server)
        .post('/api/users/login')
        .send(params)
        .then(res => res.body)

    },
    async authAdmin(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/admins/auth')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => res.body)
        
    },
    async loginAdmin2FA(params) {
        return request(global.server)
        .post('/api/admins/login/2fa')
        .send(params)
        .then(res => res.body)
        
    },
    async setAdmin2FA(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/admins/2fa/set')
        .set("authorization", "Bearer " + bearerToken).set("payload", getPayloadString(payload))
        .send(params)
        .then(res => res.body)
        
    },
    async registerApp(params) {
        return request(global.server)
        .post('/api/app/create').send(params)
        .then(res => {return res.body})
        
    },
    async getApp(params) {
        return request(global.server)
        .post('/api/app/get')
        .send(params)
        .then(res => res.body)
        
    },
    async getAppAuth(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/get/auth')
        .set("authorization", "Bearer " + bearerToken).set("payload", getPayloadString(payload))
        .send(params)
        .then(res => res.body)
        
    },
    async getGames(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/games/getAll')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => res.body)
        
    },
    async getAppSummary(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/summary')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => res.body)
        
    },
    async addAppServices(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/services/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => res.body)
        
    },
    async deposit(params, pk) {
        try{
            let acc = new account(global.web3, global.web3.eth.accounts.privateKeyToAccount(pk));
            let balance = await acc.getBalance();
            if(balance <= 0.001){ throw new Error('Not Enought Funds to do Tests on current ETH Address')}
            await acc.sendEther(0.001, params.address);
        }catch(err){
            throw err
        }
    },
    async getTransactions(params, bearerToken) {
        return request(global.server)
        .post('/api/app/transactions')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => {return res.body})
        
    },
    async getAppLastBets(params) {
        return request(global.server)
        .post('/api/app/lastBets')
        .send(params)
        .then(res => {return res.body})
    },
    async getAppBiggestBetWinners(params) {
        return request(global.server)
        .post('/api/app/biggestBetWinners')
        .send(params)
        .then(res => {return res.body})
    },
    async getAppBiggestUserWinners(params) {
        return request(global.server)
        .post('/api/app/biggestUserWinners')
        .send(params)
        .then(res => {return res.body})
    },
    async getAppPopularNumbers(params) {
        return request(global.server)
        .post('/api/app/popularNumbers')
        .send(params)
        .then(res => {return res.body})
    },
    async getUser(id, bearerToken) {
        return request(global.server)
        .post('/api/users/${id}/info')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => res.body)
        
    },
    async getAppUsers(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/users')
        .set("authorization", "Bearer " + bearerToken).set("payload", getPayloadString(payload))
        .send(params)
        .then(res => res.body)
        
    },
    async createGame(params, bearerToken){
        return request(global.server)
        .post('/api/app/games/add')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => {return res.body})
        
    },
    async getUserBets(params, bearerToken, payload){
        return request(global.server)
        .post('/api/users/bets')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async createEvent(params, bearerToken){
        return request(global.server)
        .post('/api/app/events/add')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => {return res.body})
        
    },
    async placeBet(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/bet/place')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async editTableLimit(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/editTableLimit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async editGameEdge(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/editEdge')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
    },
    async editTopBarCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/topBar')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
    },
    async editBannersCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/banners')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
    },
    async editAppIntegration(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/integrations/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async resolveEvent(params, bearerToken){
        return request(global.server)
        .post('/api/app/games/events/resolve')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => {return res.body})
        
    },
    async addBlockchainInformation(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/addBlockchainInformation/')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async updateAppWallet(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/updateWallet')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async updateUserWallet(params, bearerToken, payload){
        return request(global.server)
        .post('/api/users/updateWallet')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async requestWithdraw(params, bearerToken, payload){
        return request(global.server)
        .post('/api/users/requestWithdraw')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
        
    },
    async cancelAppWithdraw(params, bearerToken){
        return request(global.server)
        .post('/api/app/cancelWithdraw')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => {return res.body})
        
    },
    async requestAppWithdraw(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/requestWithdraw')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})    
    },

    async getEcosystemData(params){
        return request(global.server)
        .get('/api/ecosystem/all')
        .send(params)
        .then(res => {return res.body})
        
    },
    async getEcosystemCasinoGames(params){
        return request(global.server)
        .get('/api/ecosystem/games/casino')
        .send(params)
        .then(res => {return res.body})
    },
    async addGame(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
    },
    async editAffiliateStructure(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/affiliate/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => {return res.body})
    },
    async deployPlatformContract({tokenAddress, tokenAmount, maxDeposit, maxWithdrawal, decimals, authorizedAddress, acc=null}){
        try{
            let erc20Contract = globalsTest.getERC20Contract(tokenAddress);

            let casino = new CasinoContract({
                web3 : global.web3,
                authorizedAddress,
                account : acc ? acc : new account(global.web3, global.web3.eth.accounts.privateKeyToAccount(global.ownerAccount.getPrivateKey())), 
                erc20TokenContract : erc20Contract,
                decimals : decimals,
                tokenTransferAmount : tokenAmount
            })
           

            let res = await casino.__init__();
            await casino.setMaxWithdrawal(maxWithdrawal);
            await casino.setMaxDeposit(maxDeposit);

            return {    
                platformTokenAddress    : tokenAddress,
                transactionHash         : res.transactionHash,
                platformAddress         : casino.getAddress(),
                platformBlockchain      : 'eth',
                amount                  : res.amount,
                casinoContract          : casino
            };
            
        }catch(err){
            console.log(err)
            return false;
        }
    },
    async changeWithdrawalTimeApp({casinoContract, time}){
        try{
            await casinoContract.changeWithdrawalTimeLimit({time});
            return true
            
        }catch(err){
            console.log(err)
            return false;
        }
    },
    async depositUser({amount, platformAddress, tokenAddress, nonce, acc=null}){
        try{
            let erc20Contract = globalsTest.getERC20Contract(tokenAddress);

            let casinoContract = new CasinoContract({
                web3 : global.web3,
                account : acc ? acc : global.userAccount,
                erc20TokenContract : erc20Contract,
                contractAddress: platformAddress,
                decimals: 18
            })
           
            /* Deposit Tokens */
            return await casinoContract.depositFunds({
                amount,
                nonce : nonce
            });

        }catch(err){
            console.log(err)
            throw err;
        }
    },
    async withdrawApp({amount, platformAddress, tokenAddress,acc=null}){
        try{
            let erc20Contract = globalsTest.getERC20Contract(tokenAddress);

            let casinoContract = new CasinoContract({
                web3 : global.web3,
                account : acc ? acc : global.ownerAccount,
                erc20TokenContract : erc20Contract,
                contractAddress: platformAddress,
                decimals: 18
            })
           
            /* Deposit Tokens */
            return await casinoContract.withdrawApp({
                amount,
                receiverAddress : global.ownerAccount.getAddress()
            });

        }catch(err){
            console.log(err)
            throw err;
        }
    },
    async pauseContract({casinoContract}){
        try{
            await casinoContract.pauseContract();
            return true
            
        }catch(err){
            console.log(err)
            return false;
        }
    },
    async unpauseContract({casinoContract}){
        try{
            await casinoContract.unpauseContract();
            return true
            
        }catch(err){
            console.log(err)
            return false;
        }
    },
    async isPaused({casinoContract}){
        try{
            return await casinoContract.isPaused();
        }catch(err){
            console.log(err)
            return false;
        }
    },
};




function getPayloadString(payloadObject){
    if(!payloadObject){return null}
    return JSON.stringify({ id : payloadObject.id })
}

