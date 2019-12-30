import MongoComponent from './MongoComponent';
import { SrcTypographySchema } from '../schemas';

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


class SrcTypographyRepository extends MongoComponent{

    constructor(){
        super(SrcTypographySchema)
    }
    /**
     * @function setSrcTypographyModel
     * @param SrcFont Model
     * @return {Schema} SrcTypographyModel
     */

    setModel = (SrcFont) => {
        return SrcTypographyRepository.prototype.schema.model(SrcFont)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            SrcTypographyRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            SrcTypographyRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "local"          : newStructure.local,
                    "url"           : newStructure.url,
                    "format"           : newStructure.format
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

SrcTypographyRepository.prototype.schema = new SrcTypographySchema();

export default SrcTypographyRepository;