
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
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getAppAuth(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getAuth();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editRestrictedCountries(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editRestrictedCountries();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getApp(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.get();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBetInfo(req, res) {
    try {
        // await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getBetInfo();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getGames(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getGames();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getGameStats(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getGameStats();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editVirtualCurrency(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let wallet = new Wallet(params);
        let data = await wallet.editVirtualCurrency();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function modifyBalance(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.modifyBalance();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addAddonBalance(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonBalance();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addAddonJackpot(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonJackpot();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function addAddonAutoWithdraw(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonAutoWithdraw();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAddonAutoWithdraw(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAddonAutoWithdraw();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function addAddonTxFee(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonTxFee();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAddonTxFee(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAddonTxFee();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function addAddonPointSystem(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonPointSystem();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}
async function addAddonDepositBonus(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAddonDepositBonus();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAddonPointSystem(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAddonPointSystem();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAddonDepositBonus(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAddonDepositBonus();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAddonBalance(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let balance = new Balance(params);
        let data = await balance.editAddonBalance();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editEdgeJackpot(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let jackpot = new Jackpot(params);
        let data = await jackpot.editEdgeJackpot();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function createBet(req, res) {
    try {
        let perf = new PerfomanceMonitor({ id: 'createBet' });
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;

        // place a bet on the game
        let bet = new Bet(params);
        let data = await bet.register();
        try {
            // Check if percentage to jackpot is > 0, and if yes, then call jackpot queue
            if (data.jackpotAmount > 0) {
                workerQueueSingleton.sendToQueue("betJackpot", MiddlewareSingleton.convertToJson(req, data.jackpotAmount));
            }
        } catch (err) {
            console.log("Problem Connecting to Jackpot MS");
            console.log(err);
        }
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);

    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({type: "admin", req, code: err.code});
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function appGetUsersBets(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.appGetUsersBets();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editBackground(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editBackground();
        MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({type: "admin", req, code: err.code});
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getLastBets(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getLastBets();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBiggestBetWinners(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getBiggestBetWinners();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBiggestUserWinners(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getBiggestUserWinners();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getPopularNumbers(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.getPopularNumbers();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAffiliateStructure(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAffiliateStructure();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editIntegration(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editIntegration();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editMailSenderIntegration(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editMailSenderIntegration();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTheme(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTheme();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTopBar(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTopBar();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTopTab(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTopTab();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editBanners(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editBanners();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editLogo(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editLogo();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editColors(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editColors();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editFooter(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editFooter();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTopIcon(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTopIcon();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editLoadingGif(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editLoadingGif();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTypography(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTypography();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getUsers(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.getUsers();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
                console.log("wb", wB)
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
        // MiddlewareSingleton.log({type: "admin", req, code: err.code});
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
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        console.log(err)
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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
        let body = req.body;
        let app = new App(body);
        let data = await app.getLogs();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err);
    }
}


/**
 *
 * @param {*} req
 * @param {*} res
 */

async function generateAddresses(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let body  = req.body;
        let app = new App(body);
        let data = await app.generateAddresses();
        MiddlewareSingleton.log({ type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
    }
}


export {
    addAddonPointSystem,
    editTopTab,
    addAddonDepositBonus,
    editAddonDepositBonus,
    addAddonTxFee,
    generateAddresses,
    editAddonTxFee,
    editTheme,
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
    getBetInfo,
    editBackground,
    modifyBalance,
    getGameStats,
    editAddonPointSystem,
};