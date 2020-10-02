import MongoComponent from './MongoComponent';
import { AnalyticsSchema } from '../schemas';

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


class AnalyticsRepository extends MongoComponent{

    constructor(){
        super(AnalyticsSchema)
    }
    /**
     * @function setAnalyticsModel
     * @param Analytics Model
     * @return {Schema} AnalyticsModel
     */

    setModel = (Analytics) => {
        return AnalyticsRepository.prototype.schema.model(Analytics)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            AnalyticsRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate({_id, google_tracking_id, isActive}){
        return new Promise( (resolve,reject) => {
            AnalyticsRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "google_tracking_id" : google_tracking_id,
                    "isActive": isActive
                } },
                { 'new': true })
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

}

AnalyticsRepository.prototype.schema = new AnalyticsSchema();

export default AnalyticsRepository;