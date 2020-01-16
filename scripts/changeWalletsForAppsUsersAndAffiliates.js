
import { UsersRepository, AffiliateLinkRepository, AffiliateRepository } from "../src/db/repos";
import { AffiliateLink, Affiliate } from "../src/models";
const _cliProgress = require('cli-progress');
 
// create a new progress bar instance and use shades_classic theme
var bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
var bar2 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);


 

class ChangeWalletsForAppsUsersAndAffiliates{
    constructor(){}

    async start(){
        try{
            /* Get all Apps */
            bar1.start(users_all.length, 0);

            var app_all = await AppRepository.prototype.getAll();
            console.log("all apps", app_all)
            for( var i = 0; i < app_all.length; i++){   
                let app = app_all[i];
                try{
                    await AppRepository.prototype.setEmptyWallet(app._id);
                }catch(err){
                    console.log(err)
                    console.log("app fail")
                }
                bar1.increment();
            }
            bar1.stop();

            bar2.start(users_all.length, 0);
            /* Add Affiliate Setup to Apps */
            var users_all = await UsersRepository.prototype.getAll();
            // start the progress bar with a total value of 200 and start value of 0
            for( var i = 0; i < users_all.length; i++){   
                let user = users_all[i];
                console.log("user ", user._id);
                console.log("affialte ", user.affiliate._id)
                try{    
                    await UsersRepository.prototype.setEmptyWallet(user._id);
                    await AffiliateRepository.prototype.setEmptyWallet(user.affiliate._id);

                }catch(err){
                    console.log(err)
                    console.log("user fail")
                }
                bar2.increment();
            }
            
            bar1.stop();
        }catch(err){
            console.log(err)
        }
       
    }
}


export default ChangeWalletsForAppsUsersAndAffiliates;

