import { BiggestUserWinnerLogic } from '../logic';
import { BiggestUserWinnerRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class BiggestUserWinner extends ModelComponent{

    constructor(params){

        let db = new BiggestUserWinnerRepository();

        super(
            {
                name : 'BiggestUserWinner', 
                logic : new BiggestUserWinnerLogic({db : db}), 
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

export default BiggestUserWinner;