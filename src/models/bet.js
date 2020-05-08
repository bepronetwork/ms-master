import {BetLogic} from '../logic';
import ModelComponent from './modelComponent';
import {BetsRepository, UsersRepository} from '../db/repos';
import { isCasino } from '../logic/markets/betSystems';
import { MapperBetSingleton } from "../controllers/Mapper";

class Bet extends ModelComponent{

    constructor(params){

        let db = new BetsRepository();

        super(
            {
                name : 'Bet', 
                logic : new BetLogic({db : db}), 
                db : db,
                self : null, 
                params : params
            }
            );
    }

    async register(){
        const { user } = this.self.params;

        try{
            await UsersRepository.prototype.changeWithdrawPosition(user, true);
            let res = await this.process('Auto');
            UsersRepository.prototype.changeWithdrawPosition(user, false);
            return MapperBetSingleton.output('Bet', res);
        }catch(err){
            if(parseInt(err.code) != 14){
                /* If not betting/withdrawing atm */
                /* Open Mutex */
                UsersRepository.prototype.changeWithdrawPosition(user, false);
            }
            throw err;
        }
    }

    async save(){
        try{
            let res = await this.process('Register');
            return res;
        }catch(err){
            throw err;
        }
    }

    async resolve(){
        try{
            return await this.process('Resolve');
        }catch(err){
            throw err;
        }
    } 

}

export default Bet;