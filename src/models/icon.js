import { IconsLogic } from '../logic';
import { IconsRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Icons extends ModelComponent{

    constructor(params){

        let db = new IconsRepository();

        super(
            {
                name : 'Icons', 
                logic : new IconsLogic({db : db}), 
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

export default Icons;