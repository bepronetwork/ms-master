import MongoComponent from './MongoComponent';
import { EsportsScrennerSchema } from '../schemas';

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


class EsportsScrennerRepository extends MongoComponent{

    constructor(){
        super(EsportsScrennerSchema)
    }
    /**
     * @function setEsportsScrennerModel
     * @param EsportsScrenner Model
     * @return {Schema} EsportsScrennerModel
     */

    setModel = (EsportsScrenner) => {
        return EsportsScrennerRepository.prototype.schema.model(EsportsScrenner)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            EsportsScrennerRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdate({_id, link_url, button_text, title, subtitle}){
        return new Promise( (resolve,reject) => {
            EsportsScrennerRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "link_url"    : link_url,
                    "button_text" : button_text,
                    "title"       : title,
                    "subtitle"    : subtitle,
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

EsportsScrennerRepository.prototype.schema = new EsportsScrennerSchema();

export default EsportsScrennerRepository;