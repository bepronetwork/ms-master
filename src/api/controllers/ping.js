import MiddlewareSingleton from '../helpers/middleware';

async function pingPost(req, res) {
    try {
        await MiddlewareSingleton.log({type: req.body.type, req});
        MiddlewareSingleton.respond(res, {});
    } catch (e) {
        MiddlewareSingleton.respondError(res, e);
    }
}

export {
    pingPost
};