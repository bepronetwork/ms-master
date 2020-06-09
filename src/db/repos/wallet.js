import MongoComponent from './MongoComponent';
import { WalletSchema } from '../schemas/wallet';
import { PRICE_VIRTUAL_CURRENCY_GLOBAL } from '../../config';

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


class WalletsRepository extends MongoComponent{

    constructor(){
        super(WalletSchema)
    }
    /**
     * @function setWalletModel
     * @param Wallet Model
     * @return {Schema} WalletModel
     */

    setModel = (Wallet) => {
        return WalletsRepository.prototype.schema.model(Wallet)
    }

    updateCurrencyAmount(id, currency, amount){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findByIdAndUpdate(id,
                { $inc : { [currency] : parseFloat(amount) } } ,{ new: true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    updatePriceCurrencyVirtual({wallet, price, currency}) {
        return new Promise((resolve, reject)=>{
            WalletsRepository.prototype.schema.model.updateOne(
                {_id: wallet, "price.currency": currency},
                { $set: {
                    "price.$.amount" : parseFloat(price).toFixed(6)
                } },
                {'new' : true}
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    updateLogoCurrencyVirtual({wallet, imageURL}) {
        return new Promise((resolve, reject)=>{
            WalletsRepository.prototype.schema.model.findByIdAndUpdate(
                wallet,
                { $set: {
                    "image" : imageURL
                } },
                {'new' : true}
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    updateMaxDeposit(wallet_id, amount){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findByIdAndUpdate(wallet_id, {
                max_deposit: amount
            })
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    addCurrencyDepositToVirtualCurrency(virtual_wallet_id, currency_id){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findOneAndUpdate( 
                { _id: virtual_wallet_id }, 
                { $push: { "price" : {
                    currency        : currency_id,
                    amount          : PRICE_VIRTUAL_CURRENCY_GLOBAL
                } } },
                { 'new': true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    addAvailableDepositAddress(id, address){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findOneAndUpdate( 
                { _id: id}, 
                { $push: { 
                    "availableDepositAddresses" : {
                        address             : address
                    } 
                } },
                { 'new': true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    lockAvailableDepositAddress(id, {user, address, history}){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findOneAndUpdate( 
                /* Match by address */
                { _id: id, "availableDepositAddresses.address" : address }, 
                { $set: { 
                    'availableDepositAddresses.$.lockedAt'  : new Date(),
                    'availableDepositAddresses.$.lockedFor' : user,
                    'availableDepositAddresses.$.history'   : history
                }},
                { 'new': true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    updatePlayBalance(id, amount){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findByIdAndUpdate(id,
                { $inc : { playBalance : parseFloat(amount) } } ,{ new: true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    updatePlayBalanceBonus(id, amount){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findByIdAndUpdate(id,
                { $inc : { bonusAmount : parseFloat(amount) } } ,{ new: true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    updateIncrementBetAmountForBonus(id, amount){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findByIdAndUpdate(id,
                { $inc : { incrementBetAmountForBonus : parseFloat(amount) } } ,{ new: true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    updateMinBetAmountForBonusUnlocked(id, amount){
        return new Promise( (resolve, reject) => {
            WalletsRepository.prototype.schema.model.findByIdAndUpdate(id,
                { $inc : { minBetAmountForBonusUnlocked : parseFloat(amount) } } ,{ new: true }
            )
            .exec( (err, wallet) => {
                if(err) { reject(err)}
                resolve(wallet);
            });
        });
    }

    getAll = async() => {
        return new Promise( (resolve,reject) => {
            WalletsRepository.prototype.schema.model.find().lean().populate()
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }

    addDepositAddress(wallet_id, address){        
        return new Promise( (resolve,reject) => {
            WalletsRepository.prototype.schema.model.findOneAndUpdate(
                { _id: wallet_id, "depositAddresses" : {$nin : [address] } }, 
                { $push: { "depositAddresses" : address } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }

    updateBonusAndAmount({wallet_id, playBalance, bonusAmount}){        
        return new Promise( (resolve,reject) => {
            WalletsRepository.prototype.schema.model.findOneAndUpdate(
                { _id: wallet_id}, 
                { $set: { 
                    "playBalance" : playBalance,
                    "bonusAmount" : bonusAmount
                } })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(true);
                }
            )
        });
    }
}

WalletsRepository.prototype.schema = new WalletSchema();

export default WalletsRepository;