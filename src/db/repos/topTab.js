import MongoComponent from './MongoComponent';
import { TopTabSchema } from '../schemas';

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


class TopTabRepository extends MongoComponent{

    constructor(){
        super(TopTabSchema)
    }
    /**
     * @function setTopTabModel
     * @param TopTab Model
     * @return {Schema} TopTabModel
     */

    setModel = (TopTab) => {
        return TopTabRepository.prototype.schema.model(TopTab)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            TopTabRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateTopTab({_id, newStructure, isTransparent, useStandardLanguage, language}){
        return new Promise( (resolve,reject) => {
            TopTabRepository.prototype.schema.model.updateOne(
                {_id, "languages.language": language},
                { $set: {
                    "languages.$.ids"                 : newStructure,
                    "languages.$.isTransparent"       : isTransparent,
                    "languages.$.useStandardLanguage" : useStandardLanguage,
                } })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    addNewLanguage({_id, language}){
        return new Promise( (resolve,reject) => {
            TopTabRepository.prototype.schema.model.findByIdAndUpdate(
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

TopTabRepository.prototype.schema = new TopTabSchema();

export default TopTabRepository;