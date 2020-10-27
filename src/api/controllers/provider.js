import {
    App, User
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';


async function createProvider(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let provider = new Provider(params);
        let data = await provider.register();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function editProvider(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let app = new App(params);
        let data = await app.editProvider();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
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

async function providerRollback(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.providerRollback();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data, true);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req, true);
    }
}

async function getGamesProvider(req, res) {
    try {
        let params = req.body;
        let provider = new Provider(params);
        let data = await provider.getGamesProvider();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function providerBalance(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.providerBalance();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data, true);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req, true);
    }
}

async function providerCredit(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.providerCredit();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data, true);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req, true);
    }
}

async function providerDebit(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.providerDebit();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data, true);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req, true);
    }
}

async function providerAuthorization(req, res) {
    try {
        let params = req.body;
        let app = new App(params);
        let data = await app.providerAuthorization();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data, true);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req, true);
    }
}


export {
    providerAuthorization,
    providerDebit,
    providerCredit,
    providerBalance,
    getGamesProvider,
    providerRollback,
    providerToken,
    editProvider,
    createProvider,
}