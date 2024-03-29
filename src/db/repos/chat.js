import MongoComponent from './MongoComponent';
import { ChatSchema } from '../schemas';

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


class ChatRepository extends MongoComponent{

    constructor(){
        super(ChatSchema)
    }
    /**
     * @function setChatModel
     * @param Chat Model
     * @return {Schema} ChatModel
     */

    setModel = (Chat) => {
        return ChatRepository.prototype.schema.model(Chat)
    }

    findById(_id){ 
        return new Promise( (resolve, reject) => {
            ChatRepository.prototype.schema.model.findById(_id)
            .lean()
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    findByIdAndUpdateChat({_id, publicKey, privateKey, isActive}){
        return new Promise( (resolve,reject) => {
            ChatRepository.prototype.schema.model.findByIdAndUpdate(
                _id, 
                { $set: { 
                    "publicKey" : publicKey,
                    "privateKey" : privateKey,
                    "isActive": isActive
                } },
                { 'new': true })
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

}

ChatRepository.prototype.schema = new ChatSchema();

export default ChatRepository;