import { TopTabEsportsLogic } from '../logic';
import { TopTabEsportsRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class TopTabEsports extends ModelComponent{

    constructor(params){

        let db = new TopTabEsportsRepository();

        super(
            {
                name : 'TopTabEsports', 
                logic : new TopTabEsportsLogic({db : db}), 
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

export default TopTabEsports;