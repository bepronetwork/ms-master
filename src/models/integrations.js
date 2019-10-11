import { IntegrationsLogic } from '../logic';
import { IntegrationsRepository } from '../db/repos';
import ModelComponent from './modelComponent';
import { Chat } from '.';

class Integrations extends ModelComponent{

    constructor(params){

        let db = new IntegrationsRepository();

        super(
            {
                name : 'Integrations', 
                logic : new IntegrationsLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : [
                    new Chat
                ]
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

export default Integrations;