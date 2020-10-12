import MongoComponent from './MongoComponent';
import { TopBarSchema } from '../schemas';

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


class TopBarRepository extends MongoComponent{

    constructor(){
        super(TopBarSchema)
    }
    /**
     * @function setTopBarModel
     * @param TopBar Model
     * @return {Schema} TopBarModel
     */

    setModel = (TopBar) => {
        return TopBarRepository.prototype.schema.model(TopBar)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            TopBarRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            TopBarRepository.prototype.schema.model.updateOne(
                {_id, "languages.language": newStructure.language},
                { $set: {
                    "languages.$.isActive"            : newStructure.isActive,
                    "languages.$.backgroundColor"     : newStructure.backgroundColor,
                    "languages.$.textColor"           : newStructure.textColor,
                    "languages.$.text"                : newStructure.text,
                    "languages.$.useStandardLanguage" : newStructure.useStandardLanguage,
                } })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

}

TopBarRepository.prototype.schema = new TopBarSchema();

export default TopBarRepository;