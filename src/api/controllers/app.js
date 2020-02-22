
import {
	Game, App, Bet, Event, AffiliateLink, User
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';
import { BitGoSingleton } from '../../logic/third-parties';
import { getNormalizedTicker } from '../../logic/third-parties/bitgo/helpers';

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

async function createApp (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let app = new App(params);
        let data = await app.register();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getAppAuth (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
        let data = await app.getAuth();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getApp (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let app = new App(params);
        let data = await app.get();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


async function getGames (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.getGames();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

// JSON WebToken Security Functions
async function deployApp (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
        let data = await app.deployApp();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

// JSON WebToken Security Functions
async function createGame (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let game = new Game(params);
		let data = await game.register();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

// JSON WebToken Security Functions
async function addGame (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.addGame();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

// JSON WebToken Security Functions
async function addCurrencyWallet(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.addCurrencyWallet();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

// JSON WebToken Security Functions
async function getGame (req, res) {
	try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
	    let params = req.body;
		let game = new Game(params);
		let data = await game.get();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function createBet (req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        await MiddlewareSingleton.log({type: "user", req});
        let params = req.body;
		let bet = new Bet(params);
		let data = await bet.register();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function setMaxBet (req, res) {
    try {
        SecuritySingleton.verify({type : 'app', req});
        let params = req.body;
        let game = new Game(params);
        let data = await game.setMaxBet();
        MiddlewareSingleton.respond(res, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err);
    }
    
}


async function resolveBet (req, res) {
    try{
        // User Security Setup
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let bet = new Bet(params);
		let data = await bet.resolve();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


/* TO DO : Finalize Game Event
async function resolveGame (req, res) {
    try{
        let params = req.body;
		let event = new Event(params);
        let data = await event.resolve();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}
*/ 

// JSON WebToken Security Functions
async function summary (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.summary();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

// JSON WebToken Security Functions
async function getTransactions (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.getTransactions();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


// JSON WebToken Security Functions
async function addServices (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.addServices();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getLastBets (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.getLastBets();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getBiggestBetWinners (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.getBiggestBetWinners();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getBiggestUserWinners (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.getBiggestUserWinners();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getPopularNumbers (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.getPopularNumbers();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editAffiliateStructure (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editAffiliateStructure();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editIntegration (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editIntegration();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


async function editTopBar (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editTopBar();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editBanners(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editBanners();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editLogo(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editLogo();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editColors(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editColors();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editFooter(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editFooter();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editTopIcon(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editTopIcon();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editLoadingGif(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editLoadingGif();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editTypography(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.editTypography();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getUsers(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let app = new App(params);
		let data = await app.getUsers();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}



/**
 *
 * @param {*} req
 * @param {*} res
 */

async function webhookBitgoDeposit (req, res) {
    try{
        req.body.id = req.query.id;
        req.body.currency = req.query.currency;
        let params = req.body;
        let hooks = Array.isArray(params) ? params : [params];
        let data = await Promise.all(hooks.map( async wB => {
            try{
                // Get Info from WebToken
                const wBT = await BitGoSingleton.getTransaction({id : wB.transfer, wallet_id : wB.wallet, ticker : getNormalizedTicker({ticker : wB.coin })});
                if(!wBT){return null}
                // Verify if it is App or User Deposit /Since the App deposit is to the main MultiSign no label is given to specific address, normally label = ${user_od}
                var isApp = !wBT.label;
                params.wBT = wBT;

                if(isApp){
                    let app = new App(params);
                    return await app.updateWallet();
                }else{
                    // is User
                    let user = new User(params);
                    return await user.updateWallet();
                }
            }catch(err){
                console.log(err);
                return err;
            }
       }))
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

/**
 *
 * @param {*} req
 * @param {*} res
 */


async function createAffiliateCustom(req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let affiliateLink = new AffiliateLink(params);
        let data = await affiliateLink.setCustomAffiliatePercentage();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
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
    editLoadingGif
};