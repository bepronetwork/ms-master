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
}

BalanceRepository.prototype.schema = new BalanceSchema();

export default BalanceRepository;