import MongoComponent from './MongoComponent';
import { KYCLogSchema } from '../schemas';

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


class KycLogRepository extends MongoComponent{

    constructor(){
        super(KYCLogSchema)
    }
    /**
     * @function setKycModel
     * @param Kyc Model
     * @return {Schema} KycModel
     */

    setModel = (Kyc) => {
        return KycLogRepository.prototype.schema.model(Kyc)
    }

}

KycLogRepository.prototype.schema = new KYCLogSchema();

export default KycLogRepository;