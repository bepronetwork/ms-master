
import { AppRepository } from "../src/db/repos";
import { App, Integrations } from "../src/models";
const _cliProgress = require('cli-progress');
 
// create a new progress bar instance and use shades_classic theme
var bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
 

 

class AddIntegrationsToApps{
    constructor(){}

    async start(){
        try{
            /* Add Affiliate Setup to Apps */
            var app_all = await AppRepository.prototype.getAll();
            // start the progress bar with a total value of 200 and start value of 0
            bar1.start(app_all.length, 0);
            for( var i = 0; i < app_all.length; i++){
                let app = app_all[i];
                let integrations = new Integrations();
                let res = await integrations.register();
                await AppRepository.prototype.setIntegrationsId(app._id, res._doc._id)
                bar1.increment();
            }
            bar1.stop();
        }catch(err){
            console.log(err)
        }
       
    }
}


export default AddIntegrationsToApps;

