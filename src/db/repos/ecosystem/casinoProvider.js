import MongoComponent from '../MongoComponent';
import { CasinoProviderSchema } from '../../schemas/ecosystem/casinoProvider';

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

class CasinoProviderEcoRepository extends MongoComponent{

    constructor(){
        super(CasinoProviderSchema)
    }
    /**
     * @function setCasinoProviderModel
     * @param CasinoProvider Model
     * @return {Schema} CasinoProviderModel
     */

    setModel = (CasinoProvider) => {
        return this.schema.model(CasinoProvider)
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

CasinoProviderEcoRepository.prototype.schema = new CasinoProviderSchema();

export default CasinoProviderEcoRepository;