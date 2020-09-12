import MongoComponent from './MongoComponent';
import { SkinSchema } from '../schemas';

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


class SkinRepository extends MongoComponent{

    constructor(){
        super(SkinSchema)
    }
    /**
     * @function setSkinModel
     * @param Skin Model
     * @return {Schema} SkinModel
     */

    setModel = (Skin) => {
        return SkinRepository.prototype.schema.model(Skin)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            SkinRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate({_id, skin_type, name}){
        return new Promise( (resolve,reject) => {
            SkinRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "skin_type" : skin_type,
                    "name" : name,
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

SkinRepository.prototype.schema = new SkinSchema();

export default SkinRepository;