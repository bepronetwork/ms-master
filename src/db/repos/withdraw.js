import MongoComponent from './MongoComponent';
import { WithdrawSchema } from '../schemas/withdraw';
import { pipeline_transactions_app } from './pipelines/transactions';
import { userWithdrawsFiltered } from './pipelines/withdraws';

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


const foreignKeys = ['user'];

class WithdrawRepository extends MongoComponent{

    constructor(){
        super(WithdrawSchema)
    }
    /**
     * @function setWithdrawModel
     * @param Withdraw Model
     * @return {Schema} WithdrawModel
     */

    setModel = (Withdraw) => {
        return WithdrawRepository.prototype.schema.model(Withdraw)
    }

    async getAppFiltered({size=20, offset=0, app, user, status}){
        return new Promise( (resolve,reject) => {
            WithdrawRepository.prototype.schema.model
            .aggregate(userWithdrawsFiltered({size, offset, app, user, status}))
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }
    
    findWithdrawById(_id){ 
        return new Promise( (resolve, reject) => {
            WithdrawRepository.prototype.schema.model.findById(_id)
            .populate(foreignKeys)
            .lean()
            .exec( (err, Withdraw) => {
                if(err) { reject(err)}
                resolve(Withdraw);
            });
        });
    }


    getTransactionsByApp(app, filters=[]){
        try{
            let pipeline =  pipeline_transactions_app(app, filters);
            return new Promise( (resolve, reject) => {
                WithdrawRepository.prototype.schema.model
                .aggregate(pipeline)
                .exec( (err, Withdraws) => {
                    if(err) { 
                        Withdraws=[]
                        reject(err)}
                    resolve(Withdraws);
                });
            });
        }catch(err){
            throw err;
        }
    }

    cancelWithdraw(id, params){
        return new Promise( (resolve, reject) => {
            WithdrawRepository.prototype.schema.model.findByIdAndUpdate(id,
                { $set:
                    {
                        done                    : true,
                        confirmed               : false,
                        status                  : 'Canceled',
                        last_update_timestamp   : params.last_update_timestamp,
                        note                    : params.note
                }},{ new: true }
            )
            .exec( (err, Withdraw) => {
                if(err) { reject(err)}
                resolve(Withdraw);
            });
        });
    }

    getWithdrawByTransactionHash(transactionHash){
        return new Promise( (resolve, reject) => {
            WithdrawRepository.prototype.schema.model
            .findOne({ transactionHash })
            .lean()
            .exec( (err, Withdraw) => {
                if(err) { reject(err)}
                resolve(Withdraw)            
            });
        });
    }


    confirmWithdraw(id, new_Withdraw_params){
        return new Promise( (resolve, reject) => {
            WithdrawRepository.prototype.schema.model.findByIdAndUpdate(id,
                { $set: 
                    { 
                        amount                  : new_Withdraw_params.amount,
                        block                   : new_Withdraw_params.block,
                        usd_amount              : new_Withdraw_params.usd_amount,
                        confirmed               : new_Withdraw_params.confirmed,
                        confirmations           : new_Withdraw_params.confirmations,
                        maxConfirmations        : new_Withdraw_params.maxConfirmations,
                        last_update_timestamp   : new_Withdraw_params.last_update_timestamp
                }},{ new: true }
            )
            .lean()
            .exec( (err, Withdraw) => {
                if(err) { reject(err)}
                resolve(Withdraw);
            });
        });
    }

    getAll = async() => {
        return new Promise( (resolve,reject) => {
            WithdrawRepository.prototype.schema.model.find().lean().populate(foreignKeys)
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }
}

WithdrawRepository.prototype.schema = new WithdrawSchema();

export default WithdrawRepository;