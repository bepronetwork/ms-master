import {
    App, Wallet
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';
const perf = require('execution-time')();


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
        MiddlewareSingleton.respondError(res, err, req);
    }
}

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
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function pingPost(req, res) {
    try {
        if(!await MiddlewareSingleton.log({type: req.body.type, req})){
            throw {code: 404, message: "Error in Log"};
        }
        await SecuritySingleton.verifyByCountry({req});
        let data = { message : 'Ping with Succcess'}
        MiddlewareSingleton.respond(res, req, data);
    } catch (error) {
        await MiddlewareSingleton.log({type: req.body.type, req, code: error.code});
        MiddlewareSingleton.respondError(res, error);
    }
}

export {
    editVirtualCurrency,
    getLogs,
    pingPost
};