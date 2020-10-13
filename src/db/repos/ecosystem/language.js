import MongoComponent from '../MongoComponent';
import { LanguageSchema } from '../../schemas/ecosystem';

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

class LanguageEcoRepository extends MongoComponent{

    constructor(){
        super(LanguageSchema)
    }
    /**
     * @function setLanguageModel
     * @param Language Model
     * @return {Schema} LanguageModel
     */

    setModel = (Language) => {
        return this.schema.model(Language)
    }
    async getById(_id){
        return new Promise( (resolve,reject) => {
            this.schema.model.findById(_id).lean()
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }
    async getAll(){
        return new Promise( (resolve,reject) => {
            this.schema.model.find().lean()
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }
}

LanguageEcoRepository.prototype.schema = new LanguageSchema();

export default LanguageEcoRepository;