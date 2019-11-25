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

async function getUserInfo (req, res) {
    try{
        SecuritySingleton.verify({type : 'app', req});
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
        let params = req.body;
		let user = new User(params);
		let data = await user.getBets();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

/**
 * @param {*} req
 * @param {*} res
*/

async function updateWallet (req, res) {
    try{
        SecuritySingleton.verify({type : 'user', req});
        let params = req.body;
		let user = new User(params);
        let data = await user.updateWallet();
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
    updateWallet
}