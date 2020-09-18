import { AppLogic } from '../logic';
import ModelComponent from './modelComponent';
import { AppRepository } from '../db/repos';
import Wallet from './wallet';
import { AffiliateSetup, Integrations, Customization, Typography, AddOn } from '.';
import {
    MapperAddCurrencyWalletSingleton,
    MapperAddGameSingleton,
    MapperEditBannersSingleton,
    MapperEditSubSectionsSingleton,
    MapperEditColorsSingleton,
    MapperEditFooterSingleton,
    MapperEditGameBackgroundImageSingleton,
    MapperEditGameEdgeSingleton,
    MapperEditGameImageSingleton,
    MapperEditGameTableLimitSingleton,
    MapperEditLoadingGifSingleton,
    MapperEditLogoSingleton,
    MapperEditMailSenderIntegrationSingleton,
    MapperEditTopBarSingleton,
    MapperEditTopIconSingleton,
    MapperEditTypographySingleton,
    MapperGetSingleton,
    MapperGetAuthSingleton,
    MapperGetGamesSingleton,
    MapperGetUsersSingleton,
    MapperRegisterSingleton,
    MapperUpdateWalletSingleton,
    MapperaddAddonAutoWithdrawSingleton,
    MappereditAddonAutoWithdrawSingleton,
    MapperAppGetBetsSingleton,
    MapperSummaryBetsSingleton,
    MapperSummaryGamesSingleton,
    MapperSummaryRevenueSingleton,
    MapperSummaryUsersSingleton,
    MapperSummaryWalletSingleton,
    MapperGetLastBetsSingleton,
    MapperGetBiggetsBetWinnersSingleton,
    MapperGetBiggetsUserWinnersSingleton,
    MapperGetPopularNumbersSingleton,
    MapperGetLogsSingleton,
    MapperGetBetSingleton,
    MapperEditThemeSingleton,
    MapperEditBackgroundSingleton,
    MapperSummaryOneGamesSingleton
} from '../controllers/Mapper';
import { MapperaddAddonTxFeeSingleton, MapperEditAddonTxFeeSingleton, MapperEditAddonDepositBonusSingleton, MapperAddAddonDepositBonusSingleton } from '../controllers/Mapper/App';
import { MapperGenerateAddressSingleton } from '../controllers/Mapper/App/MapperGenerateAddresses';

class App extends ModelComponent {

    constructor(params) {

        let db = new AppRepository();

        super(
            {
                name: 'App',
                logic: new AppLogic({ db: db }),
                db: db,
                self: null,
                params: params,
                children: [
                    new AffiliateSetup({
                        ...params,
                        structures: [
                            {
                                level: 1,
                                percentageOnLoss: 0.02
                            }
                        ]
                    }),
                    new Integrations(params),
                    new Customization(params),
                    new Typography(params),
                    new AddOn(params)
                ]
            }
        );
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async register() {
        try {
            let app = await this.process('Register');
            /* If app is virtual - add virtual currency*/
            return MapperRegisterSingleton.output('Register', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */
    async kycWebhook() {
        // output Boolean
        try {
            let res = await this.process('KycWebhook');
            return res;
        } catch (err) {
            throw err;
        }
    }


    /**
    * @param {String} 
    * @return {bool || Exception}  
    */


    async modifyBalance() {
        // output Boolean
        try {
            let res = await this.process('ModifyBalance');
            return res;
        } catch (err) {
            throw err;
        }
    }


    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async getGameStats() {
        try {
            let app = await this.process('GetGameStats');
            return MapperSummaryOneGamesSingleton.output('SummaryOneGames', app);
        } catch (err) {
            throw err;
        }
    }


    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async getLogs() {
        try {
            let app = await this.process('GetLogs');
            return MapperGetLogsSingleton.output('GetLogs', app);
        } catch (err) {
            throw err;
        }
    }


    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async providerAuthorization() {
        try {
            return await this.process('ProviderAuthorization');
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async providerCredit() {
        try {
            return await this.process('ProviderCredit');
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async providerDebit() {
        try {
            return await this.process('ProviderDebit');
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async providerRollback() {
        try {
            return await this.process('ProviderRollback');
        } catch (err) {
            throw err;
        }
    }

    async providerBalance() {
        try {
            return await this.process('ProviderBalance');
        } catch (err) {
            throw err;
        }
    }

    /**
   * @param {String} 
   * @return {bool || Exception}  
   */

    async getBetInfo() {
        try {
            let app = await this.process('GetBetInfo');
            return MapperGetBetSingleton.output('GetBetInfo', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async get() {
        try {
            let app = await this.process('Get');
            return MapperGetSingleton.output('Get', app._doc);
        } catch (err) {
            throw err;
        }
    }

    /**
   * @param {String} 
   * @return {bool || Exception}  
   */
    async editRestrictedCountries() {
        try {
            let app = await this.process('EditRestrictedCountries');
            // output Boolean
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
  * @param {String} 
  * @return {bool || Exception}  
  */
    async editApp() {
        // output Boolean
        try {
            let app = await this.process('EditApp');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
   * @param {String} 
   * @return {bool || Exception}  
   */
    async editProvider() {
        try {
            let app = await this.process('EditProvider');
            // output Boolean
            return app;
        } catch (err) {
            throw err;
        }
    }


    /**
   * @param {String} 
   * @return {bool || Exception}  
   */


    async getAuth() {
        try {
            let app = await this.process('GetAuth');
            return MapperGetAuthSingleton.output('GetAuth', { ...app._doc, storeAddOn: app.storeAddOn });
        } catch (err) {
            throw err;
        }
    }

    /**
      * @param {String} 
      * @return {bool || Exception}  
      */

    async summary() {
        try {
            let app = await this.process('Summary');
            switch (app.type) {
                case 'users': return MapperSummaryUsersSingleton.output('SummaryUsers', app);
                case 'games': return MapperSummaryGamesSingleton.output('SummaryGames', app);
                case 'revenue': return MapperSummaryRevenueSingleton.output('SummaryRevenue', app);
                case 'bets': return MapperSummaryBetsSingleton.output('SummaryBets', app);
                case 'wallet': return MapperSummaryWalletSingleton.output('SummaryWallet', app);
                default: return app;
            }
        } catch (err) {
            throw err;
        }
    }

    async appGetUsersBets() {
        try {
            let app = await this.process('AppGetUsersBets');
            return MapperAppGetBetsSingleton.output('AppGetBets', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async deployApp() {
        // Output = Boolean
        try {
            let app = await this.process('DeployApp');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async getGames() {
        try {
            let app = await this.process('GetGames');
            return MapperGetGamesSingleton.output('GetGames', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async addServices() {
        // Output = Undefined
        try {
            let app = await this.process('AddServices');
            return app;
        } catch (err) {
            throw err;
        }
    }


    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async addGame() {
        try {
            let app = await this.process('AddGame');
            return MapperAddGameSingleton.output('AddGame', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async addAddonJackpot() {
        // Output = Boolean
        try {
            let app = await this.process('addAddonJackpot');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async addAddonBalance() {
        // Output = Boolean
        try {
            let balance = await this.process('AddAddonBalance');
            return balance;
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async addAddonAutoWithdraw() {
        try {
            let app = await this.process('addAddonAutoWithdraw');
            return MapperaddAddonAutoWithdrawSingleton.output('addAddonAutoWithdraw', app._doc);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editAddonAutoWithdraw() {
        try {
            let app = await this.process('editAddonAutoWithdraw');
            return MappereditAddonAutoWithdrawSingleton.output('editAddonAutoWithdraw', app);
        } catch (err) {
            throw err;
        }
    }

    async addAddonTxFee() {
        try {
            let app = await this.process('AddAddonTxFee');
            return MapperaddAddonTxFeeSingleton.output('AddAddonTxFee', app._doc);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editAddonTxFee() {
        try {
            let app = await this.process('EditAddonTxFee');
            return MapperEditAddonTxFeeSingleton.output('EditAddonTxFee', app);
        } catch (err) {
            throw err;
        }
    }

    async addAddonDepositBonus() {
        try {
            let app = await this.process('AddAddonDepositBonus');
            return MapperAddAddonDepositBonusSingleton.output('AddAddonDepositBonus', app._doc);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */
    async addAddonPointSystem() {
        try {
            return await this.process('AddAddonPointSystem');
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editAddonDepositBonus() {
        try {
            let app = await this.process('EditAddonDepositBonus');
            return MapperEditAddonDepositBonusSingleton.output('EditAddonDepositBonus', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */
    async editAddonPointSystem() {
        try {
            return await this.process('EditAddonPointSystem');
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */
    async addCurrencyWallet() {
        try {
            let app = await this.process('AddCurrencyWallet');
            return MapperAddCurrencyWalletSingleton.output('AddCurrencyWallet', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */
    async convertPoints() {
        try {
            let app = await this.process('ConvertPoints');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */
    async generateAddresses() {

        const { app } = this.self.params;
        try {
            await AppRepository.prototype.changeWithdrawPosition(app, true);
            let res = await this.process('GenerateAddresses');
            AppRepository.prototype.changeWithdrawPosition(app, false);
            return MapperGenerateAddressSingleton.output('GenerateAddresses', res);
        } catch (err) {
            if (parseInt(err.code) != 14) {
                /* If not betting/withdrawing atm */
                /* Open Mutex */
                AppRepository.prototype.changeWithdrawPosition(app, false);
            }
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async getTransactions() {
        // No Output
        try {
            let app = await this.process('GetTransactions');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
   * @param {String} 
   * @return {bool || Exception}  
   */

    async getLastBets() {
        try {
            let app = await this.process('GetLastBets');
            return MapperGetLastBetsSingleton.output('GetLastBets', app);
        } catch (err) {
            throw err;
        }
    }


    /**
   * @param {String} 
   * @return {bool || Exception}  
   */

    async getBiggestBetWinners() {
        try {
            let app = await this.process('GetBiggestBetWinners');
            return MapperGetBiggetsBetWinnersSingleton.output('GetBiggetsBetWinners', app);
        } catch (err) {
            throw err;
        }
    }

    /**
  * @param {String} 
  * @return {bool || Exception}  
  */

    async getBiggestUserWinners() {
        try {
            let app = await this.process('GetBiggestUserWinners');
            return MapperGetBiggetsUserWinnersSingleton.output('GetBiggetsUserWinners', app);
        } catch (err) {
            throw err;
        }
    }

    /**
  * @param {String}  
  * @return {bool || Exception}  
  */

    async getPopularNumbers() {
        try {
            let app = await this.process('GetPopularNumbers');
            return MapperGetPopularNumbersSingleton.output('GetPopularNumbers', app);
        } catch (err) {
            throw err;
        }
    }


    /**
    * @param {String} 
    * @return {bool || Exception}  
    */


    async editGameTableLimit() {
        try {
            let app = await this.process('EditGameTableLimit');
            return MapperEditGameTableLimitSingleton.output('EditGameTableLimit', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */


    async editGameEdge() {
        try {
            let app = await this.process('EditGameEdge');
            return MapperEditGameEdgeSingleton.output('EditGameEdge', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editGameImage() {
        try {
            let app = await this.process('EditGameImage');
            return MapperEditGameImageSingleton.output('EditGameImage', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editGameBackgroundImage() {
        try {
            let app = await this.process('EditGameBackgroundImage');
            return MapperEditGameBackgroundImageSingleton.output('EditGameBackgroundImage', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */


    async editAffiliateStructure() {
        // Output = Undefined
        try {
            let app = await this.process('EditAffiliateStructure');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
  * @param {String} 
  * @return {bool || Exception}  
  */


    async editMoonPayIntegration() {
        // Output Boolean
        try {
            let app = await this.process('EditMoonPayIntegration');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
   * @param {String} 
   * @return {bool || Exception}  
   */


    async editIntegration() {
        // No Output
        try {
            let app = await this.process('EditIntegration');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
   * @param {String} 
   * @return {bool || Exception}  
   */


    async editCripsrIntegration() {
        // Output Boolean
        try {
            let app = await this.process('EditCripsrIntegration');
            return app;
        } catch (err) {
            throw err;
        }
    }

    async editKycIntegration() {
        // Output Boolean
        try {
            let app = await this.process('EditKycIntegration');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
   * @param {String} 
   * @return {bool || Exception}  
   */

    async editCripsrIntegration() {
        // Output Boolean
        try {
            let app = await this.process('EditCripsrIntegration');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */


    async editMailSenderIntegration() {
        try {
            let app = await this.process('EditMailSenderIntegration');
            return MapperEditMailSenderIntegrationSingleton.output('EditMailSenderIntegration', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editTheme() {
        try {
            let app = await this.process('EditTheme');
            return MapperEditThemeSingleton.output('EditTheme', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editSkin() {
        //Boolean Output
        try {
            let app = await this.process('EditSkin');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editTopBar() {
        try {
            let app = await this.process('EditTopBar');
            return MapperEditTopBarSingleton.output('EditTopBar', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editTopTab() {
        //output = boolean
        try {
            let app = await this.process('EditTopTab');
            return app
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editBanners() {
        try {
            let app = await this.process('EditBanners');
            return MapperEditBannersSingleton.output('EditBanners', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editIcons() {
        //Output Boolean
        try {
            let app = await this.process('EditIcons');
            return app;
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editSubSections() {
        //output = boolean
        try {
            let app = await this.process('EditSubSections');
            return app;
            // return MapperEditSubSectionsSingleton.output('EditSubSections', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editLogo() {
        try {
            let app = await this.process('EditLogo');
            return MapperEditLogoSingleton.output('EditLogo', app);
        } catch (err) {
            throw err;
        }
    }


    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editBackground() {
        try {
            let app = await this.process('EditBackground');
            return MapperEditBackgroundSingleton.output('EditBackground', app);
        } catch (err) {
            throw err;
        }
    }


    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editColors() {
        try {
            let app = await this.process('EditColors');
            return MapperEditColorsSingleton.output('EditColor', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editFooter() {
        try {
            let app = await this.process('EditFooter');
            return MapperEditFooterSingleton.output('EditFooter', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async editTopIcon() {
        try {
            let app = await this.process('EditTopIcon');
            return MapperEditTopIconSingleton.output('EditTopIcon', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editLoadingGif() {
        try {
            let app = await this.process('EditLoadingGif');
            return MapperEditLoadingGifSingleton.output('EditLoadingGif', app);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} 
     * @return {bool || Exception}  
     */

    async editTypography() {
        try {
            let app = await this.process('EditTypography');
            return MapperEditTypographySingleton.output('EditTypography', app);
        } catch (err) {
            throw err;
        }
    }

    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async getUsers() {
        try {
            let app = await this.process('GetUsers');
            return MapperGetUsersSingleton.output('GetUsers', app);
        } catch (err) {
            throw err;
        }
    }


    /**
    * @param {String} 
    * @return {bool || Exception}  
    */

    async updateWallet() {
        const { app } = this.self.params;
        try {
            let res = await this.process('UpdateWallet');
            return MapperUpdateWalletSingleton.output('UpdateWallet', res);
        } catch (err) {
            throw err;
        }
    }
}

export default App;
