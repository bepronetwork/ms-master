import {
    User, Jackpot
} from '../../models';
import MiddlewareSingleton from '../helpers/middleware';
import SecuritySingleton from '../helpers/security';
import PusherSingleton from '../../logic/third-parties/pusher';
import { cryptoEth, cryptoBtc } from '../../logic/third-parties/cryptoFactory';

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

/**
 *
 * @param {*} req
 * @param {*} res
 */

async function webhookDeposit(req, res) {
    try {
        console.log(":::Init webhook::: ", req);
        req.body.id = req.query.id;
        req.body.ticker = req.body.currency;
        req.body.currency = req.query.currency;
        req.body.isApp = req.query.isApp;
        let params = req.body;
        console.log(1)
        console.log("params.txHash:::", params.txHash)
        var dataTransaction = null;
        switch ((req.body.ticker).toLowerCase()) {
            case 'eth':
                dataTransaction = await cryptoEth.CryptoEthSingleton.getTransaction(params.txHash);
                break;
            case 'btc':
                params.txHash = params.txid;
                dataTransaction = await cryptoBtc.CryptoBtcSingleton.getTransaction(params.txHash);
                console.log("dataTransactionBTCBeforeJson::", dataTransaction)
                dataTransaction = {
                    payload: {
                        hash: dataTransaction.payload.txid,
                        status: "0x1",
                        to: dataTransaction.payload.txouts[0].addresses[0],
                        from: dataTransaction.payload.txins[0].addresses[0],
                        value: dataTransaction.payload.txouts[0].amount
                    }
                }
                break;
        
            default:
                break;
        }
        console.log(2)
        console.log("::::dataTransaction::::", dataTransaction)
        if (!dataTransaction) { return null }
        params = { ...params, ...dataTransaction };

        let hooks = Array.isArray(params) ? params : [params];
        let data = await Promise.all(hooks.map(async wB => {
            try {
                let user = new User(params);
                return await user.updateWallet();
            } catch (err) {
                console.log(err);
                return err;
            }
        }))
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        // MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
    }
}


export {
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
    providerToken
}