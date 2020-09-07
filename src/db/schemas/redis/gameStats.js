import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.redis_db;

class GameStatsSchema{};

GameStatsSchema.prototype.name = 'GameStats';


GameStatsSchema.prototype.schema = {
    app         : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    timestamp   : { type : Date, required : true},
    currency    : { type : mongoose.Schema.Types.ObjectId, ref: 'Currency', required : true },
    period      : { type : String, required: true},
    month       : { type : Number, required: true},
    year        : { type : Number, required: true},
    gameStats   : [{
        _id        : { type : String, required: true},
        name       : { type : String, required: true},
        edge       : { type : Number, required: true},
        betsAmount : { type : Number, required: true},
        betAmount  : { type : Number, required: true},
        profit     : { type : Number, required: true},
        fees       : { type : Number, required: true}
    }],
}

GameStatsSchema.prototype.model = db.model(GameStatsSchema.prototype.name, new db.Schema(GameStatsSchema.prototype.schema));

export {
    GameStatsSchema
}
