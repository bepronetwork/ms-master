import {AppLogic} from '../logic';
import ModelComponent from './modelComponent';
import {AppRepository} from '../db/repos';
import Wallet from './wallet';
import { MapperSingleton } from '../controllers/Mapper/Mapper';
import { MapperWalletSingleton } from '../controllers/Mapper/App/MapperWalletTransaction';
import { MapperAddGamesSingleton } from '../controllers/Mapper/App/MapperAddGames';
import { MapperAddBlockchainSingleton } from '../controllers/Mapper/App/MapperAddBlockchain'
import { AffiliateSetup, Integrations, Customization, Typography } from '.';
// const saveOutputTest = require('../../test/outputTest/configOutput')

class App extends ModelComponent{

    constructor(params){

        let db = new AppRepository();

        super(
            {
                name : 'App', 
                logic : new AppLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : [
                    new AffiliateSetup({...params, 
                        structures : [
                            {
                                level : 1,
                                percentageOnLoss : 0.02
                            }
                        ]
                    }),
                    new Integrations(params),
                    new Customization(params),
                    new Typography(params)
                ]
            }
            );
    }
    
   
    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    
    async register(){
        try{
            let app =  await this.process('Register');
            console.log("register::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`register`,app);
            return MapperSingleton.output('App', app);
        }catch(err){
            throw err;
        }
    }

      /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    
    async get(){
        try{
            let app =  await this.process('Get');
            console.log("Get::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`Get`,app);
            return MapperSingleton.output('App', app._doc);
        }catch(err){
            throw err;
        }
    }


      /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    
    async getAuth(){
        try{
            let app =  await this.process('Get');
            console.log("GetAuth::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetAuth`,app);
            return MapperSingleton.output('AppAuth', app._doc);
        }catch(err){
            throw err;
        }
    }

   /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async summary(){
        try{
            let app = await this.process('Summary');
            console.log("Summary::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`Summary`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async deployApp(){
        try{
            let app = await this.process('DeployApp');
            console.log("DeployApp::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`DeployApp`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async getGames(){
        try{
            let app = await this.process('GetGames');
            console.log("GetGames::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetGames`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async addServices(){
        try{
            let app = await this.process('AddServices');
            console.log("AddServices::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`AddServices`,app);
            return app;
        }catch(err){
            throw err;
        }
    }


     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async addGame(){
        try{
            let app = await this.process('AddGame');
            console.log("AddGame::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`AddGame`,app);
            return MapperAddGamesSingleton.output('AddGames', app);
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async addCurrencyWallet(){
        try{
            let app = await this.process('AddCurrencyWallet');
            console.log("AddCurrencyWallet::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`AddCurrencyWallet`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

    
     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async getTransactions(){
        try{
            let app = await this.process('GetTransactions');
            console.log("GetTransactions::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetTransactions`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

      /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async getLastBets(){
        try{
            let app = await this.process('GetLastBets');
            console.log("GetLastBets::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetLastBets`,app);
            return app;
        }catch(err){
            throw err;
        }
    }


      /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async getBiggestBetWinners(){
        try{
            let app = await this.process('GetBiggestBetWinners');
            console.log("GetBiggestBetWinners::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetBiggestBetWinners`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

       /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async getBiggestUserWinners(){
        try{
            let app = await this.process('GetBiggestUserWinners');
            console.log("GetBiggestUserWinners::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetBiggestUserWinners`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

       /**
     * @param {String}  
     * @return {bool || Exception}  
     */

    async getPopularNumbers(){
        try{
            let app = await this.process('GetPopularNumbers');
            console.log("GetPopularNumbers::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetPopularNumbers`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     
     /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editGameTableLimit(){
        try{
            let app = await this.process('EditGameTableLimit');
            console.log("EditGameTableLimit::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditGameTableLimit`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editGameEdge(){
        try{
            let app = await this.process('EditGameEdge');
            console.log("EditGameEdge::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditGameEdge`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

     
    async editGameImage(){
        try {
            let app = await this.process('EditGameImage');
            console.log("EditGameImage::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditGameImage`,app);
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

     
    async editGameBackgroundImage(){
        try {
            let app = await this.process('EditGameBackgroundImage');
            console.log("EditGameBackgroundImage::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditGameBackgroundImage`,app);
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editAffiliateStructure(){
        try{
            let app = await this.process('EditAffiliateStructure');
            console.log("EditAffiliateStructure::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditAffiliateStructure`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

      /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editIntegration(){
        try{
            let app = await this.process('EditIntegration');
            console.log("EditIntegration::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditIntegration`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editMailSenderIntegration(){
        try{
            let app = await this.process('EditMailSenderIntegration');
            console.log("EditMailSenderIntegration::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditMailSenderIntegration`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editTopBar(){
        try{
            let app = await this.process('EditTopBar');
            console.log("EditTopBar::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditTopBar`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editBanners(){
        try{
            let app = await this.process('EditBanners');
            console.log("EditBanners::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditBanners`,app);
            return app;
        }catch(err){
            throw err;
        }
    }


     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editLogo(){
        try{
            let app = await this.process('EditLogo');
            console.log("EditLogo::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditLogo`,app);
            return app;
        }catch(err){
            throw err;
        }
    }


     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editColors(){
        try{
            let app = await this.process('EditColors');
            console.log("EditColors::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditColors`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editFooter(){
        try{
            let app = await this.process('EditFooter');
            console.log("EditFooter::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditFooter`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editTopIcon(){
        try{
            let app = await this.process('EditTopIcon');
            console.log("EditTopIcon::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditTopIcon`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editLoadingGif(){
        try{
            let app = await this.process('EditLoadingGif');
            console.log("EditLoadingGif::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditLoadingGif`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editTypography(){
        try{
            let app = await this.process('EditTypography');
            console.log("EditTypography::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`EditTypography`,app);
            return app;
        }catch(err){
            throw err;
        }
    }

     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async getUsers(){
        try{
            let app = await this.process('GetUsers');
            console.log("GetUsers::: ", app)
            // saveOutputTest.saveOutputTest(`AppTest`,`GetUsers`,app);
            return app;
        }catch(err){
            throw err;
        }
    }


     /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async updateWallet(){
        const { app } = this.self.params;
        try{
            let res = await this.process('UpdateWallet');
            console.log("UpdateWallet::: ", res)
            // saveOutputTest.saveOutputTest(`AppTest`,`UpdateWallet`,res);
            return MapperWalletSingleton.output('WalletTransaction', res);
        }catch(err){
            throw err;
        }
    }
}

export default App;
