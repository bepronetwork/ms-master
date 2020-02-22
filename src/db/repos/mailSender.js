import MongoComponent from './MongoComponent';
import { MailSenderSchema } from '../schemas';
import AppRepository from './app';
import IntegrationsRepository from './integrations';
import Security from '../../controllers/Security/Security';

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


class MailSenderRepository extends MongoComponent{

    constructor(){
        super(MailSenderSchema)
    }
    /**
     * @function setMailSenderModel
     * @param MailSender Model
     * @return {Schema} MailSenderModel
     */

    setModel = (MailSender) => {
        return MailSenderRepository.prototype.schema.model(MailSender)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            MailSenderRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findApiKeyByAppId(app_id){ 
        return new Promise( async (resolve, reject) => {
            let app = await AppRepository.prototype.findAppById({_id : app_id});
            let integration = await IntegrationsRepository.prototype.findById(app.integrations);
            MailSenderRepository.prototype.schema.model.findById(integration.mailSender)
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    unhashedApiKey(app_id){ 
        return new Promise( async (resolve, reject) => {
            let mailSender = await MailSenderRepository.prototype.findApiKeyByAppId(app_id)
            resolve(await Security.prototype.decryptData(mailSender.apiKey));
        });
    }

    findByIdAndUpdate(_id, newStructure){
        return new Promise( (resolve,reject) => {
            MailSenderRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "apiKey" : newStructure.apiKey,
                    "templateIds" : newStructure.templateIds,
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

MailSenderRepository.prototype.schema = new MailSenderSchema();

export default MailSenderRepository;