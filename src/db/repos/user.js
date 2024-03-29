import MongoComponent from './MongoComponent';
import { UserSchema } from '../schemas/user';

import { 
    pipeline_bet_stats, 
    pipeline_financial_stats, 
    pipeline_user_wallet,
    pipeline_all_users_balance,
    pipeline_my_bets,
    pipeline_bets_esports,
    pipeline_user_specific_stats,
    pipeline_users_deposits
} from './pipelines/user';
import { populate_user, populate_user_simple, populate_user_wallet, populate_users, populate_user_to_bet } from './populates';
import { throwError } from '../../controllers/Errors/ErrorManager';
import { usersFromAppFiltered } from './pipelines/user/users_from_app';
import { BetRepository } from "./";
import BetEsportsRepository from './betEsports';
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


const foreignKeys = ['wallet', 'app_id', 'withdraws', 'deposits', 'affiliate'];

class UsersRepository extends MongoComponent{

    constructor(){
        super(UserSchema)
    }
    /**
     * @function setUserModel
     * @param User Model
     * @return {Schema} UserModel
     */

    setModel = (user) => {
        return UsersRepository.prototype.schema.model(user)
    }

    updateUser({id, param}) {
        return new Promise( async (resolve,reject) => {
            UserSchema.prototype.model.findByIdAndUpdate(
                id,
                { $set : param },
                { 'new': true })
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    async findUserById(_id, populate_type=populate_user){
        switch(populate_type){
            case 'simple' : { populate_type=populate_user_simple; break; }
            case 'wallet' : { populate_type=populate_user_wallet; break; }
        }

        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.findById(_id)
                .populate(populate_type)
                .exec( (err, user) => {
                    if(err) { resolve(null)}
                    resolve(user);
                });
            });
        }catch(err){
            throw (err)
        }
    }

    updateLastTimeCurrencyFree(_id, newDate, currency){
        return new Promise( (resolve, reject) => {
            UsersRepository.prototype.schema.model.updateOne(
                {_id, "lastTimeCurrencyFree.currency": currency},
                { $set: { "lastTimeCurrencyFree.$.date" : newDate } }
            )
            .exec( (err, App) => {
                if(err) { reject(err)}
                resolve(App);
            });
        });
    }

    async findUserByIdAppId({app}){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.find(
                    {
                        app_id: app,
                        points: { $gt: 0 }
                    },
                    {
                       _id: 1,
                       username: 1,
                       app_id: 1,
                       wallet: 1,
                       points: 1
                    }
                )
                .populate([
                    'wallet'
                ])
                .exec( (err, user) => {
                    if(err) { reject(err)}
                    resolve(user);
                });
            });
        }catch(err){
            throw (err)
        }
    }

    async findUserByIdWithPoints(_id){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.findById(
                    _id,
                    {
                       _id: 1,
                       username: 1,
                       app_id: 1,
                       wallet: 1,
                       points: 1
                    }
                )
                .populate([
                    'wallet'
                ])
                .exec( (err, user) => {
                    if(err) { resolve(null)}
                    resolve(user);
                });
            });
        }catch(err){
            throw (err)
        }
    }

    updateUserPoints({_id, value}){
        return new Promise( (resolve, reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                {_id},
                { $set: {
                    points : value 
                    } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }


    async findUserByExternalId(external_id, populate_type=populate_user){
        switch(populate_type){
            case 'simple' : { populate_type=populate_user_simple; break; }
            case 'wallet' : { populate_type=populate_user_wallet; break; }
        }

        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.findOne({external_id})
                .populate(populate_type)
                .lean()
                .exec( (err, user) => {
                    if(err) { reject(null)}
                    resolve(user);
                });
            });
        }catch(err){
            throw (err)
        }
    }

    async findUserByIdToBet(_id){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.findById(_id, {bets:0,deposits:0,withdraws:0, hash_password:0})
                .populate(populate_user_to_bet)
                .lean()
                .exec( (err, user) => {
                    if(err) { reject(null)}
                    resolve(user);
                });
            });
        }catch(err){
            throw (err)
        }
    }

    async findUserStatsById(user, currency){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model
                .aggregate(pipeline_user_specific_stats(user, currency))
                .exec( (err, user) => {
                    if(err) { 
                        user = []
                        reject(err)
                    }
                    resolve(user);
                });
            });
        }catch(err){
            throw (err)
        }
    }

    async insertPoints(user, point){
        try{
            return new Promise( (resolve,reject) => {
                UsersRepository.prototype.schema.model.findByIdAndUpdate(
                    user,
                    { $inc : { points : parseFloat(point) } } ,{ new: true }
                )
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                })
            });
        }catch(err){
            throw (err)
        }
    }

    getBets({_id, size, dates, currency, game, offset}){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model
                .aggregate(pipeline_my_bets(_id,{ dates, currency, game, offset, size  }))
                .exec( (err, data) => {
                    if(err) { 
                        data=[]
                        reject(err)
                    }
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    getBetsEsports({_id, size, dates, currency, type, offset, slug}){
        try{
            return new Promise( (resolve, reject) => {
                BetEsportsRepository.prototype.schema.model
                .aggregate(pipeline_bets_esports(_id,{ size, dates, currency, type, offset, slug  }))
                .exec( (err, data) => {
                    if(err) { reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    getUserBets({_id, offset, size, bet = {}, currency = {}, game = {}}){
        try{
            return new Promise( (resolve, reject) => {
                BetRepository.prototype.schema.model.find({
                    user : _id,
                    ...bet,
                    ...game,
                    ...currency,
                    isJackpot : false
                })
                .sort({timestamp: -1})
                .skip(offset == undefined ? 0 : offset)
                .limit((size > 200 || !size || size <= 0) ? 200 : size) // If limit > 200 then limit is equal 200, because limit must be 200 maximum
                .exec( async (err, item) => {
                    const totalCount = await BetRepository.prototype.schema.model.find({
                        user : _id,
                        ...bet,
                        ...game,
                        ...currency,
                        isJackpot : false
                    }).countDocuments().exec();
                    if(err){reject(err)}
                    resolve({list: item, totalCount });
                })
            });
        }catch(err){
            throw err;
        }
    }

    setEmptyWallet(user_id){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findByIdAndUpdate(
                user_id, 
                { $set: { "wallet" : [] } },
                { 'new': true })
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    findUser(username){
        return new Promise( (resolve, reject) => {
            UsersRepository.prototype.schema.model.findOne({$or: [
                {"username": username},
                {"email": username}
            ]})
            .populate(populate_user)
            .lean()
            .exec( (err, user) => {
                if(err) {reject(err)}
                resolve(user);
            });
        });
    }

    findUserByEmail(email){
        return new Promise( (resolve, reject) => {
            UsersRepository.prototype.schema.model.findOne({'email' : new String(email).toLowerCase().trim()})
            .populate(populate_user)
            .lean()
            .exec( (err, user) => {
                if(err) {reject(err)}
                resolve(user);
            });
        });
    }

    editKycNeeded(_id, kyc_needed){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                {_id},
                { $set: { kyc_needed } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    editKycStatus(_id, kyc_status){
        return new Promise( (resolve, reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                {_id},
                { $set: { kyc_status } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    addDeposit(user_id, deposit){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                { _id: user_id, deposits : {$nin : [deposit._id] } }, 
                { $push: { "deposits" : deposit } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }
    
    addWithdraw(user_id, withdraw){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                { _id: user_id, withdraws : {$nin : [withdraw] } }, 
                { $push: { "withdraws" : withdraw } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }
    
    addBet(user_id, bet){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                { _id: user_id, bets : {$nin : [bet._id] } }, 
                { $push: { "bets" : bet } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    setAffiliateLink(user_id, affiliateLinkId){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                { _id: user_id },
                { $set: { "affiliateLink" : affiliateLinkId} },
                { 'new': true })
                .lean()
            .exec( (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    setAffiliate(user_id, affiliateId){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                { _id: user_id },
                { $set: { "affiliate" : affiliateId} },
                { 'new': true })
                .lean()
            .exec( (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    addCurrencyWallet(user_id, wallet){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                { _id: user_id, wallet : {$nin : [wallet._id] } }, 
                { $push: { "wallet" : wallet} },
                { 'new': true })
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    setSecurityId(user_id, securityId){
        return new Promise( (resolve, reject) => {
            UsersRepository.prototype.schema.model.findOneAndUpdate(
                { _id: user_id },
                { $set: { "security": securityId } },
                { 'new' : true })
                .lean()
            .exec( (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    async getAll(){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model.find().lean().populate(foreignKeys)
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }

    async getAllFiltered({size=30, offset=0, app, user, username, email}){
        return new Promise( (resolve,reject) => {
            UsersRepository.prototype.schema.model
            .aggregate(usersFromAppFiltered({size, offset, app, user, username, email}))
            .exec( (err, data) => {
                if(err) { 
                    data=[]
                    reject(err)
                }
                resolve(data.slice(0, size));
            });
        })
    }

    async changeWithdrawPosition(_id, state){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.findByIdAndUpdate(
                    _id,
                    { $set: { "isWithdrawing" : state} }) 
                    .exec( (err, item) => {
                        if(err){reject(err)}
                        try{
                            if((state == true) && (item.isWithdrawing == true)){throwError('WITHDRAW_MODE_IN_API')}
                            resolve(item);
                        }catch(err){
                            reject(err);
                        }

                    }
                )
            })
        }catch(err){
            throw (err)
        }
    }

    async changeDepositPosition(_id, state){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.findByIdAndUpdate(
                    { _id: _id },
                    { $set: { "isDepositing" : state} })
                    .lean() 
                    .exec( (err, item) => {
                        if(err){reject(err)}
                        try{
                            if((state == true) && (item.isDepositing == true)){throwError('DEPOSIT_MODE_IN_API')}
                            resolve(item);
                        }catch(err){
                            reject(err);
                        }

                    }
                )
            })
        }catch(err){
            throw (err)
        }
    }

    async getDepositByApp({app, offset, size, begin_at, end_at, user }) {
        switch (begin_at) {
            case "all":
                begin_at = new Date(new Date().setDate(new Date().getDate() - 20000));
                end_at = new Date(new Date().setDate(new Date().getDate() + 100));
                break;
            case undefined:
                begin_at = new Date(new Date().setDate(new Date().getDate() - 20000));
                break;
        }
        switch (end_at) {
            case undefined:
                end_at = (new Date(new Date().setDate(new Date().getDate() + 1))).toISOString().split("T")[0];
                break;
            case end_at:
                end_at = (new Date(new Date().setDate(new Date(end_at).getDate() + 2))).toISOString().split("T")[0];
                break;
        }
        try {
            return new Promise((resolve, reject) => {
                UsersRepository.prototype.schema.model
                .aggregate(pipeline_users_deposits({ app, offset, size, begin_at, end_at, user }))
                .exec(async (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                });
            });
        } catch (err) {
            throw (err)
        }
    }

    async getAllUsersBalance({app}){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model
                .aggregate(pipeline_all_users_balance(app))
                .exec( (err, item) => {
                    if(err) { 
                        item=[]
                        reject(err)
                    }
                    var res;
                    if(!item || !item[0]){ res = { balance : 0} }
                    else{res = item[0]}
                    resolve(res);
                });
            })
        }catch(err){
            throw err;
        }
        
    }

    // async findUserByExternalId(external_id){
    //     try{
    //         return new Promise( (resolve, reject) => {
    //             UsersRepository.prototype.schema.model.find({external_id : external_id})
    //             .populate(foreignKeys)
    //             .lean()
    //             .exec( (err, user) => {
    //                 if(err) { reject(err)}
    //                 resolve(user);
    //             });
    //         });
    //     }catch(err){
    //         throw (err)
    //     }
    // }

    async findUserByAddress({address, app}){
        try{
            return new Promise( (resolve, reject) => {
                UsersRepository.prototype.schema.model.find(
                    { $and: [ { address: address}, { app_id: app} ] })
                .populate(foreignKeys)
                .lean()
                .exec( (err, users) => {
                    if(err) { reject(err)}
                    var res;
                    if(users.length > 0) {res = users};
                    if(users.length == 0) {res = null}
                    resolve(res);
                });
            });
        }catch(err){
            throw (err)
        }
    }


    async getSummaryStats(type, _id, { dates, currency }){ 

        let pipeline;

        /**
         * @input Type
         * @output Pipeline
         */

        switch (new String(type).toUpperCase().trim()){
            case 'FINANCIAL' : pipeline = pipeline_financial_stats; break;
            case 'BETS' : pipeline = pipeline_bet_stats; break;
            case 'WALLET' : pipeline = pipeline_user_wallet; break;
            default : throw new Error(` Type : ${type} is not accepted as a Summary Type API Call`);
        }

        return new Promise( (resolve, reject) => {
            UsersRepository.prototype.schema.model
            .aggregate(pipeline(_id, { dates, currency }))
            .exec( (err, item) => {
                if(err) { 
                    item=[]
                    reject(err)
                }
                resolve(item);
            });
        });
    }
}

UsersRepository.prototype.schema = new UserSchema();

export default UsersRepository;