
import {
	Game, App, Bet, Event
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';

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
        let params = req.body;
		let app = new App(params);
		let data = await app.getGames();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

// JSON WebToken Security Functions
async function createGame (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
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
        let params = req.body;
		let app = new App(params);
		let data = await app.addGame();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}
// JSON WebToken Security Functions
async function getGame (req, res) {
	try{
        SecuritySingleton.verify({type : 'app', req});
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
        let params = req.body;
		let bet = new Bet(params);
		let data = await bet.register();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


async function resolveBet (req, res) {
    try{
        // User Security Setup
        SecuritySingleton.verify({type : 'app', req});
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
        let params = req.body;
		let app = new App(params);
		let data = await app.getPopularNumbers();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function addBlockchainInformation (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        let params = req.body;
		let app = new App(params);
        let data = await app.addBlockchainInformation();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}



async function editAffiliateStructure (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
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
        let params = req.body;
		let app = new App(params);
		let data = await app.editBanners();
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

async function updateWalletApp (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        let params = req.body;
		let app = new App(params);
        let data = await app.updateWallet();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

export {
    createApp,
    editTopBar,
    getApp,
    createGame,
    addBlockchainInformation,
    getPopularNumbers,
    getBiggestBetWinners,
    getBiggestUserWinners,
    addGame,
    editAffiliateStructure,
    getGame,
    getGames,
    createBet,
    getAppAuth,
    getTransactions,
    resolveBet,
    summary,
    editIntegration,
    editBanners,
    getLastBets,
    addServices,
    updateWalletApp
};