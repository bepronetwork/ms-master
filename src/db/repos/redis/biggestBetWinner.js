import MongoComponent from '../MongoComponent';
import { BiggestBetWinnerSchema } from '../../schemas/redis/biggetsBetWinners';

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


class BiggestBetWinnerRepository extends MongoComponent{

    constructor(){
        super(BiggestBetWinnerSchema)
    }
    /**
     * @function setBiggestBetWinnerModel
     * @param BiggestBetWinner Model
     * @return {Schema} BiggestBetWinnerModel
     */

    setModel = (BiggestBetWinner) => {
        return this.schema.model(BiggestBetWinner)
    }

    getBiggetsBetWinner({_id}){
        try{
            return new Promise( (resolve, reject) => {
                BiggestBetWinnerRepository.prototype.schema.model.find({
                    app : _id,
                })
                .exec( async (err, item) => {
                    if(err){reject(err)}
                    resolve({list: item, totalCount });
                })
            });
        }catch(err){
            throw err;
        }
    }
}

BiggestBetWinnerRepository.prototype.schema = new BiggestBetWinnerSchema();

export default BiggestBetWinnerRepository;