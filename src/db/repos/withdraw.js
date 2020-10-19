import MongoComponent from './MongoComponent';
import { WithdrawSchema } from '../schemas/withdraw';
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

class WithdrawRepository extends MongoComponent {

    constructor() {
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

    findWithdrawById(_id) {
        return new Promise((resolve, reject) => {
            WithdrawRepository.prototype.schema.model.findById(_id)
                .populate(foreignKeys)
                .lean()
                .exec((err, Withdraw) => {
                    if (err) { reject(err) }
                    resolve(Withdraw);
                });
        });
    }


    getTransactionsByApp(app, filters = []) {
        try {
            let pipeline = pipeline_transactions_app(app, filters);
            return new Promise((resolve, reject) => {
                WithdrawRepository.prototype.schema.model
                    .aggregate(pipeline)
                    .exec((err, Withdraws) => {
                        if (err) {
                            Withdraws = []
                            reject(err)
                        }
                        resolve(Withdraws);
                    });
            });
        } catch (err) {
            throw err;
        }
    }

    getWithdrawByTransactionHash(transactionHash) {
        return new Promise((resolve, reject) => {
            WithdrawRepository.prototype.schema.model
                .findOne({ transactionHash })
                .lean()
                .exec((err, Withdraw) => {
                    if (err) { reject(err) }
                    resolve(Withdraw)
                });
        });
    }


    confirmWithdraw(id, new_Withdraw_params) {
        return new Promise((resolve, reject) => {
            WithdrawRepository.prototype.schema.model.findByIdAndUpdate(id,
                {
                    $set:
                    {
                        amount: new_Withdraw_params.amount,
                        block: new_Withdraw_params.block,
                        usd_amount: new_Withdraw_params.usd_amount,
                        confirmed: new_Withdraw_params.confirmed,
                        confirmations: new_Withdraw_params.confirmations,
                        maxConfirmations: new_Withdraw_params.maxConfirmations,
                        last_update_timestamp: new_Withdraw_params.last_update_timestamp
                    }
                }, { new: true }
            )
                .lean()
                .exec((err, Withdraw) => {
                    if (err) { reject(err) }
                    resolve(Withdraw);
                });
        });
    }

    betscanGetWithdraws({ offset, size, begin_at, end_at }) {
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
                WithdrawRepository.prototype.schema.model.find(
                    {
                        last_update_timestamp: {
                            $gte: new Date(begin_at),
                            $lte: new Date(end_at)
                        },
                    }
                )
                    .sort({ last_update_timestamp: -1 })
                    .populate([
                        {
                            path: 'app',
                            model: 'App',
                            select: {
                                '_id': 1,
                                'name': 1
                            },
                        }
                    ])
                    .skip(offset == undefined ? 0 : offset)
                    .limit((size > 500 || !size || size <= 0) ? 500 : size) // If limit > 500 then limit is equal 500, because limit must be 500 maximum
                    .exec(async (err, item) => {
                        const totalCount = await WithdrawRepository.prototype.schema.model.find({
                            last_update_timestamp: {
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
            WithdrawRepository.prototype.schema.model.find().lean().populate(foreignKeys)
                .exec((err, docs) => {
                    if (err) { reject(err) }
                    resolve(docs);
                })
        })
    }
}

        WithdrawRepository.prototype.schema = new WithdrawSchema();

export default WithdrawRepository;