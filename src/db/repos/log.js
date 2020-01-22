import MongoComponent from './MongoComponent';
import { LogSchema } from '../schemas';

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


class LogRepository extends MongoComponent{

    constructor(){
        super(LogSchema)
    }
    /**
     * @function setLogModel
     * @param Log Model
     * @return {Schema} LogModel
     */

    setModel = (Log) => {
        return LogRepository.prototype.schema.model(Log)
    }

    // set() {
    //     return new Promise( (resolve, reject) => {
    //         LogRepository.prototype.schema.model.save();
    //     });
    // }

    // findById(_id){ 
    //     return new Promise( (resolve, reject) => {
    //         LogRepository.prototype.schema.model.findById(_id)
    //         .exec( (err, item) => {
    //             if(err) { reject(err)}
    //             resolve(item);
    //         });
    //     });
    // }


    // findByIdAndUpdate(_id, newStructure){
    //     return new Promise( (resolve,reject) => {
    //         LogRepository.prototype.schema.model.findByIdAndUpdate(
    //             _id, 
    //             { $set: { 
    //                 "type"          : newStructure.type,
    //                 "hex"           : newStructure.hex
    //             } },
    //             { 'new': true })
    //             .exec( (err, item) => {
    //                 if(err){reject(err)}
    //                 resolve(item);
    //             }
    //         )
    //     });
    // }

}

LogRepository.prototype.schema = new LogSchema();

export default LogRepository;