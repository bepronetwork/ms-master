import { TxFeeLogic } from '../logic';
import { TxFeeRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class TxFee extends ModelComponent {

    constructor(params) {

        let db = new TxFeeRepository();

        super(
            {
                name: 'TxFee',
                logic: new TxFeeLogic({ db: db }),
                db: db,
                self: null,
                params: params,
                children: [
                ]
            }
        );
    }

    async register() {
        try {
            return await this.process('Register');
        } catch (err) {
            throw err;
        }
    }

}

export default TxFee;