import { ProviderLogic } from '../logic';
import { ProviderRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Provider extends ModelComponent{

    constructor(params){

        let db = new ProviderRepository();

        super(
            {
                name : 'Provider', 
                logic : new ProviderLogic({db : db}), 
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

    async getGamesProvider(){
        try{
            return await this.process('GetGamesProvider');
        }catch(err){
            throw err;
        }
    }
}

export default Provider;