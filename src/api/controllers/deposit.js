import { Wallet } from "../../models";
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';

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

async function setMaxDeposit(req, res) {
    try{
        let params = req.body;
        // SecuritySingleton.verify({type : 'app', req});
		let wallet = new Wallet(params);
		let data = await wallet.setMaxDeposit();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

export {
    setMaxDeposit
}