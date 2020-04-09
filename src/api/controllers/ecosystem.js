
import {
	Ecosystem,
} from '../../models';
import MiddlewareSingleton from '../helpers/middleware';

/**
 * Description of the function.
 *
 * @class
 * @memberof api.controllers.Apps.postApp
 * @requires lodash
 * @requires helpers/apiError
 * @requires helpers/swagger.generateParamsErrorObject
 * @todo Add description of AppsController
 */

async function getEcosystemData(req, res) {
    try {
        await MiddlewareSingleton.log({type: "global", req});
        let ecosystem = new Ecosystem();
        let data = await ecosystem.getEcosystemData();
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function getCasinoGames(req, res) {
    try{
        await MiddlewareSingleton.log({type: "global", req});
        let ecosystem = new Ecosystem();
        let data = await ecosystem.getCasinoGames();
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

export {
    getEcosystemData,    
    getCasinoGames
}