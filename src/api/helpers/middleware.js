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

    log(req) {
        try {
            let log = new Log({
                ip          : "192.0.0.1",
                countryCode : 1,
                route       : "/test",
                process     : "test",
                creator     : "test",
                time        : new Date()
            });
            console.log(log);
            // let data = await log.register();
            // MiddlewareSingleton.respond(res, data);
            return true;
        } catch(e) {
            console.log(e);
            return true;
        }
    }

}

let MiddlewareSingleton = new Middleware();

export default MiddlewareSingleton;