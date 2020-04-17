import MongoComponent from './MongoComponent';
import { AddOnSchema } from '../schemas';

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


class AddOnRepository extends MongoComponent{

    constructor(){
        super(AddOnSchema)
    }
    /**
     * @function setAddOnModel
     * @param AddOn Model
     * @return {Schema} AddOnModel
     */

    setModel = (AddOn) => {
        return AddOnRepository.prototype.schema.model(AddOn)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            AddOnRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    addJackpot(addOn_id, jackpot){ 
        return new Promise( (resolve, reject) => {
            AddOnRepository.prototype.schema.model.findByIdAndUpdate(
                addOn_id,
                {
                    $set: {jackpot}
                }
            )
            .exec((err, item) => {
                if(err){reject(err)}
                resolve(item);
            });
        });
    }

    addBalance(addOn_id, balance){ 
        return new Promise( (resolve, reject) => {
            AddOnRepository.prototype.schema.model.findByIdAndUpdate(
                addOn_id,
                {
                    $set: {balance}
                }
            )
            .exec((err, item) => {
                if(err){reject(err)}
                resolve(item);
            });
        });
    }

    addAutoWithdraw(addOn_id, autoWithdraw){
        return new Promise( (resolve, reject) => {
            AddOnRepository.prototype.schema.model.findByIdAndUpdate(
                addOn_id,
                {
                    $set: {autoWithdraw}
                },
                {'new': true}
            )
            .exec( async (err, item) => {
                if(err){reject(err)}
                resolve(item);
            });
        });
    }

}

AddOnRepository.prototype.schema = new AddOnSchema();

export default AddOnRepository;