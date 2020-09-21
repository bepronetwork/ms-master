import MongoComponent from './MongoComponent';
import { CripsrSchema } from '../schemas';

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


class CripsrRepository extends MongoComponent{

    constructor(){
        super(CripsrSchema)
    }
    /**
     * @function setCripsrModel
     * @param Cripsr Model
     * @return {Schema} CripsrModel
     */

    setModel = (Cripsr) => {
        return CripsrRepository.prototype.schema.model(Cripsr)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            CripsrRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate({cripsr_id, key, isActive}){
        return new Promise( (resolve,reject) => {
            CripsrRepository.prototype.schema.model.findByIdAndUpdate(
                {_id: cripsr_id}, 
                { $set: { 
                    "key" : key,
                    "isActive"   : isActive
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

CripsrRepository.prototype.schema = new CripsrSchema();

export default CripsrRepository;