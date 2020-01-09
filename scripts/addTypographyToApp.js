import { AppRepository, TypographyRepository } from "../src/db/repos";
import { Typography } from "../src/models";
import { fonts } from "../src/mocks";
const _cliProgress = require('cli-progress');

// create a new progress bar instance and use shades_classic theme
var bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);

class AddTypographyToApp {
    constructor(){}

    async start() {

        try {
            var app_all = await AppRepository.prototype.getAll();

            bar1.start(app_all.length, 0);

            for (var i = 0; i < app_all.length; i++) {
                let app = app_all[i];
                let typographys = await TypographyRepository.prototype.getAll();
                for(let item of typographys) {
                    await AppRepository.prototype.addTypography(app._id, item);
                }
                bar1.increment();
            }
            bar1.stop();
        } catch (err) {
            console.log(err);
        }
    }
}

export default AddTypographyToApp;