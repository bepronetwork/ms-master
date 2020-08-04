import { TopTabLogic } from '../logic';
import { TopTabRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class TopTab extends ModelComponent{

    constructor(params){

        let db = new TopTabRepository();

        super(
            {
                name : 'TopTab', 
                logic : new TopTabLogic({db : db}), 
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

export default TopTab;