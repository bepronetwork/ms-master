
import {
    Game, App, Bet, Event, AffiliateLink, User, Jackpot, Currency, Wallet
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';
import { BitGoSingleton } from '../../logic/third-parties';
import { getNormalizedTicker } from '../../logic/third-parties/bitgo/helpers';
import { workerQueueSingleton } from '../../logic/third-parties/rabbit';
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
        await MiddlewareSingleton.log({ type: "global", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.register();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getAppAuth(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getAuth();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getApp(req, res) {
    try {
        await MiddlewareSingleton.log({ type: "global", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.get();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}


async function getGames(req, res) {
    try {
        await MiddlewareSingleton.log({ type: "global", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getGames();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function deployApp(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.deployApp();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function createGame(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let game = new Game(params);
        let data = await game.register();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addGame(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.addGame();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editVirtualCurrency (req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let wallet = new Wallet(params);
        let data = await wallet.editVirtualCurrency();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addJackpot (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["all"]});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
        let app = new App(params);
        let data = await app.addJackpot();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function addAutoWithdraw(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.addAutoWithdraw();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAutoWithdraw(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAutoWithdraw();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function addCurrencyWallet(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.addCurrencyWallet();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function getGame(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let game = new Game(params);
        let data = await game.get();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editEdgeJackpot (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        await MiddlewareSingleton.log({type: "admin", req});
	    let params = req.body;
		let jackpot = new Jackpot(params);
		let data = await jackpot.editEdgeJackpot();
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function createBet (req, res) {
    try {

        await SecuritySingleton.verify({type : 'user', req});
        await MiddlewareSingleton.log({type: "user", req});
        let params = req.body;

        // check how much is needed for the jackpot
        let jackpot = new Jackpot(params);
        let percentage = await jackpot.percentage();

        // place a bet on the game
        let bet = new Bet({...params, percentage});
        let data = await bet.register();

        // Check if percentage to jackpot is > 0, and if yes, then call jackpot queue
        if(percentage > 0) {
            await workerQueueSingleton.sendToQueue("betJackpot", MiddlewareSingleton.convertToJson(req, percentage));
        }

        MiddlewareSingleton.respond(res, req, data);

    } catch (err) {
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
        MiddlewareSingleton.respondError(res, err);
    }

}


async function resolveBet(req, res) {
    try {
        // User Security Setup
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let bet = new Bet(params);
        let data = await bet.resolve();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
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
        MiddlewareSingleton.respondError(res, err);
	}
}
*/

// JSON WebToken Security Functions
async function summary(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.summary();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function appGetUsersBets(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.appGetUsersBets();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

// JSON WebToken Security Functions
async function getTransactions(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getTransactions();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}


// JSON WebToken Security Functions
async function addServices(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.addServices();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getLastBets(req, res) {
    try {
        await MiddlewareSingleton.log({ type: "global", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getLastBets();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBiggestBetWinners(req, res) {
    try {
        await MiddlewareSingleton.log({ type: "global", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getBiggestBetWinners();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getBiggestUserWinners(req, res) {
    try {
        await MiddlewareSingleton.log({ type: "global", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getBiggestUserWinners();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getPopularNumbers(req, res) {
    try {
        await MiddlewareSingleton.log({ type: "global", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getPopularNumbers();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editAffiliateStructure(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editAffiliateStructure();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editIntegration(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editIntegration();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editMailSenderIntegration(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editMailSenderIntegration();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTopBar(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTopBar();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editBanners(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editBanners();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editLogo(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editLogo();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editColors(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editColors();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editFooter(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editFooter();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTopIcon(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTopIcon();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editLoadingGif(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editLoadingGif();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function editTypography(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "customization"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.editTypography();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
}

async function getUsers(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let app = new App(params);
        let data = await app.getUsers();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
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
        await MiddlewareSingleton.log({ type: "admin", req });
        let params = req.body;
        let affiliateLink = new AffiliateLink(params);
        let data = await affiliateLink.setCustomAffiliatePercentage();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        console.log(err)
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
    addJackpot,
    addAutoWithdraw,
    editAutoWithdraw,
    editEdgeJackpot,
    appGetUsersBets
};