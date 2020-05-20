import { PopularNumberLogic } from '../logic';
import { PopularNumberRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class PopularNumber extends ModelComponent{

    constructor(params){

        let db = new PopularNumberRepository();

        super(
            {
                name : 'PopularNumber', 
                logic : new PopularNumberLogic({db : db}), 
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

export default PopularNumber;