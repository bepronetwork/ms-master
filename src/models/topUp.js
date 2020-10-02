import { TopUpLogic } from '../logic';
import { TopUpRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class TopUp extends ModelComponent{

    constructor(params){

        let db = new TopUpRepository();

        super(
            {
                name : 'TopUp', 
                logic : new TopUpLogic({db : db}), 
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

export default TopUp;