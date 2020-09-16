import MongoComponent from '../MongoComponent';
import { SkinSchema } from '../../schemas/ecosystem/skin';

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

class SkinEcoRepository extends MongoComponent{

    constructor(){
        super(SkinSchema)
    }
    /**
     * @function setSkinModel
     * @param Skin Model
     * @return {Schema} SkinModel
     */

    setModel = (Skin) => {
        return this.schema.model(Skin)
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

SkinEcoRepository.prototype.schema = new SkinSchema();

export default SkinEcoRepository;