import MongoComponent from './MongoComponent';
import { GameSchema } from '../schemas';
import Numbers from '../../logic/services/numbers';


const foreignKeys = ['resultSpace'];

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


class GamesRepository extends MongoComponent{

    constructor(){
        super(GameSchema)
    }
    /**
     * @function setGameModel
     * @param Game Model
     * @return {Schema} GameModel
     */

    setModel = (Game) => {
        return GamesRepository.prototype.schema.model(Game)
    }
    
    findGameById(_id){ 
        return new Promise( (resolve, reject) => {
            GamesRepository.prototype.schema.model.findById(_id)
            .populate(foreignKeys)
            .exec( (err, Game) => {
                if(err) { resolve(null)}
                resolve(Game);
            });
        });
    }

    findGameByIdAndNotPopulate = async(_id) => {
        return new Promisse((resolve, reject) => {
            GamesRepository.prototype.schema.model.findById(_id)
            .exec( (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }

    editTableLimit({id, tableLimit}){
        return new Promise( (resolve,reject) => {
            GamesRepository.prototype.schema.model.findByIdAndUpdate(
                id, 
                { $set: { "tableLimit" : parseFloat(tableLimit) } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    editRules({id, rules}){
        return new Promise( (resolve,reject) => {
            GamesRepository.prototype.schema.model.findByIdAndUpdate(
                id, 
                { $set: { "rules" : rules } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    editEdge({id, edge}){
        return new Promise( (resolve,reject) => {
            GamesRepository.prototype.schema.model.findByIdAndUpdate(
                id, 
                { $set: { "edge" : parseFloat(edge) } },
                { 'new': true })
                .exec( (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }

    addBet(game_id, bet){
        return new Promise( (resolve,reject) => {
            GamesRepository.prototype.schema.model.findOneAndUpdate(
                { _id: game_id, bets : {$nin : [bet._id] } }, 
                { $push: { "bets" : bet } },
                (err, item) => {
                    if(err){reject(err)}
                    resolve(item);
                }
            )
        });
    }


    getAll = async() => {
        return new Promise( (resolve,reject) => {
            GamesRepository.prototype.schema.model.find().lean().populate(foreignKeys)
            .exec( (err, docs) => {
                if(err){reject(err)}
                resolve(docs);
            })
        });
    }

    setMaxBet(params){
        return new Promise((resolve, reject) => {
            GamesRepository.prototype.schema.model.findByIdAndUpdate(
                params.game, 
                { $set: { "maxBet" : parseFloat(params.maxBet) } },
                { 'new': true }
            )
            .exec( (err, item) => {
                if(err){reject(err)}
                resolve(item);
            })
        });
    }
}

GamesRepository.prototype.schema = new GameSchema();

export default GamesRepository;