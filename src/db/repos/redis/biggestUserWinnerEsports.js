import MongoComponent from '../MongoComponent';
import { BiggestUserWinnerEsportsSchema } from '../../schemas/redis';

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


class BiggestUserWinnerEsportsRepository extends MongoComponent{

    constructor(){
        super(BiggestUserWinnerEsportsSchema)
    }
    /**
     * @function setBiggestUserWinnerEsportsModel
     * @param BiggestUserWinnerEsports Model
     * @return {Schema} BiggestUserWinnerEsportsModel
     */

    setModel = (BiggestUserWinnerEsports) => {
        return this.schema.model(BiggestUserWinnerEsports)
    }

    getBiggestUserWinnerEsports({_id}){
        try{
            return new Promise( (resolve, reject) => {
                BiggestUserWinnerEsportsRepository.prototype.schema.model.find({
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

BiggestUserWinnerEsportsRepository.prototype.schema = new BiggestUserWinnerEsportsSchema();

export default BiggestUserWinnerEsportsRepository;