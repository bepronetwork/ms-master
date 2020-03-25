import { JackpotLogic } from '../logic';
import { JackpotRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Jackpot extends ModelComponent{

    constructor(params){

        let db = new JackpotRepository();

        super(
            {
                name : 'Jackpot',
                logic : new JackpotLogic({db : db}),
                db : db,
                self : null,
                params : params,
                children : [
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

export default Jackpot;