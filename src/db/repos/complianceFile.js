import MongoComponent from './MongoComponent';
import { ComplianceFileSchema } from '../schemas';

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


class ComplianceFileRepository extends MongoComponent{

    constructor(){
        super(ComplianceFileSchema)
    }
    /**
     * @function setComplianceModel
     * @param Compliance Model
     * @return {Schema} ComplianceModel
     */

    setModel = (Compliance) => {
        return ComplianceFileRepository.prototype.schema.model(Compliance)
    }

    async getComplianceByApp({app, offset, size, begin_at, end_at }) {
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
                ComplianceFileRepository.prototype.schema.model.find({
                    app : app,
                    date: {
                        $gte: begin_at,
                        $lte: end_at
                    },
                })
                .sort({date: -1})
                .skip(offset == undefined ? 0 : offset)
                .limit((size > 200 || !size || size <= 0) ? 200 : size)
                .lean()
                .exec(async (err, item) => {
                    const totalCount = await ComplianceFileRepository.prototype.schema.model.find({
                        app : app
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

ComplianceFileRepository.prototype.schema = new ComplianceFileSchema();

export default ComplianceFileRepository;