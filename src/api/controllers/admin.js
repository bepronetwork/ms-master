import {
	Admin
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

async function registAdmin (req, res) {
    try{
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.register();
        await MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getAdminAll(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
        let admin = new Admin(params);
        let data = await admin.getAdminAll();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}
async function loginAdmin(req, res) {
    try{
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.login();
        await MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function setAdmin2FA(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["all"]});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.set2FA();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editAdminType(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.editAdminType();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}


async function loginAdmin2FA(req, res) {
    try{
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.login2FA();
        await MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}


// JSON WebToken Security Functions
async function authAdmin (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["all"]});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.auth();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function addAdmin (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
		let admin = new Admin(params);
		let data = await admin.addAdmin();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
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
    editAdminType
}