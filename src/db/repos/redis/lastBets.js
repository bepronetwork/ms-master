import MongoComponent from '../MongoComponent';
import { LastBetsSchema } from '../../schemas/redis/lastBets';

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


class LastBetsRepository extends MongoComponent{

    constructor(){
        super(LastBetsSchema)
    }
    /**
     * @function setLastBetsModel
     * @param LastBets Model
     * @return {Schema} LastBetsModel
     */

    setModel = (LastBets) => {
        return this.schema.model(LastBets)
    }

    getLastBets({_id, game }){
        try{
            return new Promise( (resolve, reject) => {
                LastBetsRepository.prototype.schema.model.find({
                    app : _id,
                    ...game
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

LastBetsRepository.prototype.schema = new LastBetsSchema();

export default LastBetsRepository;