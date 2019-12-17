
import { AppRepository, GamesRepository } from "../src/db/repos";
import { App, Integrations } from "../src/models";
import GamesEcoRepository from "../src/db/repos/ecosystem/game";
const _cliProgress = require('cli-progress');
 
// create a new progress bar instance and use shades_classic theme
var bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
 

const gamesInfo = {
    'jackpot_auto' : {
        'rules' : '1. Just a fair 1/10000000 chance'
    },
    'linear_dice_simple' : {
        'rules' : '1. Only roll outcomes that hit the green area are winners.\n 2. Players are prohibited from using their own dice.\n 3. Absolutely no hufflepuffs allowed.'
    },
    'european_roulette_simple' : {
        'rules' : '1. Bets can be placed directly on any tile, but can’t be placed on the lines to split between outcomes.\n 2. There is only one possible green outcome, therefore reducing the house edge from traditional roulette.'
    },
    'coinflip_simple' : {
        'rules' : '1. Absolutely no way of inserting you own coin'
    },
    'wheel_variation_1' : {
        'rules' : '1. No tampering with the wheel.'
    },
    'wheel_simple' : {
        'rules' : '1. No tampering with the wheel.'
    },
    'plinko_variation_1' : {
        'rules' : '1. No gravity hacks by rotating device or monitors while playing.'
    }
}

class AddRulesToGames{
    constructor(){}

    async start(){
        try{
            /* Add Affiliate Setup to Apps */
            var app_all = [await AppRepository.prototype.findAppById('5dcb0a764269ec0021800cf3')];
            let gamesEco = await GamesEcoRepository.prototype.getAll();
            // start the progress bar with a total value of 200 and start value of 0
            bar1.start(app_all.length + gamesEco, 0);
                 
            await Promise.all(gamesEco.map( g => {
                console.log(g._id)
                bar1.increment();
                return GamesEcoRepository.prototype.editRules({id : g._id, rules : gamesInfo[g.metaName].rules});
            }));

            for( var i = 0; i < app_all.length; i++){
                let app = app_all[i];
                await Promise.all(app.games.map( g => {
                    return GamesRepository.prototype.editRules({id : g._id, rules : gamesInfo[g.metaName].rules});
                }));
          
                bar1.increment();
            }

            bar1.stop();
        }catch(err){
            console.log(err)
        }
       
    }
}


export default AddRulesToGames;

