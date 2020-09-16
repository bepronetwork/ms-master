import MongoComponent from './MongoComponent';
import { MoonPaySchema } from '../schemas';

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


class MoonPayRepository extends MongoComponent{

    constructor(){
        super(MoonPaySchema)
    }
    /**
     * @function setMoonPayModel
     * @param MoonPay Model
     * @return {Schema} MoonPayModel
     */

    setModel = (MoonPay) => {
        return MoonPayRepository.prototype.schema.model(MoonPay)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            MoonPayRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate({moonpay_id, key, isActive}){
        return new Promise( (resolve,reject) => {
            MoonPayRepository.prototype.schema.model.findByIdAndUpdate(
                {_id: moonpay_id}, 
                { $set: { 
                    "key" : key,
                    "isActive"   : isActive
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

MoonPayRepository.prototype.schema = new MoonPaySchema();

export default MoonPayRepository;