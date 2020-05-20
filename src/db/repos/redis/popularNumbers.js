import MongoComponent from '../MongoComponent';
import { PopularNumberSchema } from '../../schemas/redis';

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


class PopularNumberRepository extends MongoComponent{

    constructor(){
        super(PopularNumberSchema)
    }
    /**
     * @function setPopularNumberModel
     * @param PopularNumber Model
     * @return {Schema} PopularNumberModel
     */

    setModel = (PopularNumber) => {
        return this.schema.model(PopularNumber)
    }

    getPopularNumber({id}){
        try{
            return new Promise( (resolve, reject) => {
                PopularNumberRepository.prototype.schema.model.find({
                    app : id
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

PopularNumberRepository.prototype.schema = new PopularNumberSchema();

export default PopularNumberRepository;