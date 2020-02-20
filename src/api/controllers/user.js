import {
	User
} from '../../models';
import MiddlewareSingleton from '../helpers/middleware';
import SecuritySingleton from '../helpers/security';

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

async function registUser (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let user = new User(params);
        let data = await user.register();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function loginUser (req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let user = new User(params);
        let data = await user.login();
        user = new User(data);
        let bearerToken  = await user.createAPIToken();
        MiddlewareSingleton.respond(res, {...data, bearerToken});
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function resetPassword(req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let user = new User(params);
        let data = await user.resetPassword();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function setUser2FA(req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        await MiddlewareSingleton.log({type: "user", req});
        let params = req.body;
		let user = new User(params);
        let data = await user.set2FA();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function loginUser2FA(req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let user = new User(params);
        let data = await user.login2FA();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function authUser (req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        await MiddlewareSingleton.log({type: "user", req});
        let params = req.body;
		let user = new User(params);
        let data = await user.auth();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getUserInfo (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
        await MiddlewareSingleton.log({type: "app", req});
        let params = req.body;
		let user = new User(params);
		let data = await user.getInfo();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function userSummary (req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        await MiddlewareSingleton.log({type: "user", req});
        let params = req.body;
		let user = new User(params);
		let data = await user.summary();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getBets (req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        await MiddlewareSingleton.log({type: "user", req});
        let params = req.body;
		let user = new User(params);
		let data = await user.getBets();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getDepositAddress(req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let params = req.body;
		let user = new User(params);
        let data = await user.getDepositAddress();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


export {
	registUser,
    loginUser,
    getUserInfo,
    userSummary,
    getBets,
    setUser2FA,
    loginUser2FA,
    getDepositAddress,
    authUser,
    resetPassword
}