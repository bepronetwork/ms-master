
import {
    App
} from '../../models';
import SecuritySingleton from '../helpers/security';
import MiddlewareSingleton from '../helpers/middleware';

async function editGameTableLimit (req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameTableLimit();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function editGameEdge(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameEdge();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function editGameImage(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin", "customization"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameImage();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}

async function editGameBackgroundImage(req, res) {
    try{
        await SecuritySingleton.verify({type : 'admin', req, permissions: ["super_admin", "customization"]});
        let params = req.body;
		let app = new App(params);
        let data = await app.editGameBackgroundImage();
        await MiddlewareSingleton.log({type: "admin", req, code: 200});
        MiddlewareSingleton.respond(res, req, data);
	}catch(err){
        await MiddlewareSingleton.log({type: "admin", req, code: err.code});
        MiddlewareSingleton.respondError(res, err, req);
	}
}


export {
    editGameTableLimit,
    editGameEdge,
    editGameImage,
    editGameBackgroundImage
};