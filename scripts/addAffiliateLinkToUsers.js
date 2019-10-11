
import { UsersRepository, AffiliateLinkRepository } from "../src/db/repos";
import { AffiliateLink, Affiliate } from "../src/models";
const _cliProgress = require('cli-progress');
 
// create a new progress bar instance and use shades_classic theme
var bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
 

 

class AddAffiliateLinkToUsers{
    constructor(){}

    async start(){
        try{
            /* Add Affiliate Setup to Apps */
            var users_all = await UsersRepository.prototype.getAll();
            // start the progress bar with a total value of 200 and start value of 0
            bar1.start(users_all.length, 0);
            for( var i = 0; i < users_all.length; i++){   
                let user = users_all[i];
                try{
                    let affiliate = (await (new Affiliate().register()))._doc._id;
                    let affiliateLinkObject = await (new AffiliateLink({
                        userAffiliated : user._id,
                        app_id : user.app_id._id
                    })).register();

                    await UsersRepository.prototype.setAffiliateLink(user._id, affiliateLinkObject._id);
                    await AffiliateLinkRepository.prototype.setAffiliate(affiliateLinkObject._id, affiliate);
                    await UsersRepository.prototype.setAffiliate(user._id, affiliate);

                }catch(err){
                    console.log(err)
                    console.log("user fail")
                }
                bar1.increment();
            }
            
            bar1.stop();
        }catch(err){
            console.log(err)
        }
       
    }
}


export default AddAffiliateLinkToUsers;

