import MongoComponent from '../MongoComponent';
import { BiggestBetWinnerEsportsSchema } from '../../schemas/redis';

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


class BiggestBetWinnerEsportsRepository extends MongoComponent{

    constructor(){
        super(BiggestBetWinnerEsportsSchema)
    }
    /**
     * @function setBiggestBetWinnerModel
     * @param BiggestBetWinnerEsports Model
     * @return {Schema} BiggestBetWinnerModel
     */

    setModel = (BiggestBetWinnerEsports) => {
        return this.schema.model(BiggestBetWinnerEsports)
    }

    getBiggestBetWinnerEsports({_id}){
        try{
            return new Promise( (resolve, reject) => {
                BiggestBetWinnerEsportsRepository.prototype.schema.model.find({
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

BiggestBetWinnerEsportsRepository.prototype.schema = new BiggestBetWinnerEsportsSchema();

export default BiggestBetWinnerEsportsRepository;