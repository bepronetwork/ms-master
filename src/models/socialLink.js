import { SocialLinkLogic } from '../logic';
import { SocialLinkRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class SocialLink extends ModelComponent{

    constructor(params){

        let db = new SocialLinkRepository();

        super(
            {
                name : 'SocialLink', 
                logic : new SocialLinkLogic({db : db}), 
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

export default SocialLink;