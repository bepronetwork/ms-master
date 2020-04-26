import MongoComponent from '../MongoComponent';
import { BiggestUserWinnerSchema } from '../../schemas/redis/biggestUserWinner';

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


class BiggestUserWinnerRepository extends MongoComponent{

    constructor(){
        super(BiggestUserWinnerSchema)
    }
    /**
     * @function setBiggestUserWinnerModel
     * @param BiggestUserWinner Model
     * @return {Schema} BiggestUserWinnerModel
     */

    setModel = (BiggestUserWinner) => {
        return this.schema.model(BiggestUserWinner)
    }

    getBiggetsUserWinner({_id}){
        try{
            return new Promise( (resolve, reject) => {
                BiggestUserWinnerRepository.prototype.schema.model.find({
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

BiggestUserWinnerRepository.prototype.schema = new BiggestUserWinnerSchema();

export default BiggestUserWinnerRepository;