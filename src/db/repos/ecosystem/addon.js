import MongoComponent from '../MongoComponent';
import { AddOnSchema } from '../../schemas/ecosystem/addon';

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


class AddOnsEcoRepository extends MongoComponent{

    constructor(){
        super(AddOnSchema)
    }
    /**
     * @function setAddOnModel
     * @param AddOn Model
     * @return {Schema} AddOnModel
     */

    setModel = (AddOn) => {
        return this.schema.model(AddOn)
    }

    getAll(){
        return new Promise( (resolve,reject) => {
            this.schema.model.find()
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            });
        })
    }
}

AddOnsEcoRepository.prototype.schema = new AddOnSchema();

export default AddOnsEcoRepository;