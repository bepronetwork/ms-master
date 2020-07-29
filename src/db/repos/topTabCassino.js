import MongoComponent from './MongoComponent';
import { TopTabCassinoSchema } from '../schemas';

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


class TopTabCassinoRepository extends MongoComponent{

    constructor(){
        super(TopTabCassinoSchema)
    }
    /**
     * @function setTopTabCassinoModel
     * @param TopTabCassino Model
     * @return {Schema} TopTabCassinoModel
     */

    setModel = (TopTabCassino) => {
        return TopTabCassinoRepository.prototype.schema.model(TopTabCassino)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            TopTabCassinoRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            TopTabCassinoRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "ids"          : newStructure.ids,
                    "autoDisplay"   : newStructure.autoDisplay
                } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

}

TopTabCassinoRepository.prototype.schema = new TopTabCassinoSchema();

export default TopTabCassinoRepository;