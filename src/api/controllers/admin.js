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
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.register();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getAdminAll(req, res) {
    try{
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.getAdminAll();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}
async function loginAdmin(req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.login();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function setAdmin2FA(req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.set2FA();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editAdminType(req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.editAdminType();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


async function loginAdmin2FA(req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.login2FA();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


// JSON WebToken Security Functions
async function authAdmin (req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let admin = new Admin(params);
        let data = await admin.auth();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function addAdmin (req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let admin = new Admin(params);
		let data = await admin.addAdmin();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
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