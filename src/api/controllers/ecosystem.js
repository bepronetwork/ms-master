
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
        let ecosystem = new Ecosystem();
        let data = await ecosystem.getEcosystemData();
        await MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function getProviderEcosystem(req, res) {
    try{
        let ecosystem = new Ecosystem();
        let data = await ecosystem.getProviderEcosystem();
        await MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}
async function getCasinoGames(req, res) {
    try{
        let ecosystem = new Ecosystem();
        let data = await ecosystem.getCasinoGames();
        await MiddlewareSingleton.log({type: "global", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "global", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

export {
    getEcosystemData,    
    getCasinoGames,
    getProviderEcosystem
}