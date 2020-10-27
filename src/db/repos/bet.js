import MongoComponent from './MongoComponent';
import { BetSchema } from '../schemas';
import { populate_bet } from './populates';
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


const foreignKeys = ['user', 'game', 'betResultSpace'];

class BetsRepository extends MongoComponent{

    constructor(){
        super(BetSchema)
    }
    /**
     * @function setBetModel
     * @param Bet Model
     * @return {Schema} BetModel
     */

    setModel = (bet) => {
        return BetsRepository.prototype.schema.model(bet)
    }

    resolveBet(_id, params){
        return new Promise( (resolve,reject) => {
            BetsRepository.prototype.schema.model.findByIdAndUpdate(
                { _id: _id, isResolved : { $eq : false } }, 
                { $set: 
                    { 
                        outcomeRaw          : params.outcomeRaw,
                        outcomeResultSpace  : params.outcomeResultSpace,
                        winAmount           : params.winAmount,
                        isWon               : params.isWon,
                        blockhash           : params.blockHash,
                        isResolved          : true
                }},{ new: true })
                .lean()
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }
    
    findBetById(_id){ 
        return new Promise( (resolve, reject) => {
            BetsRepository.prototype.schema.model.findById(_id)
            .populate(populate_bet)
            .exec( (err, Bet) => {
                if(err) { reject(err)}
                resolve(Bet);
            });
        });
    }


    getAll = async() => {
        return new Promise( (resolve,reject) => {
            BetsRepository.prototype.schema.model.find().lean().populate(foreignKeys)
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        })
    }

    betscanGetBets({offset, size, begin_at, end_at}){
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
                BetsRepository.prototype.schema.model.find({
                    timestamp: { 
                        $gte: new Date( begin_at ), 
                        $lte: new Date ( end_at )
                    },
                })
                .sort({timestamp: -1})
                .populate([
                    {
                        path: 'app',
                        model: 'App',
                        select: { 
                            '_id': 1,
                            'name': 1
                        },
                    },
                    {
                        path: 'currency',
                        model: 'Currency',
                        select: { 
                            '_id': 1,
                            'ticker': 1
                         }
                    },
                ])
                .skip(offset == undefined ? 0 : offset)
                .limit((size > 500 || !size || size <= 0) ? 500 : size) // If limit > 500 then limit is equal 500, because limit must be 500 maximum
                .exec( async (err, item) => {
                    const totalCount = await BetsRepository.prototype.schema.model.find({
                        timestamp: { 
                            $gte: new Date( begin_at ), 
                            $lte: new Date ( end_at )
                        },
                    }).countDocuments().exec();
                    if(err){reject(err)}
                    resolve({list: item, totalCount });
                })
            });
        }catch(err){
            throw err;
        }
    }
}

BetsRepository.prototype.schema = new BetSchema();

export default BetsRepository;