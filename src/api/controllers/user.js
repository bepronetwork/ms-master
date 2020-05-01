import {
	User
} from '../../models';
import MiddlewareSingleton from '../helpers/middleware';
import SecuritySingleton from '../helpers/security';
import PusherSingleton from '../../logic/third-parties/pusher';

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
        await SecuritySingleton.verifyByCountry({req});
        let params = req.body;
		let user = new User(params);
        let data = await user.register();
        MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function resendEmail (req, res) {
    try{
        await SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
		let user = new User(params);
        let data = await user.resendEmail();
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function loginUser (req, res) {
    try{
        await SecuritySingleton.verifyByCountry({req});
        let params = req.body;
		let user = new User(params);
        let data = await user.login();
        MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function setPassword(req, res) {
    try{
        let params = req.body;
		let user = new User(params);
        let data = await user.setPassword();
        MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function confirmEmail(req, res) {
    try{
        let params = req.body;
		let user = new User(params);
        let data = await user.confirmEmail();
        MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function resetPassword(req, res) {
    try{
        let params = req.body;
		let user = new User(params);
        let data = await user.resetPassword();
        MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function setUser2FA(req, res) {
    try{
        await SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
		let user = new User(params);
        let data = await user.set2FA();
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function loginUser2FA(req, res) {
    try{
        await SecuritySingleton.verifyByCountry({req});
        let params = req.body;
		let user = new User(params);
        let data = await user.login2FA();
        MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function authUser (req, res) {
    try{
        await SecuritySingleton.verify({type : 'user', req});
        await SecuritySingleton.verifyByCountry({req});
        let params = req.body;
		let user = new User(params);
        let data = await user.auth();
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        console.log(err.code);
        MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getUserInfo (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin", "financials"]});
        let params = req.body;
		let user = new User(params);
		let data = await user.getInfo();
        MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function userGetBets (req, res) {
    try{
        await SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
		let user = new User(params);
		let data = await user.userGetBets();
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function userSummary (req, res) {
    try{
        await SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
		let user = new User(params);
		let data = await user.summary();
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getBets (req, res) {
    try{
        await SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
		let user = new User(params);
		let data = await user.getBets();
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getDepositAddress(req, res) {
    try{
        let params = req.body;
		let user = new User(params);
        let data = await user.getDepositAddress();
        MiddlewareSingleton.log({type: "user", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.log({type: "user", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

async function pusherNotificationsAuth(req, res) {
    try{
        let params = req.body;

        let data = PusherSingleton.authenticate({
            socketId : params.socket_id,
            channel : params.channel_name
        });

        res.send(data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function pingPushNotifications(req, res) {
    try{  
        let params = req.body;
        let isPrivate = params.user ? true : false;

        let data = PusherSingleton.trigger({
            channel_name : isPrivate ? params.user : 'general', 
            isPrivate,
            message : "Ping", 
            eventType : "PING"
        });

        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


export {
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
    userGetBets
}