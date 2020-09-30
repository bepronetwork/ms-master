import {
    Admin, TopUp
} from '../../models';
import MiddlewareSingleton from '../helpers/middleware';
import SecuritySingleton from '../helpers/security';

/**
 * Description of the function.
 *
 * @class
 * @memberof api.controllers.admins.postAdmin
 * @requires lodash
 * @requires helpers/apiError
 * @requires helpers/swagger.generateParamsErrorObject
 * @todo Add description of AdminsController
 */

async function registAdmin(req, res) {
    try {
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.register();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function getAdminAll(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.getAdminAll();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}
async function loginAdmin(req, res) {
    try {
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.login();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function setAdmin2FA(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.set2FA();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function editAdminType(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.editAdminType();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}


async function loginAdmin2FA(req, res) {
    try {
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.login2FA();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}


// JSON WebToken Security Functions
async function authAdmin(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["all"] });
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.auth();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function addAdmin(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.addAdmin();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function addTopUp(req, res) {
    try {
        await SecuritySingleton.verify({ type: 'admin', req, permissions: ["super_admin"] });
        let params = req.body;
        let topUp = new TopUp(params);
        let data = await topUp.register();
        MiddlewareSingleton.log({ type: "admin", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "admin", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function resetAdminPassword(req, res) {
    try {
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.resetAdminPassword();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

async function setAdminPassword(req, res) {
    try {
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.setAdminPassword();
        MiddlewareSingleton.log({ type: "global", req, code: 200 });
        MiddlewareSingleton.respond(res, req, data);
    } catch (err) {
        MiddlewareSingleton.log({ type: "global", req, code: err.code });
        MiddlewareSingleton.respondError(res, err, req);
    }
}

export {
    addAdmin,
    registAdmin,
    loginAdmin,
    loginAdmin2FA,
    authAdmin,
    setAdmin2FA,
    getAdminAll,
    editAdminType,
    resetAdminPassword,
    setAdminPassword,
    addTopUp
}