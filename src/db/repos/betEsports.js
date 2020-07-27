import { BetEsportsSchema } from '../schemas';
import MongoComponent from './MongoComponent';

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

class BetEsportsRepository extends MongoComponent{

    constructor() {
        super(BetEsportsSchema)
    }
    /**
     * @function setBetEsportsModel
     * @param BetEsports Model
     * @return {Schema} BetEsportsModel
     */

    setModel = (BetEsports) => {
        return BetEsportsRepository.prototype.schema.model(BetEsports)
    }

    async findById(_id) {
        try {
            return new Promise((resolve, reject) => {
                BetEsportsRepository.prototype.schema.model.findById(_id)
                .lean()
                .exec((err, user) => {
                    if (err) { reject(err) }
                    resolve(user);
                });
            });
        } catch (err) {
            throw (err)
        }
    }

    async findByIdPopulated(_id) {
        try {
            return new Promise((resolve, reject) => {
                BetEsportsRepository.prototype.schema.model.findById(_id)
                .populate([
                    'user',
                    {
                        path: 'result',
                        model: 'BetResult',
                        select: { '__v': 0 },
                        populate : [
                            {
                                 path: 'match',
                                 model: 'Match',
                                 select : { '__v': 0}
                             }
                        ]
                    }
                ])
                .lean()
                .exec((err, user) => {
                    if (err) { reject(err) }
                    resolve(user);
                });
            });
        } catch (err) {
            throw (err)
        }
    }

    async findAll() {
        try {
            return new Promise((resolve, reject) => {
                BetEsportsRepository.prototype.schema.model.find()
                    .lean()
                    .exec((err, user) => {
                        if (err) { reject(err) }
                        resolve(user);
                    });
            });
        } catch (err) {
            throw (err)
        }
    }

    async getAppBetsEsports({app, offset, size, user = {}, _id = {}, currency = {}, videogames = {}, type = {}, begin_at, end_at }) {
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
                BetEsportsRepository.prototype.schema.model.find({
                    app : app,
                    ...user,
                    ..._id,
                    ...videogames,
                    ...currency,
                    ...type,
                    created_at: { 
                        $gte: begin_at, 
                        $lte: end_at
                    },
                })
                .sort({created_at: -1})
                .populate([
                    'user',
                    {
                        path: 'result',
                        model: 'BetResult',
                        select: { '__v': 0 },
                        populate : [
                            {
                                 path: 'match',
                                 model: 'Match',
                                 select : { '__v': 0}
                             }
                        ]
                    }
                ])
                .skip(offset == undefined ? 0 : offset)
                .limit((size > 200 || !size || size <= 0) ? 200 : size)
                .lean()
                .exec(async (err, item) => {
                    const totalCount = await BetEsportsRepository.prototype.schema.model.find({
                        app : app,
                        ...user,
                        ..._id,
                        ...videogames,
                        ...currency
                    }).countDocuments().exec();
                    if(err){reject(err)}
                    resolve({list: item, totalCount });
                });
            });
        } catch (err) {
            throw (err)
        }
    }
}

BetEsportsRepository.prototype.schema = new BetEsportsSchema();


export default BetEsportsRepository;