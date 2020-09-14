import MongoComponent from './MongoComponent';
import { IconsSchema } from '../schemas';

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


class IconsRepository extends MongoComponent{

    constructor(){
        super(IconsSchema)
    }
    /**
     * @function setIconsModel
     * @param Icons Model
     * @return {Schema} IconsModel
     */

    setModel = (Icons) => {
        return IconsRepository.prototype.schema.model(Icons)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            IconsRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            IconsRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "ids"          : newStructure.ids
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

IconsRepository.prototype.schema = new IconsSchema();

export default IconsRepository;