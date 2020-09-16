import { MoonPayLogic } from '../logic';
import { MoonPayRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class MoonPay extends ModelComponent{

    constructor(params){

        let db = new MoonPayRepository();

        super(
            {
                name : 'MoonPay', 
                logic : new MoonPayLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : []
            }
            );
    }

    async register(){
        try{
            return await this.process('Register');
        }catch(err){
            throw err;
        }
    }
}

export default MoonPay;