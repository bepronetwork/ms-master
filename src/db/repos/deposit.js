import MongoComponent from './MongoComponent';
import { DepositSchema } from '../schemas/deposit';
import { pipeline_transactions_app } from './pipelines/transactions';

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

class DepositRepository extends MongoComponent {

    constructor() {
        super(DepositSchema)
    }
    /**
     * @function setDepositModel
     * @param Deposit Model
     * @return {Schema} DepositModel
     */

    setModel = (Deposit) => {
        return DepositRepository.prototype.schema.model(Deposit)
    }

    findDepositById(_id) {
        return new Promise((resolve, reject) => {
            DepositRepository.prototype.schema.model.findById(_id)
                .populate(foreignKeys)
                .exec((err, Deposit) => {
                    if (err) { reject(err) }
                    resolve(Deposit);
                });
        });
    }

    getTransactionsByApp(app, filters = [], size, offset) {
        try {
            let pipeline = pipeline_transactions_app(app, filters, size, offset);
            return new Promise((resolve, reject) => {
                DepositRepository.prototype.schema.model
                    .aggregate(pipeline)
                    .exec((err, deposits) => {
                        if (err) {
                            deposits = []
                            reject(err)
                        }
                        resolve(deposits);
                    });
            });
        } catch (err) {
            throw err;
        }
    }

    getDepositByTransactionHash(transactionHash) {
        return new Promise((resolve, reject) => {
            DepositRepository.prototype.schema.model
                .findOne({ transactionHash })
                .lean()
                .exec((err, Deposit) => {
                    if (err) { reject(err) }
                    resolve(Deposit)
                });
        });
    }

    deleteDepositByTransactionHash(transactionHash) {
        return new Promise((resolve, reject) => {
            DepositRepository.prototype.schema.model
                .findOneAndDelete({ transactionHash })
                .lean()
                .exec((err, Deposit) => {
                    if (err) { reject(err) }
                    resolve(Deposit)
                });
        });
    }


    confirmDeposit(id, new_deposit_params) {
        return new Promise((resolve, reject) => {
            DepositRepository.prototype.schema.model.findByIdAndUpdate(id,
                {
                    $set:
                    {
                        amount: new_deposit_params.amount,
                        block: new_deposit_params.block,
                        usd_amount: new_deposit_params.usd_amount,
                        confirmed: new_deposit_params.confirmed,
                        confirmations: new_deposit_params.confirmations,
                        maxConfirmations: new_deposit_params.maxConfirmations,
                        last_update_timestamp: new_deposit_params.last_update_timestamp
                    }
                }, { new: true }
            )
                .lean()
                .exec((err, Deposit) => {
                    if (err) { reject(err) }
                    resolve(Deposit);
                });
        });
    }

    betscanGetDeposits({ offset, size, begin_at, end_at }) {
        try {
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
            return new Promise((resolve, reject) => {
                DepositRepository.prototype.schema.model.find({
                    creation_timestamp: {
                        $gte: new Date(begin_at),
                        $lte: new Date(end_at)
                    },
                })
                    .sort({ creation_timestamp: -1 })
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
                    .exec(async (err, item) => {
                        const totalCount = await DepositRepository.prototype.schema.model.find({
                            creation_timestamp: {
                                $gte: new Date(begin_at),
                                $lte: new Date(end_at)
                            },
                        }).countDocuments().exec();
                        if (err) { reject(err) }
                        resolve({ list: item, totalCount });
                    })
            });
        } catch (err) {
            throw err;
        }
    }

    getAll = async () => {
        return new Promise((resolve, reject) => {
            DepositRepository.prototype.schema.model.find().lean().populate(foreignKeys)
                .exec((err, docs) => {
                    if (err) { reject(err) }
                    resolve(docs);
                })
        })
    }
}

        DepositRepository.prototype.schema = new DepositSchema();

export default DepositRepository;