import MongoComponent from './MongoComponent';
import { TopTabEsportsSchema } from '../schemas';

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


class TopTabEsportsRepository extends MongoComponent{

    constructor(){
        super(TopTabEsportsSchema)
    }
    /**
     * @function setTopTabEsportsModel
     * @param TopTabEsports Model
     * @return {Schema} TopTabEsportsModel
     */

    setModel = (TopTabEsports) => {
        return TopTabEsportsRepository.prototype.schema.model(TopTabEsports)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            TopTabEsportsRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            TopTabEsportsRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "ids"          : newStructure.ids,
                    "autoDisplay"   : newStructure.autoDisplay
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

TopTabEsportsRepository.prototype.schema = new TopTabEsportsSchema();

export default TopTabEsportsRepository;