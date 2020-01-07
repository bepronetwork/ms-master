import MongoComponent from './MongoComponent';
import { TypographySchema } from '../schemas';

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


class TypographyRepository extends MongoComponent{

    constructor(){
        super(TypographySchema)
    }
    /**
     * @function setTypographyModel
     * @param Font Model
     * @return {Schema} TypographyModel
     */

    setModel = (Font) => {
        return TypographyRepository.prototype.schema.model(Font)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            TypographyRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            TypographyRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "local"          : newStructure.local,
                    "url"            : newStructure.url,
                    "format"         : newStructure.format
                } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

}

TypographyRepository.prototype.schema = new TypographySchema();

export default TypographyRepository;