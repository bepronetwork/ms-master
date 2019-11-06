import { CustomizationLogic } from '../logic';
import { CustomizationRepository } from '../db/repos';
import ModelComponent from './modelComponent';
import { TopBar, Banners } from '.';

class Customization extends ModelComponent{

    constructor(params){

        let db = new CustomizationRepository();

        super(
            {
                name : 'Customization', 
                logic : new CustomizationLogic({db : db}), 
                db : db,
                self : null, 
                params : params,
                children : [
                    new TopBar(params),
                    new Banners(params)
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

export default Customization;