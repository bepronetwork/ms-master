import { FreeCurrencyLogic } from '../logic';
import { FreeCurrencyRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class FreeCurrency extends ModelComponent{

    constructor(params){

        let db = new FreeCurrencyRepository();

        super({
            name : 'FreeCurrency',
            logic : new FreeCurrencyLogic({db : db}),
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

    async editAddonFreeCurrency() {
        try {
            return await this.process('EditAddonFreeCurrency');
        } catch (err) {
            throw err;
        }
    }

   async getAddonFreeCurrency() {
    // output Boolean
    try {
        let res = await this.process('GetAddonFreeCurrency');
        return res;
    } catch (err) {
        throw err;
    }
}

}

export default FreeCurrency;