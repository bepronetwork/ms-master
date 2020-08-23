import { SubSectionsLogic } from '../logic';
import { SubSectionsRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class SubSections extends ModelComponent{

    constructor(params){

        let db = new SubSectionsRepository();

        super(
            {
                name : 'SubSections', 
                logic : new SubSectionsLogic({db : db}), 
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

export default SubSections;