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
		let wallet = new Wallet(params);
        let data = await wallet.setMaxDeposit();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err);
	}
}

export {
    setMaxDeposit
}