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

    async getAppBetsEsports({app, offset, size, user = {}, _id = {}, currency = {}, videogames = {}, type = {}, dates}) {
        switch (dates) {
            case (dates.from && dates.to == undefined):
                dates.from = new Date(new Date().setDate(new Date().getDate() - 20000));
                dates.to = new Date(new Date().setDate(new Date().getDate() + 100));
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
                        $gte: new Date(!dates.from ? new Date().setDate(new Date().getDate() - 20000) : dates.from), 
                        $lte: new Date (!dates.to ? new Date().setDate(new Date().getDate() + 100) : dates.to)
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