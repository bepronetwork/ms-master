import {AppLogic} from '../logic';
import ModelComponent from './modelComponent';
import {AppRepository} from '../db/repos';
import Wallet from './wallet';
import { MapperSingleton } from '../controllers/Mapper/Mapper';
import { MapperWalletSingleton } from '../controllers/Mapper/App/MapperWalletTransaction';
import { MapperAddGamesSingleton } from '../controllers/Mapper/App/MapperAddGames';
import { MapperAddBlockchainSingleton } from '../controllers/Mapper/App/MapperAddBlockchain'
import { AffiliateSetup, Integrations, Customization, Typography } from '.';

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
            return await this.process('Summary');
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
            return await this.process('DeployApp');
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
            return app;
        }catch(err){
            throw err;
        }
    }
    
    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async createAPIToken(){
        try{
            let app = await this.process('CreateAPIToken');
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
            return await this.process('AddCurrencyWallet');
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
            return await this.process('GetLastBets');
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
            return await this.process('GetBiggestBetWinners');
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
            return await this.process('GetBiggestUserWinners');
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
            return await this.process('GetPopularNumbers');
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
            return await this.process('EditGameTableLimit');
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
            return await this.process('EditGameEdge');
        }catch(err){
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editAffiliateStructure(){
        try{
            return await this.process('EditAffiliateStructure');
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
            return await this.process('EditIntegration');
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
            return await this.process('EditMailSenderIntegration');
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
            return await this.process('EditTopBar');
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
            return await this.process('EditBanners');
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
            return await this.process('EditLogo');
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
            return await this.process('EditColors');
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
            return await this.process('EditFooter');
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
            return await this.process('EditTopIcon');
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
            return await this.process('EditLoadingGif');
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
            return await this.process('EditTypography');
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
            return await this.process('GetUsers');
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
            return MapperWalletSingleton.output('WalletTransaction', res);
        }catch(err){
            throw err;
        }
    }
}

export default App;
