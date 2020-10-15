import { LanguageLogic } from '../logic';
import { LanguageRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Language extends ModelComponent{

    constructor(params){

        let db = new LanguageRepository();

        super(
            {
                name : 'Language', 
                logic : new LanguageLogic({db : db}), 
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

export default Language;