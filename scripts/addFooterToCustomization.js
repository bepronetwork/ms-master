
import { AppRepository, CustomizationRepository } from "../src/db/repos";
import { Footer, Color, Logo } from "../src/models";
import { colors } from "../src/mocks";
const _cliProgress = require('cli-progress');
 
// create a new progress bar instance and use shades_classic theme
var bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
 

class AddFooterToCustomization{
    constructor(){}

    async start(){
        try{
            console.log("har")

            /* Add Affiliate Setup to Apps */
            var app_all = await AppRepository.prototype.getAll();
            // start the progress bar with a total value of 200 and start value of 0
            bar1.start(app_all.length, 0);
            for( var i = 0; i < app_all.length; i++){
                let app = app_all[i];
                let footer = new Footer();
                let res = await footer.register();
                await CustomizationRepository.prototype.setFooterId(app.customization._id, res._doc._id);
                let logo = new Logo();
                res = await logo.register();
                await CustomizationRepository.prototype.setLogoId(app.customization._id, res._doc._id);

                /* Add Colors */
                let colorIds = await Promise.all(colors.map( async c => {
                    return (await new Color().register(c))._doc._id;
                }));
                await CustomizationRepository.prototype.setColors(app.customization._id, colorIds);
                bar1.increment();
            }
            bar1.stop();
        }catch(err){
            console.log(err)
        }
       
    }
}


export default AddFooterToCustomization;

