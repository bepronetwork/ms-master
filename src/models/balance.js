import { BalanceLogic } from '../logic';
import { BalanceRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Balance extends ModelComponent{

    constructor(params){

        let db = new BalanceRepository();

        super({
            name : 'Balance',
            logic : new BalanceLogic({db : db}),
            db : db,
            self : null,
            params : params,
            children : []
        });
    }

    async register() {
        try {
            return await this.process('Register');
        } catch (err) {
            throw err;
        }
    }
    async editAddonBalance(){
        // Output = Boolean
        try{
            return await this.process('editAddonBalance');
        }catch(err){
            throw err;
        }
    }
}

export default Balance;