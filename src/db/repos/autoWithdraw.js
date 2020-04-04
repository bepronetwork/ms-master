import MongoComponent from './MongoComponent';
import { AutoWithdrawSchema } from '../schemas';

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


class AutoWithdrawRepository extends MongoComponent{

    constructor(){
        super(AutoWithdrawSchema)
    }
    /**
     * @function setChatModel
     * @param AutoWithdraw Model
     * @return {Schema} PermissionModel
     */

    setModel = (AutoWithdraw) => {
        return AutoWithdrawRepository.prototype.schema.model(AutoWithdraw)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            AutoWithdrawRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateIsAutoWithdraw(_id, isAutoWithdraw){ 
        return new Promise( (resolve, reject) => {
            AutoWithdrawRepository.prototype.schema.model.findByIdAndUpdate(
                _id,
                { $set: {
                    "isAutoWithdraw"  : isAutoWithdraw
                }} 
                )
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateWithdrawAmount(_id, withdrawAmount){ 
        return new Promise( (resolve, reject) => {
            AutoWithdrawRepository.prototype.schema.model.findByIdAndUpdate(
                _id,
                { $set: {
                    "withdrawAmount"  : parseFloat(withdrawAmount)
                }} 
                )
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateVerifiedEmail(_id, verifiedEmail){ 
        return new Promise( (resolve, reject) => {
            AutoWithdrawRepository.prototype.schema.model.findByIdAndUpdate(
                _id,
                { $set: {
                    "verifiedEmail"  : verifiedEmail
                }} 
                )
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateVerifiedKYC(_id, verifiedKYC){ 
        return new Promise( (resolve, reject) => {
            AutoWithdrawRepository.prototype.schema.model.findByIdAndUpdate(
                _id,
                { $set: {
                    "verifiedKYC"  : verifiedKYC
                }} 
                )
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateMaxWithdrawAmountCumulative(_id, currency, amount){
        return new Promise( (resolve,reject) => {
            AutoWithdrawRepository.prototype.schema.model.updateOne(
                {_id, "maxWithdrawAmountCumulative.currency": currency},
                {
                    $set: {
                        "maxWithdrawAmountCumulative.$.amount" : parseFloat(amount)
                    }
                }
            )
            .exec( async (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    findByIdAndUpdateMaxWithdrawAmountPerTransaction(_id, currency, amount){
        return new Promise( (resolve,reject) => {
            AutoWithdrawRepository.prototype.schema.model.updateOne(
                {_id, "maxWithdrawAmountPerTransaction.currency": currency},
                {
                    $set: {
                        "maxWithdrawAmountPerTransaction.$.amount" : parseFloat(amount)
                    }
                }
            )
            .exec( async (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }
}

AutoWithdrawRepository.prototype.schema = new AutoWithdrawSchema();

export default AutoWithdrawRepository;