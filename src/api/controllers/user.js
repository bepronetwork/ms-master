import {
    User, Jackpot, FreeCurrency
} from '../../models';
import MiddlewareSingleton from '../helpers/middleware';
import SecuritySingleton from '../helpers/security';
import PusherSingleton from '../../logic/third-parties/pusher';
import { cryptoEth, cryptoBtc } from '../../logic/third-parties/cryptoFactory';
import { SearchSingleton } from '../../logic/utils/search';
import { UsersRepository } from '../../db/repos';
import { throwError } from '../../controllers/Errors/ErrorManager';
import { LogOwlSingleton } from '../../logic/third-parties';

/**
 * Description of the function.
 *
 * @class
 * @memberof api.controllers.users.postUser
 * @requires lodash
 * @requires helpers/apiError
 * @requires helpers/swagger.generateParamsErrorObject
 * @todo Add description of UsersController
 */

async function registUser(req, res) {
    try {
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.register();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function resendEmail(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.resendEmail();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function loginUser(req, res) {
    try {
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.login();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function setPassword(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.setPassword();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function confirmEmail(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.confirmEmail();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function resetPassword(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.resetPassword();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function setUser2FA(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.set2FA();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function loginUser2FA(req, res) {
    try {
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.login2FA();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function authUser(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        await SecuritySingleton.verifyByCountry({ req });
        let params = req.body;
        let user = new User(params);
        let data = await user.auth();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getUserInfo(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin", "financials"] });
        let params = req.body;
        let user = new User(params);
        let data = await user.getInfo();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function userGetBets(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.userGetBets();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getPotJackpot(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let jackpot = new Jackpot(params);
        let data = await jackpot.getPotJackpot();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function userSummary(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.summary();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getBets(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.getBets();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function providerToken(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let params = req.body;
        let user = new User(params);
        let data = await user.providerToken();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}
async function getDepositAddress(req, res) {
    try {
        let params = req.body;
        let user = new User(params);
        let data = await user.getDepositAddress();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function pusherNotificationsAuth(req, res) {
    try {
        let params = req.body;

        let data = PusherSingleton.authenticate({
            socketId: params.socket_id,
            channel: params.channel_name
        });

        res.send(data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function pingPushNotifications(req, res) {
    try {
        let params = req.body;
        let isPrivate = params.user ? true : false;

        let data = PusherSingleton.trigger({
            channel_name: isPrivate ? params.user : 'general',
            isPrivate,
            message: "Ping",
            eventType: "PING"
        });

        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function requestAffiliateWithdraw (req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
		let user = new User(params);
        let data = await user.requesAffiliatetWithdraw();
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function cancelWithdraw (req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
		let user = new User(params);
        let data = await user.cancelWithdraw();
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

/**
 *
 * @param {*} req
 * @param {*} res
 */

async function webhookDeposit(req, res) {
    try {
        SecuritySingleton.verifyServeToServe(req);
        let user = new User(req.body);
        let data = await user.updateWallet();
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getAddonFreeCurrency(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'user', req });
        let body = req.body;
        let freeCurrency = new FreeCurrency(body);
        let data = await freeCurrency.getAddonFreeCurrency();
        MiddlewareSingleton.log({ type: "user", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "user", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function requestWithdraw (req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
        let user = new User(params);
        let data = await user.requestWithdraw();
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


export {
    requestWithdraw,
    webhookDeposit,
    registUser,
    loginUser,
    getUserInfo,
    userSummary,
    pusherNotificationsAuth,
    pingPushNotifications,
    getBets,
    setUser2FA,
    loginUser2FA,
    getDepositAddress,
    authUser,
    resetPassword,
    setPassword,
    confirmEmail,
    resendEmail,
    userGetBets,
    getPotJackpot,
    providerToken,
    getAddonFreeCurrency,
    cancelWithdraw,
    requestAffiliateWithdraw
}