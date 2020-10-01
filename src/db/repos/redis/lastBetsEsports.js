import MongoComponent from '../MongoComponent';
import { LastBetsEsportsSchema } from '../../schemas/redis';

/**
 * Accounts database interaction class.
 *
 * @class
 * @memberof db.repos.accounts
 * @requires bluebird
 * @requires lodash
 * @requires db/sql.accounts
 * @see Parent: {@link db.repos.accounts}
 */


class LastBetsEsportsRepository extends MongoComponent{

    constructor(){
        super(LastBetsEsportsSchema)
    }
    /**
     * @function setLastBetsEsportsModel
     * @param LastBetsEsports Model
     * @return {Schema} LastBetsEsportsModel
     */

    setModel = (LastBetsEsports) => {
        return this.schema.model(LastBetsEsports)
    }

    getLastBetsEsports({_id}){
        try{
            return new Promise( (resolve, reject) => {
                LastBetsEsportsRepository.prototype.schema.model.find({
                    app : _id
                })
                .exec( async (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                })
            });
        }catch(err){
            throw err;
        }
    }
}

LastBetsEsportsRepository.prototype.schema = new LastBetsEsportsSchema();

export default LastBetsEsportsRepository;