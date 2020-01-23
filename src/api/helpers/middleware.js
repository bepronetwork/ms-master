import { PUBLIC_KEY, PRIVATE_KEY } from '../../config';
import Log from '../../models/log';

const jwt   = require('jsonwebtoken');
// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY  = new String("-----BEGIN RSA PRIVATE KEY-----\n" + PRIVATE_KEY + "\n-----END RSA PRIVATE KEY-----").trim();
var publicKEY  =  new String("-----BEGIN PUBLIC KEY-----\n" + PUBLIC_KEY + "\n-----END PUBLIC KEY-----").trim();

class Middleware{
    constructor(){}


    sign(payload){
        try{
            let token = jwt.sign({ id : 'Auth/' + payload }, privateKEY, { algorithm: 'RS256' });
            return token;
        }catch(err){
            throw err;
        }
    };

    verify({token, payload, id}){
        try{
            let response = jwt.verify(token, publicKEY, { algorithm: 'RS256' });
            if('Auth/' + payload.id != response.id || payload.id != id){ throw err;};
            return true;
        }catch (err){
            return false;
        }
    };


    decode(token){
        return jwt.decode(token, {complete: true});
        //returns null if token is invalid
    }

    respond(res, data){
        try{
            res.json({
                data : {
                    status : 200,
                    message : data
                }
            });
        }catch(err){
            this.respondError(res, err)
        }
    }

    respondError(res, err){
        try{
            // Unknown Error
            if(!err.code){throw err}
            res.json({
                data : {
                    status : err.code,
                    message : err.message
                }
            });
        }catch(err){
            console.error(err)
            res.json({
                data : {
                    status : 404,
                    message : 'Internal Server Error'
                }
            });
        }
    }

    async log(req) {
        try {
            const data = {
                ip          : req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                process     : req.swagger.operation.definition.operationId,
                countryCode : req.ipInfo.error ? "LH" : req.ipInfo.country,
                route       : req.swagger.operation.pathToDefinition[1],
                creator     : {
                    adminId     : req.body.admin_id ? req.body.admin_id : null,
                    appId       : req.body.app_id   ? req.body.app_id   : null,
                    userId      : req.body.user_id  ? req.body.user_id  : null
                }
            };
            let log = new Log(data);
            let a = await log.register();
            console.log(a);
            return true;
        } catch(e) {
            return false;
        }
    }

}

let MiddlewareSingleton = new Middleware();

export default MiddlewareSingleton;