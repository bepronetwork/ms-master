import { VideogameSchema } from '../schemas';
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

class VideogameRepository extends MongoComponent{

    constructor() {
        super(VideogameSchema)
    }
    /**
     * @function setVideogameModel
     * @param Videogame Model
     * @return {Schema} VideogameModel
     */

    setModel = (Videogame) => {
        return VideogameRepository.prototype.schema.model(Videogame)
    }

    async findAllVideogame() {
        try {
            return new Promise((resolve, reject) => {
                VideogameRepository.prototype.schema.model.find()
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

    async findVideogameById(_id) {
        try {
            return new Promise((resolve, reject) => {
                VideogameRepository.prototype.schema.model.findById(_id)
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

    async findVideogameByExternalId(external_id) {
        try {
            return new Promise((resolve, reject) => {
                VideogameRepository.prototype.schema.model.findOne(external_id)
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

    async findVideogameBySlug(slug_id) {
        try {
            return new Promise((resolve, reject) => {
                VideogameRepository.prototype.schema.model.findOne({slug: slug_id})
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
}

VideogameRepository.prototype.schema = new VideogameSchema();


export default VideogameRepository;