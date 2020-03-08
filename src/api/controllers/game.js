
import {
    App
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';

async function editGameTableLimit (req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameTableLimit();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editGameEdge(req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameEdge();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}

async function editGameImage(req, res) {
    try{
        SecuritySingleton.verify({type : 'admin', req});
        await MiddlewareSingleton.log({type: "admin", req});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameImage();
        MiddlewareSingleton.respond(res, data);
	}catch(err){
        MiddlewareSingleton.respondError(res, err);
	}
}


export {
    editGameTableLimit,
    editGameEdge,
    editGameImage
};