import { BiggestBetWinnerLogic } from '../logic';
import { BiggestBetWinnerRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class BiggestBetWinner extends ModelComponent{

    constructor(params){

        let db = new BiggestBetWinnerRepository();

        super(
            {
                name : 'BiggestBetWinner', 
                logic : new BiggestBetWinnerLogic({db : db}), 
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

export default BiggestBetWinner;