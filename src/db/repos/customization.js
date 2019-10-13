import MongoComponent from './MongoComponent';
import { CustomizationSchema } from '../schemas';

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


class CustomizationRepository extends MongoComponent{

    constructor(){
        super(CustomizationSchema)
    }
    /**
     * @function setCustomizationModel
     * @param Customization Model
     * @return {Schema} CustomizationModel
     */

    setModel = (Customization) => {
        return CustomizationRepository.prototype.schema.model(Customization)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            CustomizationRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

}

CustomizationRepository.prototype.schema = new CustomizationSchema();

export default CustomizationRepository;