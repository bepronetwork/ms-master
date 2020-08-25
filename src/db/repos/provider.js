import MongoComponent from './MongoComponent';
import { ProviderSchema } from '../schemas';

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


class ProviderRepository extends MongoComponent{

    constructor(){
        super(ProviderSchema)
    }
    /**
     * @function setProviderModel
     * @param Provider Model
     * @return {Schema} ProviderModel
     */

    setModel = (Provider) => {
        return ProviderRepository.prototype.schema.model(Provider)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            ProviderRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            ProviderRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "isActive"          : newStructure.isActive,
                    "backgroundColor"   : newStructure.backgroundColor,
                    "textColor"         : newStructure.textColor,
                    "text"              : newStructure.text
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

ProviderRepository.prototype.schema = new ProviderSchema();

export default ProviderRepository;