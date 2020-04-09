import MiddlewareSingleton from '../helpers/middleware';

async function pingPost(req, res) {
    try {
        if(!await MiddlewareSingleton.log({type: req.body.type, req})){
            throw {code: 404, message: "Error in Log"};
        }
        let data = { message : 'Ping with Succcess'}
        MiddlewareSingleton.respond(res, req, data);
    } catch (error) {
        MiddlewareSingleton.respondError(res, error);
    }
}

export {
    pingPost
};