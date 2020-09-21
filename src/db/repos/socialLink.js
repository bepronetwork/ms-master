import MongoComponent from './MongoComponent';
import { SocialLinkSchema } from '../schemas';

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


class SocialLinkRepository extends MongoComponent{

    constructor(){
        super(SocialLinkSchema)
    }
    /**
     * @function setSocialLinkModel
     * @param SocialLink Model
     * @return {Schema} SocialLinkModel
     */

    setModel = (SocialLink) => {
        return SocialLinkRepository.prototype.schema.model(SocialLink)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            SocialLinkRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateSocialLink({_id, newStructure}){
        return new Promise( (resolve,reject) => {
            SocialLinkRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "ids" : newStructure 
                } },
                { 'new': true })
                .lean()
                .exec( (err, item) => {
                    console.log("Item:: ",item)
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }
}

SocialLinkRepository.prototype.schema = new SocialLinkSchema();

export default SocialLinkRepository;