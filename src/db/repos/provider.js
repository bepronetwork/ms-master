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

    findByApp(app){ 
        return new Promise( (resolve, reject) => {
            ProviderRepository.prototype.schema.model.find({app})
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate({_id, logo, api_key, api_url, name, activated, partner_id}){
        return new Promise( (resolve,reject) => {
            ProviderRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "api_key"    : api_key,
                    "api_url"    : api_url,
                    "logo"       : logo,
                    "name"       : name,
                    "activated"  : activated,
                    "partner_id" : partner_id
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