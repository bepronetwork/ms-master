import MongoComponent from './MongoComponent';
import { BannersSchema } from '../schemas';

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


class BannersRepository extends MongoComponent{

    constructor(){
        super(BannersSchema)
    }
    /**
     * @function setBannersModel
     * @param Banners Model
     * @return {Schema} BannersModel
     */

    setModel = (Banners) => {
        return BannersRepository.prototype.schema.model(Banners)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            BannersRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            BannersRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "ids"          : newStructure.ids,
                    "autoDisplay"  : newStructure.autoDisplay,
                    "fullWidth"    : newStructure.fullWidth
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
            BannersRepository.prototype.schema.model.findByIdAndUpdate(
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

BannersRepository.prototype.schema = new BannersSchema();

export default BannersRepository;