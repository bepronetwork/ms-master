import { SkinLogic } from '../logic';
import { SkinRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Skin extends ModelComponent{

    constructor(params){

        let db = new SkinRepository();

        super(
            {
                name : 'Skin', 
                logic : new SkinLogic({db : db}), 
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

export default Skin;