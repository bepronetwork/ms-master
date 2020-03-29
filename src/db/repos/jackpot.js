import MongoComponent from './MongoComponent';
import { JackpotSchema } from '../schemas';

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


class JackpotRepository extends MongoComponent{

    constructor(){
        super(JackpotSchema)
    }
    /**
     * @function setJackpotModel
     * @param Jackpot Model
     * @return {Schema} JackpotModel
     */

    setModel = (Jackpot) => {
        return JackpotRepository.prototype.schema.model(Jackpot)
    }

    updatePot(_id, currency, pot){
        return new Promise( (resolve,reject) => {
            JackpotRepository.prototype.schema.model.updateOne(
                {_id, "limits.currency": currency},
                {
                    $set: {
                        "limits.$.pot" : parseFloat(pot)
                    }
                }
            )
            .exec( async (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    findJackpotById(_id){
        try{
            return new Promise( (resolve, reject) => {
                JackpotRepository.prototype.schema.model.findById(_id)
                .exec( (err, item) => {
                    if(err) { reject(err)}
                    resolve(item);
                });
            });
        }catch(err){
            throw err;
        }
    }

}

JackpotRepository.prototype.schema = new JackpotSchema();

export default JackpotRepository;