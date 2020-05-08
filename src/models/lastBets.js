import { LastBetsLogic } from '../logic';
import { LastBetsRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class LastBets extends ModelComponent{

    constructor(params){

        let db = new LastBetsRepository();

        super(
            {
                name : 'LastBets', 
                logic : new LastBetsLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : [
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

export default LastBets;