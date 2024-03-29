import MongoComponent from './MongoComponent';
import { AppSchema } from '../schemas';
import { 
    pipeline_revenue_stats, 
    pipeline_user_stats, 
    pipeline_bet_stats, 
    pipeline_game_stats, 
    pipeline_one_game_stats,
    pipeline_app_wallet,
    pipeline_get_by_external_id,
    pipeline_last_bets,
    pipeline_biggest_bet_winners,
    pipeline_popular_numbers,
    pipeline_biggest_user_winners,
    pipeline_get_users_bets
} from './pipelines/app';


import { populate_app_all, populate_app_to_bet, populate_app_affiliates, populate_jackpot, populate_app_simple, populate_app_wallet, populate_app_address, populate_app_auth, populate_app_game, populate_app_convert_points, populate_app_add_currency_wallet } from './populates';
import { throwError } from '../../controllers/Errors/ErrorManager';
import { BetRepository } from "./";
import populate_customization_all from './populates/customization/all';


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
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }

    setCountries(_id, restrictedCountries){
        return new Promise( async (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                {_id},
                {
                    $set : {
                        restrictedCountries
                    }
                }
            )
            .lean()
            .exec( (err, item) => {
                console.log(err);
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    findByIdAndUpdateVideogameEdge({_id, esports_edge}){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.updateOne(
                {_id},
                {
                    $set: {
                        "esports_edge" : parseFloat(esports_edge)
                    }
                }
            )
            .exec( async (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    async addTypography(_id, typography){
        return new Promise( async (resolve,reject) => {
            await AppRepository.prototype.schema.model.updateOne({_id}, { typography })
                .lean()
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
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    addAdmin(app_id, admin){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id: app_id, listAdmins : {$nin : [admin._id] } }, 
                { $push: { "listAdmins" : admin} },
                { 'new': true })
                .lean()
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
                .lean()
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
                .lean()
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
                .lean()
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
                    .lean()
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

    changeUserAllLockPosition(_id, state){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findByIdAndUpdate(
                    { _id: _id}, 
                    { $set:  {  "isUsersAllLocked" : state} } )
                    .lean()
                    .exec( (err, item) => {
                        if(err){reject(err)}
                        try{
                            if((state == true) && (item.isUsersAllLocked == true)){throwError('USER_LOCK_MODE_IN_API')}
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

    getLastBets({_id, size, offset, currency, game}){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_last_bets(_id, {currency, game, offset, size}))
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

    getPopularNumbers({id, size=5}){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_popular_numbers(id))
                .exec( (err, data) => {
                    if(err) { 
                        data=[]
                        reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    getAppBets({_id, offset, size, user = {}, bet = {}, currency = {}, game = {}, isJackpot = {}, begin_at, end_at}){
        try{
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
            return new Promise( (resolve, reject) => {
                BetRepository.prototype.schema.model.find({
                    app : _id,
                    ...user,
                    ...bet,
                    ...game,
                    ...currency,
                    ...isJackpot,
                    timestamp: { 
                        $gte: new Date( begin_at ), 
                        $lte: new Date ( end_at )
                    },
                })
                .sort({timestamp: -1})
                .populate([
                    'user'
                ])
                .skip(offset == undefined ? 0 : offset)
                .limit((size > 200 || !size || size <= 0) ? 200 : size) // If limit > 200 then limit is equal 200, because limit must be 200 maximum
                .exec( async (err, item) => {
                    const totalCount = await BetRepository.prototype.schema.model.find({
                        app : _id,
                        ...user,
                        ...bet,
                        ...game,
                        ...currency
                    }).countDocuments().exec();
                    if(err){reject(err)}
                    resolve({list: item, totalCount });
                })
            });
        }catch(err){
            throw err;
        }
    }

    getAppBetsPipeline({app, offset, size, user, _id, currency, game, isJackpot, username, begin_at, end_at }){
        try{
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
            return new Promise( (resolve, reject) => {
                BetRepository.prototype.schema.model
                .aggregate(pipeline_get_users_bets({app, offset, size, user, _id, currency, game, isJackpot, username, begin_at, end_at}))
                .exec( async (err, item) => {
                    const totalCount = await BetRepository.prototype.schema.model.find({
                        app,
                        ...user,
                        ..._id,
                        ...game,
                        ...currency
                    }).countDocuments().exec();
                    if(err){
                        item=[]
                        reject(err)}
                    resolve({list: item, totalCount });
                })
            });
        }catch(err){
            throw err;
        }
    }

    getBiggestBetWinners({_id, size, offset, currency, game}){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_biggest_bet_winners(_id, {currency, game, offset, size}))
                .exec( (err, data) => {
                    if(err) { 
                        data=[]
                        reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    getBiggestUserWinners({_id, size, offset, currency, game}){ 
        try{ 
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_biggest_user_winners(_id, {currency, game, offset, size}))
                .exec( (err, data) => {
                    if(err) { 
                        data = []
                        reject(err)}
                    resolve(data.slice(0, size));
                });
            });
        }catch(err){
            throw err;
        }
    }

    pushProvider(_id, provider) {
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findOneAndUpdate(
                { _id },
                { $push: { "casino_providers" : provider } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }

    findAppById(_id, populate_type=populate_app_all){
        let type = populate_type;
        switch(populate_type){
            case 'get_game' : { populate_type = populate_app_game; break; }
            case 'get_app_auth' : { populate_type = populate_app_auth; break; }
            case 'affiliates' : { populate_type = populate_app_affiliates; break; }
            case 'simple' : { populate_type = populate_app_simple; break; }
            case 'wallet' : { populate_type = populate_app_wallet; break; }
            case 'address' : { populate_type = populate_app_address; break; }
            case 'none' : { populate_type = []; break; }
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

    findAppByIdAddCurrencyWallet(_id){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id, {
                    '_id': 1,
                    'currencies': 1,
                    'games': 1,
                    'users': 1,
                    'wallet': 1,
                    'addOn': 1,
                    'virtual': 1
                })
                .populate(populate_app_add_currency_wallet)
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }

    findAppByIdToBet(_id){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id, {
                    games:0,
                    listAdmins:0,
                    services:0,
                    currencies:0,
                    users:0,
                    external_users:0,
                    deposits:0,
                    withdraws:0,
                    countriesAvailable:0,
                    licensesId:0,
                    bearerToken:0,
                    whitelistedAddresses:0,
                    restrictedCountries:0,
                    providers:0,
                    casino_providers:0,
                    typography:0,
                    integrations:0,
                    customization:0,
                    metadataJSON:0,
                })
                .populate(populate_app_to_bet)
                .lean()
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }

    findAppByIdWithJackpotPopulated(_id){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id)
                .populate(populate_jackpot)
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }
    findAppByIdConvertPoints(_id){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id, {
                    _id: 1,
                    addOn: 1
                })
                .populate(populate_app_convert_points)
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }
    findAppByIdPopulateCustomization(_id){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id,
                    {
                        _id: 1,
                        customization: 1
                })
                .populate([
                    {
                        path : 'customization',
                        model : 'Customization',
                        select : { '__v': 0 },
                        populate : populate_customization_all
                    }
                ])
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
                .lean()
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }

    findAppByIdHostingId(_id){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findById(_id, {
                    _id : 1,
                    hosting_id : 1,
                })
                .lean()
                .exec( (err, App) => {
                    if(err) { reject(err)}
                    resolve(App);
                });
            });
        }catch(err){
            throw err;
        }
    }

    removeTypography(_id){ 
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model.findByIdAndUpdate(
                    _id, 
                    { $set: { "typography" : [] }})
                    .lean()
                    .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
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
                .lean()
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
                .lean()
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (item);
                }
            )
        }catch(err){
            throw err;
        }
    }

    async editAppNameDescription({app_id, name, description}){
        try{
            await AppRepository.prototype.schema.model.findOneAndUpdate(
                {_id: app_id}, 
                { $set : { 
                    "name" : name,
                    "description" : description
                } },
                { 'new': true })
                .lean()
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
                .lean()
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
                .lean()
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
                .lean()
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
                .lean()
                .exec( (err, item) => {
                    if(err){throw(err)}
                    return (item);
                }
            )
        }catch(err){
            throw err;
        }
    }

    setEmptyWallet(app_id){
        return new Promise( (resolve,reject) => {
            AppRepository.prototype.schema.model.findByIdAndUpdate(
                app_id, 
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
  
    findUserByExternalId(app_id, user_external_id){
        try{
            return new Promise( (resolve, reject) => {
                AppRepository.prototype.schema.model
                .aggregate(pipeline_get_by_external_id(app_id, user_external_id))
                .exec( (err, user) => {
                    if(err) { 
                        user=[]
                        reject(err)}
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
                { _id: id, withdraws : {$nin : [withdraw] } }, 
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
            .lean()
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

    async getSummaryOneStats(_id, { currency, game }) {
        return new Promise( (resolve, reject) => {
            AppRepository.prototype.schema.model
            .aggregate(pipeline_one_game_stats(_id, { currency, game }))
            .exec( (err, item) => {
                if(err) { 
                    item=[]
                    reject(err)}
                resolve(item[0]==null ? null : item[0].game);
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
                if(err) { 
                    item=[]
                    reject(err)}
                resolve({item, type});
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