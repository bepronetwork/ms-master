import { BackgroundLogic } from '../logic';
import { BackgroundRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Background extends ModelComponent{

    constructor(params){

        let db = new BackgroundRepository();

        super(
            {
                name : 'Background', 
                logic : new BackgroundLogic({db : db}), 
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

export default Background;