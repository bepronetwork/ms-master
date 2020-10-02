import { AnalyticsLogic } from '../logic';
import { AnalyticsRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class Analytics extends ModelComponent{

    constructor(params){

        let db = new AnalyticsRepository();

        super(
            {
                name : 'Analytics', 
                logic : new AnalyticsLogic({db : db}), 
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

export default Analytics;