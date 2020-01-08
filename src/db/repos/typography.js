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
     * @param Typography Model
     * @return {Schema} TypographyModel
     */

    setModel = (Typography) => {
        return TypographyRepository.prototype.schema.model(Typography)
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

    setTypography(newStructure) {
        return new Promise(async (resolve, reject) => {
            let forSave = new TypographyRepository.prototype.schema.model({
                local: newStructure.local,
                url: newStructure.url,
                format: newStructure.format,
            });
            let result = await forSave.save();
            resolve(result);
        });
    }

}

TypographyRepository.prototype.schema = new TypographySchema();

export default TypographyRepository;