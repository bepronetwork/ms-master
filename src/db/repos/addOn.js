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


class addOnRepository extends MongoComponent{

    constructor(){
        super(AddOnSchema)
    }
    /**
     * @function setAddOnModel
     * @param AddOn Model
     * @return {Schema} AddOnModel
     */

    setModel = (AddOn) => {
        return addOnRepository.prototype.schema.model(AddOn)
    }

    addJackpot(addOn, jackpot){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findByIdAndUpdate(
                    addOn,
                    {
                        $set: {jackpot}
                    }
                )
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                });
            });
        }catch(err){
            throw err;
        }
    }

}

addOnRepository.prototype.schema = new AddOnSchema();

export default addOnRepository;