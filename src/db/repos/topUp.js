import MongoComponent from './MongoComponent';
import { TopUpSchema } from '../schemas';

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


class TopUpRepository extends MongoComponent{

    constructor(){
        super(TopUpSchema)
    }
    /**
     * @function setTopUpModel
     * @param TopUp Model
     * @return {Schema} TopUpModel
     */

    setModel = (TopUp) => {
        return TopUpRepository.prototype.schema.model(TopUp)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            TopUpRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateTopUp({_id, newStructure}){
        return new Promise( (resolve,reject) => {
            TopUpRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "reason"  : newStructure.reason,
                    "amount"  : newStructure.amount,
                    "currency"  : newStructure.currency,
                    "user"  : newStructure.user,
                    "admin"  : newStructure.admin,
                    "wallet"  : newStructure.wallet,
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

TopUpRepository.prototype.schema = new TopUpSchema();

export default TopUpRepository;