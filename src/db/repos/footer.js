import MongoComponent from './MongoComponent';
import { FooterSchema } from '../schemas';
import { populate_footer } from './populates';

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


class FooterRepository extends MongoComponent{

    constructor(){
        super(FooterSchema)
    }
    /**
     * @function setFooterModel
     * @param Footer Model
     * @return {Schema} FooterModel
     */

    setModel = (Footer) => {
        return FooterRepository.prototype.schema.model(Footer)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            FooterRepository.prototype.schema.model.findById(_id)
            .populate(populate_footer)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }


    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            FooterRepository.prototype.schema.model.updateOne(
                {_id, "languages.language": newStructure.language},
                { $set: {
                    "languages.$.communityLinks"       : newStructure.communityLinks,
                    "languages.$.supportLinks"         : newStructure.supportLinks,
                    "languages.$.useStandardLanguage"  : newStructure.useStandardLanguage,
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
            FooterRepository.prototype.schema.model.findByIdAndUpdate(
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

FooterRepository.prototype.schema = new FooterSchema();

export default FooterRepository;