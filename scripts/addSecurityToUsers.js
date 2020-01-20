
import { UsersRepository } from "../src/db/repos";
import { Security } from "../src/models";
const _cliProgress = require('cli-progress');
 
// create a new progress bar instance and use shades_classic theme
var bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
 

 

class AddSecurityToUsers{
    constructor(){}

    async start(){
        try{
            /* Add Affiliate Setup to Apps */
            var users_all = await UsersRepository.prototype.getAll();
            // start the progress bar with a total value of 200 and start value of 0
            bar1.start(users_all.length, 0);
            for( var i = 0; i < users_all.length; i++){
                let user = users_all[i];
                let security = new Security();
                let res = await security.register();
                await UsersRepository.prototype.setSecurityId(user._id, res._doc._id)
                bar1.increment();
            }
            bar1.stop();
        }catch(err){
            console.log(err)
        }
       
    }
}


export default AddSecurityToUsers;