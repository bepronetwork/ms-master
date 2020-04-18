import MongoComponent from './MongoComponent';
import { BalanceSchema } from '../schemas';

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


class BalanceRepository extends MongoComponent{

    constructor(){
        super(BalanceSchema)
    }
    /**
     * @function setBalanceModel
     * @param Balance Model
     * @return {Schema} BalanceModel
     */

    setModel = (Balance) => {
        return BalanceRepository.prototype.schema.model(Balance)
    }

    updateBalance(_id, currency, initialBalance){
        return new Promise( (resolve,reject) => {
            BalanceRepository.prototype.schema.model.updateOne(
                {_id, "initialBalanceList.currency": currency},
                {
                    $set: {
                        "initialBalanceList.$.initialBalance" : parseFloat(initialBalance)
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

BalanceRepository.prototype.schema = new BalanceSchema();

export default BalanceRepository;