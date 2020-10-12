import MongoComponent from './MongoComponent';
import { SubSectionsSchema } from '../schemas';

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


class SubSectionsRepository extends MongoComponent{

    constructor(){
        super(SubSectionsSchema)
    }
    /**
     * @function setSubSectionsModel
     * @param SubSections Model
     * @return {Schema} SubSectionsModel
     */

    setModel = (SubSections) => {
        return SubSectionsRepository.prototype.schema.model(SubSections)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            SubSectionsRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            SubSectionsRepository.prototype.schema.model.findByIdAndUpdate(
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

    addNewLanguage({_id, language}){
        return new Promise( (resolve,reject) => {
            SubSectionsRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $push: { 
                    "languages" : language
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

SubSectionsRepository.prototype.schema = new SubSectionsSchema();

export default SubSectionsRepository;