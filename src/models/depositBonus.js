import { DepositBonusLogic } from '../logic';
import { DepositBonusRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class DepositBonus extends ModelComponent {

    constructor(params) {

        let db = new DepositBonusRepository();

        super(
            {
                name: 'DepositBonus',
                logic: new DepositBonusLogic({ db: db }),
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

export default DepositBonus;