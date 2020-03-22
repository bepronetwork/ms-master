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
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        await MiddlewareSingleton.log({type: "admin", req});
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