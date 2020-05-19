import MongoComponent from './MongoComponent';
import { BackgroundSchema } from '../schemas';

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


class BackgroundRepository extends MongoComponent{

    constructor(){
        super(BackgroundSchema)
    }
    /**
     * @function setBackgroundModel
     * @param Background Model
     * @return {Schema} BackgroundModel
     */

    setModel = (Background) => {
        return BackgroundRepository.prototype.schema.model(Background)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            BackgroundRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            BackgroundRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "id"          : newStructure.id,
                } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

}

BackgroundRepository.prototype.schema = new BackgroundSchema();

export default BackgroundRepository;