import MongoComponent from './MongoComponent';
import { LanguageSchema } from '../schemas';

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


class LanguageRepository extends MongoComponent{

    constructor(){
        super(LanguageSchema)
    }
    /**
     * @function setChatModel
     * @param Language Model
     * @return {Schema} PermissionModel
     */

    setModel = (Language) => {
        return LanguageRepository.prototype.schema.model(Language)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            LanguageRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate({_id, logo, isActivated}){ 
        return new Promise( (resolve, reject) => {
            LanguageRepository.prototype.schema.model.findByIdAndUpdate(
                _id,
                { $set: {
                    "logo"  : logo,
                    "isActivated" : isActivated,
                }} 
                )
            .exec( async (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }
}

LanguageRepository.prototype.schema = new LanguageSchema();

export default LanguageRepository;