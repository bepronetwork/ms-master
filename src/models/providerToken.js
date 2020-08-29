import { ProviderTokenLogic } from '../logic';
import { ProviderTokenRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class ProviderToken extends ModelComponent{

    constructor(params){

        let db = new ProviderTokenRepository();

        super(
            {
                name : 'ProviderToken', 
                logic : new ProviderTokenLogic({db : db}), 
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

export default ProviderToken;