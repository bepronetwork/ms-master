import { TopTabCassinoLogic } from '../logic';
import { TopTabCassinoRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class TopTabCassino extends ModelComponent{

    constructor(params){

        let db = new TopTabCassinoRepository();

        super(
            {
                name : 'TopTabCassino', 
                logic : new TopTabCassinoLogic({db : db}), 
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

export default TopTabCassino;