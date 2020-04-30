
import {
    Game, App, Bet, Event, AffiliateLink, User, Jackpot, Currency, Wallet, Balance
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';
import { BitGoSingleton } from '../../logic/third-parties';
import { getNormalizedTicker } from '../../logic/third-parties/bitgo/helpers';
import { workerQueueSingleton } from '../../logic/third-parties/rabbit';
import PerfomanceMonitor from '../../helpers/performance';
const perf = require('execution-time')();

/**
 * Description of the function.
 *
 * @class
 * @memberof api.controllers.Apps.postApp
 * @requires lodash
 * @requires helpers/apiError
 * @requires helpers/swagger.generateParamsErrorObject
 * @todo Add description of AppsController
 */

async function createApp(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.register();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getAppAuth(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getAuth();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editRestrictedCountries(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editRestrictedCountries();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getApp(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.get();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBetInfo(req, res) {
    try {
        // await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getBetInfo();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getGames(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getGames();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function deployApp(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.deployApp();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function createGame(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let game = new Game(params);
        let data = await game.register();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addGame(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addGame();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editVirtualCurrency (req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let wallet = new Wallet(params);
        let data = await wallet.editVirtualCurrency();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}
// JSON WebToken Security Functions
async function addAddonBalance (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonBalance();
        await MiddlewareSingleton.log({type: "admin", req, code : 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addAddonJackpot (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["all"]});
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonJackpot();
        await MiddlewareSingleton.log({type: "admin", req, code : 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function addAddonAutoWithdraw(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonAutoWithdraw();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAddonAutoWithdraw(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAddonAutoWithdraw();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addCurrencyWallet(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addCurrencyWallet();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function getGame(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let game = new Game(params);
        let data = await game.get();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAddonBalance (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
	    let params = req.body;
		let balance = new Balance(params);
		let data = await balance.editAddonBalance();
        await MiddlewareSingleton.log({type: "admin", req, code : 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editEdgeJackpot (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
	    let params = req.body;
		let jackpot = new Jackpot(params);
		let data = await jackpot.editEdgeJackpot();
        await MiddlewareSingleton.log({type: "admin", req, code : 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function createBet (req, res) {
    try {
        let perf = new PerfomanceMonitor({id : 'createBet'});
        perf.start({id : 'securitySingleton'});
        await SecuritySingleton.verify({type : 'user', req});
        perf.end({id : 'securitySingleton'});
        let params = req.body;

        // // check how much is needed for the jackpot
        // let jackpot = new Jackpot(params);
        // perf.start({id : 'Jackpot percentage'});
        // let percentage = await jackpot.percentage();
        // perf.end({id : 'Jackpot percentage'});

        // place a bet on the game
        let bet = new Bet(params);
        perf.start({id : 'Total Bet'});
        let data = await bet.register();
        perf.end({id : 'Total Bet'});
        try{
            // Check if percentage to jackpot is > 0, and if yes, then call jackpot queue
            if(data.valueToJackpot > 0) {
                workerQueueSingleton.sendToQueue("betJackpot", MiddlewareSingleton.convertToJson(req, data.valueToJackpot));
            }
        }catch(err){
            console.log("Problem Connecting to Jackpot MS");
            console.log(err);
        }
        console.log("jere")
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);

    } catch (err) {
        await MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function setMaxBet(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let game = new Game(params);
        let data = await game.setMaxBet();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }

}


async function resolveBet(req, res) {
    try {
        // User Security Setup
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let bet = new Bet(params);
        let data = await bet.resolve();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}


/* TO DO : Finalize Game Event
async function resolveGame (req, res) {
    try{
        let params = req.body;
		let event = new Event(params);
        let data = await event.resolve();
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}
*/

// JSON WebToken Security Functions
async function summary(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.summary();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function appGetUsersBets(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.appGetUsersBets();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function getTransactions(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getTransactions();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}


// JSON WebToken Security Functions
async function addServices(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addServices();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getLastBets(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getLastBets();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBiggestBetWinners(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getBiggestBetWinners();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBiggestUserWinners(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getBiggestUserWinners();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getPopularNumbers(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getPopularNumbers();
        await MiddlewareSingleton.log({ type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAffiliateStructure(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAffiliateStructure();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editIntegration(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editIntegration();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editMailSenderIntegration(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editMailSenderIntegration();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTopBar(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTopBar();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editBanners(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editBanners();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editLogo(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editLogo();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editColors(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editColors();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editFooter(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editFooter();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTopIcon(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTopIcon();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editLoadingGif(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editLoadingGif();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTypography(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTypography();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getUsers(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getUsers();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}



/**
 *
 * @param {*} req
 * @param {*} res
 */

async function webhookBitgoDeposit(req, res) {
    try {
        req.body.id = req.query.id;
        req.body.currency = req.query.currency;
        let params = req.body;
        let hooks = Array.isArray(params) ? params : [params];
        let data = await Promise.all(hooks.map(async wB => {
            try {
                // Get Info from WebToken
                const wBT = await BitGoSingleton.getTransaction({ id: wB.transfer, wallet_id: wB.wallet, ticker: getNormalizedTicker({ ticker: wB.coin }) });
                if (!wBT) { return null }
                // Verify if it is App or User Deposit /Since the App deposit is to the main MultiSign no label is given to specific address, normally label = ${user_od}
                var isApp = !wBT.label;
                params.wBT = wBT;

                if (isApp) {
                    let app = new App(params);
                    return await app.updateWallet();
                } else {
                    // is User
                    let user = new User(params);
                    return await user.updateWallet();
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        }))
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        // await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}

/**
 *
 * @param {*} req
 * @param {*} res
 */


async function createAffiliateCustom(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let affiliateLink = new AffiliateLink(params);
        let data = await affiliateLink.setCustomAffiliatePercentage();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        console.log(err)
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}


/**
 *
 * @param {*} req
 * @param {*} res
 */


async function getLogs(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let body  = req.body;
        let app = new App(body);
        let data = await app.getLogs();
        await MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}


export {
    createApp,
    editTopBar,
    createAffiliateCustom,
    getApp,
    editFooter,
    createGame,
    addCurrencyWallet,
    getPopularNumbers,
    getBiggestBetWinners,
    getBiggestUserWinners,
    addGame,
    editAffiliateStructure,
    getGame,
    getGames,
    editLogo,
    editColors,
    createBet,
    getUsers,
    getAppAuth,
    getTransactions,
    resolveBet,
    summary,
    editIntegration,
    editBanners,
    deployApp,
    getLastBets,
    addServices,
    editTypography,
    setMaxBet,
    webhookBitgoDeposit,
    editTopIcon,
    editMailSenderIntegration,
    editLoadingGif,
    addAddonJackpot,
    addAddonAutoWithdraw,
    editAddonAutoWithdraw,
    editEdgeJackpot,
    appGetUsersBets,
    addAddonBalance,
    editAddonBalance,
    editVirtualCurrency,
    editRestrictedCountries,
    getLogs,
    getBetInfo
};