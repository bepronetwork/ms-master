import { EsportsScrennerLogic } from '../logic';
import { EsportsScrennerRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class EsportsScrenner extends ModelComponent{

    constructor(params){

        let db = new EsportsScrennerRepository();

        super(
            {
                name : 'EsportsScrenner', 
                logic : new EsportsScrennerLogic({db : db}), 
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

export default EsportsScrenner;