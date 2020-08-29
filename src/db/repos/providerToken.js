import MongoComponent from './MongoComponent';
import { ProviderTokenSchema } from '../schemas';

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


class ProviderTokenRepository extends MongoComponent{

    constructor(){
        super(ProviderTokenSchema)
    }
    /**
     * @function setProviderModel
     * @param Provider Model
     * @return {Schema} ProviderModel
     */

    setModel = (Provider) => {
        return ProviderTokenRepository.prototype.schema.model(Provider)
    }

    findByToken(token){ 
        return new Promise( (resolve, reject) => {
            ProviderRepository.prototype.schema.model.findOne({token})
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

}

ProviderTokenRepository.prototype.schema = new ProviderTokenSchema();

export default ProviderTokenRepository;