import { CripsrLogic } from '../logic';
import { CripsrRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Cripsr extends ModelComponent{

    constructor(params){

        let db = new CripsrRepository();

        super(
            {
                name : 'Cripsr', 
                logic : new CripsrLogic({db : db}), 
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

export default Cripsr;