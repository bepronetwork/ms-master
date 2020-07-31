import { PointSystemLogic } from '../logic';
import { PointSystemRepository } from '../db/repos';
import ModelComponent from './modelComponent';

class PointSystem extends ModelComponent {

    constructor(params) {

        let db = new PointSystemRepository();

        super(
            {
                name: 'PointSystem',
                logic: new PointSystemLogic({ db: db }),
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

export default PointSystem;