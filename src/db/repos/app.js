import MongoComponent from './MongoComponent';
import { AppSchema } from '../schemas';
import { 
    pipeline_revenue_stats, 
    pipeline_user_stats, 
    pipeline_bet_stats, 
    pipeline_game_stats, 
    pipeline_app_wallet,
    pipeline_get_by_external_id,
    pipeline_last_bets,
    pipeline_biggest_bet_winners,
    pipeline_biggest_user_winners,
    pipeline_popular_numbers
} from './pipelines/app';

import { populate_app_all, populate_app_affiliates } from './populates';
import { throwError } from '../../controllers/Errors/ErrorManager';


let foreignKeys = ['wallet', 'users', 'games'];

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


class AppRepository extends MongoComponent{

    constructor(){
        super(AppSchema)
    }
    /**
     * @function setAppModel
     * @param App Model
     * @return {Schema} AppModel
     */

    setModel = (App) => {
        return AppRepository.prototype.schema.model(App)
    }

    addGame(app_id, game){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, games : {$nin : [game._id] } }, 
                { $push: { "games" : game } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }

    addTypography(app_id, typography){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, typography : {$nin : [typography._id] } }, 
                { $push: { "typography" : typography } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }

    addUser(app_id, user){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, users : {$nin : [user._id] } }, 
                { $push: { "users" : user, "external_users" : user.external_id} },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    addCurrencyWallet(app_id, wallet){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, wallet : {$nin : [wallet._id] } }, 
                { $push: { "wallet" : wallet._id} },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    addCurrency(app_id, currency){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, currencies : {$nin : [currency._id] } }, 
                { $push: { "currencies" : currency} },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }


    addDeposit(app_id, deposit){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, deposits : {$nin : [deposit._id] } }, 
                { $push: { "deposits" : deposit } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }



    async changeWithdrawPosition(_id, state){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findByIdAndUpdate(
                    { _id: _id}, 
                    { $set:  {  isWithdrawing : state} } )
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
            });
        }catch(err){
            throw (err)
        }
    }

    createAPIToken(app_id, bearerToken){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findByIdAndUpdate(
                app_id, 
                { $set: { "bearerToken" : new String(bearerToken) } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    getLastBets({id, size=15}){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_last_bets(id))
                .exec( (err, data) => {
                    if(err) { reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    getPopularNumbers({id, size=5}){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_popular_numbers(id))
                .exec( (err, data) => {
                    if(err) { reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    getBiggestBetWinners({id, size=15}){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_biggest_bet_winners(id))
                .exec( (err, data) => {
                    if(err) { reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    getBiggestUserWinners({id, size=15}){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_biggest_user_winners(id))
                .exec( (err, data) => {
                    if(err) { reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    findAppById(_id, populate_type=populate_app_all){
        switch(populate_type){
            case 'affiliates' : { populate_type = populate_app_affiliates; break; }
        }
        
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id)
                .populate(populate_type)
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }

    findAppByIdNotPopulated(_id){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id)
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }


    async addServices(app_id, services){
        try{
            await AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, services : {$nin : services } }, 
                { $set : { "services" : services } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (true);
                }
            )
        }catch(err){
            throw err;
        }
    }

    async editAffiliateSetup(app_id, affiliate_id){
        try{
            await AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id }, 
                { $set : { "affiliateSetup" : affiliate_id } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (item);
                }
            )
        }catch(err){
            throw err;
        }
    }

    async setIntegrationsId(app_id, integrations_id){
        try{
            await AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id }, 
                { $set : { "integrations" : integrations_id } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (item);
                }
            )
        }catch(err){
            throw err;
        }
    }

    async setCustomizationId(app_id, customization_id){
        try{
            await AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id }, 
                { $set : { "customization" : customization_id } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (item);
                }
            )
        }catch(err){
            throw err;
        }
    }

    async setTypographyId(app_id, typography_id){
        try{
            await AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id }, 
                { $set : { "typography" : typography_id } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (item);
                }
            )
        }catch(err){
            throw err;
        }
    }

    async setHostingInformation(app_id, {hosting_id, web_url}){
        try{
            await AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id }, 
                { $set : {  "hosting_id" : hosting_id, "web_url" :  web_url} },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (item);
                }
            )
        }catch(err){
            throw err;
        }
    }
  
    findUserByExternalId(app_id, user_external_id){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_get_by_external_id(app_id,user_external_id))
                .exec( (err, user) => {
                    if(err) { reject(err)}
                    let ret;
                    if(user.length == 0){ ret = null; }else{
                        ret = user[0].user;
                    }
                    resolve(ret);
                });
            });
        }catch(err){
            throw err;
        }
    }

    addWithdraw(id, withdraw){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: id, withdraws : {$nin : [withdraw._id] } }, 
                { $push: { "withdraws" : withdraw } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }

    findApp = (App_name) => {
        return new Promise( (resolve, reject) => {
            AppRepository.prototype.schema.model.findOne({'name' : App_name})
            .exec( (err, App) => {
                if(err) {reject(err)}
                resolve(App);
            });
        });
    }

    /**
     * 
     * @param {Mongoose Id} _id 
     */

    async getSummaryStats(type, _id, { dates, currency }){ 

        let pipeline;

        /**
         * @input Type
         * @output Pipeline
         */
        switch (type){
            case 'users' : pipeline = pipeline_user_stats; break;
            case 'games' : pipeline = pipeline_game_stats; break;
            case 'revenue' : pipeline = pipeline_revenue_stats; break;
            case 'bets' : pipeline = pipeline_bet_stats; break;
            case 'wallet' : pipeline = pipeline_app_wallet; break;
            default : throw new Error(` Type : ${type} is not accepted as a Summary Type API Call`);
        }

        return new Promise( (resolve, reject) => {
            AppRepository.prototype.schema.model
            .aggregate(pipeline(_id, { dates, currency }))
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    async getAll(){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.find().lean().populate(foreignKeys)
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }

    async getAllBySize(limit){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.find().lean().populate(foreignKeys).limit(limit)
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }
}

AppRepository.prototype.schema = new AppSchema();

export default AppRepository;