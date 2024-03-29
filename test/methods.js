import request from 'supertest';
import _ from 'lodash';
import account from './logic/eth/models/account';
import CasinoContract from './logic/eth/CasinoContract';
import { globalsTest } from './GlobalsTest';
import Numbers from './logic/services/numbers';

module.exports = {
    async kycWebhook(params) {
        return request(global.server)
        .post('/api/app/kyc_webhook')
        .send(params)
        .then(res => detectServerError(res))
    },
    async registerUser(params) {
        return request(global.server)
        .post('/api/users/register')
        .send(params)
        .then(res => detectServerError(res))
    },
    async resendEmail(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/users/email/resend')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => detectServerError(res))
    },
    async modifyBalance(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/balance/modify')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => detectServerError(res))
    },
    async confirmEmail(params) {
        return request(global.server)
        .post('/api/users/email/confirm')
        .send(params)
        .then(res => detectServerError(res))
    },
    async registerAdmin(params) {
        return request(global.server)
        .post('/api/admins/register')
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAdmin(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/admins/add')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => detectServerError(res))
    },
    async getPotJackpot(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/users/jackpot/pot')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAddonJackpot(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/jackpot/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editVirtualCurrency(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/wallet/virtualCurrency/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editApp(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editKycNeeded(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/user/kyc_needed/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editKycIntegration(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/integrations/kyc/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addLanguage(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/customization/language/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editLanguage(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/customization/language/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getDeposit(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/deposit/get')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editCripsrIntegration(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/integrations/cripsr/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editMoonPayIntegration(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/integrations/moonpay/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAnalyticsKey(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/analytics/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getSkinEcosystem(params) {
        return request(global.server)
        .get('/api/app/skinEcosystem/get')
        .send(params)
        .then(res => detectServerError(res))
    },
    async getLanguagesEcosystem(params) {
        return request(global.server)
        .get('/api/app/languageEcosystem/get')
        .send(params)
        .then(res => detectServerError(res))
    },
    async editSkin(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/customization/skin')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async convertPoints(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/convert/points')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editIcons(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/customization/icons')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editProvider(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/provider/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async createProvider(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/provider/create')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getBetInfo(params) {
        return request(global.server)
        .post('/api/app/bet/get')
        .send(params)
        .then(res => detectServerError(res))
    },
    async editFreeCurrency(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/freeCurrency/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getFreeCurrency(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/freeCurrency/get')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAddonFreeCurrency(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/freeCurrency/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAddonBalance(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/balance/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAddonAutoWithdraw(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/autoWithdraw/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAddonAutoWithdraw(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/autoWithdraw/editAutoWithdraw')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAddonTxFee(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/txFee/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAddonPointSystem(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/pointSystem/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAddonPointSystem(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/pointSystem/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAddonTxFee(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/txFee/editTxFee')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getGameStats(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/game/stats')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async addAddonDepositBonus(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/depositBonus/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAddonDepositBonus(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/depositBonus/editDepositBonus')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAddonBalance(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/balance/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editEdgeJackpot(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/jackpot/edge/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAdminType(params, bearerToken, payload){
        return request(global.server)
        .post('/api/admins/editType')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async loginAdmin(params) {
        return request(global.server)
        .post('/api/admins/login')
        .send(params)
        .then(res => detectServerError(res))
    },
    async pingPusher(params) {
        return request(global.server)
        .post('/api/users/pusher/ping')
        .send(params)
        .then(res => detectServerError(res))
    },
    async loginUser(params) {
        return request(global.server)
        .post('/api/users/login')
        .send(params)
        .then(res => detectServerError(res))
    },
    async getPushNotificationsChannel(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/users/push/auth')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => detectServerError(res))
    },
    async authAdmin(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/admins/auth')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => detectServerError(res))
        
    },

    async deployApp(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/deploy')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => detectServerError(res))
        
    },

    async loginAdmin2FA(params) {
        return request(global.server)
        .post('/api/admins/login/2fa')
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async setAdmin2FA(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/admins/2fa/set')
        .set("authorization", "Bearer " + bearerToken).set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async authUser(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/users/auth')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .set("payload", getPayloadString(payload))
        .then(res => detectServerError(res))
        
    },
    async loginUser2FA(params) {
        return request(global.server)
        .post('/api/users/login/2fa')
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async setUser2FA(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/users/2fa/set')
        .set("authorization", "Bearer " + bearerToken).set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getDepositAddress(params){
        return request(global.server)
        .post(`/api/app/address/get`)
        .send(params)
        .then(res => detectServerError(res))
    },
    async registerApp(params) {
        return request(global.server)
        .post('/api/app/create')
        .send(params)
        .then(res => detectServerError(res))
    },
    async editRestrictedCountries(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/restrictedCountries/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getAdminByApp(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/admin/app/get')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getApp(params) {
        return request(global.server)
        .post('/api/app/get')
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getAppAuth(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/get/auth')
        .set("authorization", "Bearer " + bearerToken).set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getUserAuth(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/users/auth')
        .set("authorization", "Bearer " + bearerToken).set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getGames(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/games/getAll')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async setAppMaxWithdraw(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/withdraw/max/set')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async setAppMinWithdraw(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/withdraw/min/set')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async setAffiliateMinWithdraw(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/affiliate/withdraw/min/set')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getAppSummary(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/summary')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async addAppServices(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/services/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async addCurrencyWalletToApp(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/wallet/currency/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async generateAddresses(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/address/generate')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
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
        .then(res => detectServerError(res))
        
    },
    async getAppLastBets(params) {
        return request(global.server)
        .post('/api/app/lastBets')
        .send(params)
        .then(res => detectServerError(res))
    },
    async getAppBiggestBetWinners(params) {
        return request(global.server)
        .post('/api/app/biggestBetWinners')
        .send(params)
        .then(res => detectServerError(res))
    },
    async getAppBiggestUserWinners(params) {
        return request(global.server)
        .post('/api/app/biggestUserWinners')
        .send(params)
        .then(res => detectServerError(res))
    },
    async resetPassword(params) {
        return request(global.server)
        .post('/api/users/password/reset/ask')
        .send(params)
        .then(res => detectServerError(res))
    },
    async setPassword(params) {
        return request(global.server)
        .post('/api/users/password/reset/set')
        .send(params)
        .then(res => detectServerError(res))
    },
    async resetAdminPassword(params) {
        return request(global.server)
        .post('/api/admins/password/reset/ask')
        .send(params)
        .then(res => detectServerError(res))
    },
    async setAdminPassword(params) {
        return request(global.server)
        .post('/api/admins/password/reset/set')
        .send(params)
        .then(res => detectServerError(res))
    },
    async getAppPopularNumbers(params) {
        return request(global.server)
        .post('/api/app/popularNumbers')
        .send(params)
        .then(res => detectServerError(res))
    },
    async getUserInfo(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/user/get')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getAppUsers(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/users')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getAppUsersBets(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/app/get/users/bets')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))  
    },
    async getUserBetsByPipeline(params, bearerToken, payload){
        return request(global.server)
        .post('/api/users/get/bets')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async createGame(params, bearerToken){
        return request(global.server)
        .post('/api/app/games/add')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getUserBets(params, bearerToken, payload){
        return request(global.server)
        .post('/api/users/bets')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async createEvent(params, bearerToken){
        return request(global.server)
        .post('/api/app/events/add')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async placeBet(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/bet/place')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res)) 
    },
    async setMaxBet(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/bet/max')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res)) 
    },
    async pingPost(params, bearerToken, payload){
        return request(global.server)
        .post('/api/status/post')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async pingPostMiddleware(params, bearerToken, payload){
        return request(global.server)
        .post('/api/status/post')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => res)
    },
    async editTableLimit(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/editTableLimit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async editGameEdge(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/editEdge')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editVideogameEdge(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/videogames/editEdge')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editGameImage(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/editImage')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async getLogs(params, bearerToken, payload) {
        return request(global.server)
        .post('/api/logs/get')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editGameBackgroundImage(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/editBackgroundImage')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editTopBarCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/topBar')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editBannersCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/banners')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editEsportsScrennerCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/esportsScrenner')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editSubSectionsCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/subSections')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editBackgroundCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/background')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editTopTabCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/topTab')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editSocialLinkCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/socialLink')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editLogoCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/logo')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editColorsCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/colors')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editFooterCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/footer')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editTopIconCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/topIcon')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editLoadingGifCustomizationApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/loadingGif')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editTypographyApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/typography')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => { return res.body})
    },
    async editThemeApp(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/customization/theme')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => { return res.body})
    },
    async editAppIntegration(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/integrations/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAppMailSenderIntegration(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/integrations/mailSender/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async resolveEvent(params, bearerToken){
        return request(global.server)
        .post('/api/app/games/events/resolve')
        .set("authorization", "Bearer " + bearerToken)
        .send(params)
        .then(res => detectServerError(res))
    },
    async webhookConfirmDepositFromBitgo(params, id, currency_id){
        return request(global.server)
        .post(`/api/app/webhookBitgoDeposit?id=${id}&currency=${currency_id}`)
        .send(params)
        .then(res => detectServerError(res))
    },
    async setAppMaxDeposit(params, bearerToken, payload){
        return request(global.server)
        .post('/api/deposit/max/set')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async updateUserWallet(params, id, app_id, currency_id){
        return request(global.server)
        .post(`/api/users/updateWallet?id=${id}&app=${app_id}&currency=${currency_id}`)
        .send(params)
        .then(res => detectServerError(res))
    },
    async getEcosystemData(params){
        return request(global.server)
        .get('/api/ecosystem/all')
        .send(params)
        .then(res => detectServerError(res))
        
    },
    async getEcosystemCasinoGames(params){
        return request(global.server)
        .get('/api/ecosystem/games/casino')
        .send(params)
        .then(res => detectServerError(res))
    },
    async addGame(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/games/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async editAffiliateStructure(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/affiliate/edit')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
    },
    async setCustomAffiliateStructureToUser(params, bearerToken, payload){
        return request(global.server)
        .post('/api/app/affiliate/custom/add')
        .set("authorization", "Bearer " + bearerToken)
        .set("payload", getPayloadString(payload))
        .send(params)
        .then(res => detectServerError(res))
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
            throw err;
        }
    },
    async directDepositUser({amount, platformAddress, tokenAddress, nonce, acc=null}){
        try{
            let erc20Contract = globalsTest.getERC20Contract(tokenAddress);

            let casinoContract = new CasinoContract({
                web3 : global.web3,
                account : acc ? acc : global.userAccount,
                erc20TokenContract : erc20Contract,
                contractAddress: platformAddress,
                decimals: 18
            })
            let amountWithDecimals = Numbers.toSmartContractDecimals(amount, 18);

            /* Deposit Tokens Directly */
            return await casinoContract.sendTokensToCasinoContract(amountWithDecimals);

        }catch(err){
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


function detectServerError(res){
    if(res.body && !_.isEmpty(res.body)){
        // Nothing
    }else{
        //Error on Server that does not show on testing since mocha hides server logs sometimes 
        console.log(res.error);
    }

    return res.body;
}