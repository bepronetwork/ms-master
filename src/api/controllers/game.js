
import {
    App,
    Bet,
    Game
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';
import PerfomanceMonitor from '../../helpers/performance';
import { workerQueueSingleton } from '../../logic/third-parties/rabbit';

async function editGameTableLimit (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameTableLimit();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function editGameEdge(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameEdge();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function editGameImage(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin", "customization"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameImage();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function editGameBackgroundImage(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin", "customization"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameBackgroundImage();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

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
        MiddlewareSingleton.respondError(res, err, req);
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
        MiddlewareSingleton.respondError(res, err, req);
    }
}

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
        MiddlewareSingleton.respondError(res, err, req);
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
        MiddlewareSingleton.respondError(res, err, req);
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
        MiddlewareSingleton.respondError(res, err, req);
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
        MiddlewareSingleton.respondError(res, err, req);
    }
}

export {
    editGameTableLimit,
    editGameEdge,
    editGameImage,
    editGameBackgroundImage,
    addGame,
    getGames,
    getGame,
    createBet,
    setMaxBet,
    getGameStats
};