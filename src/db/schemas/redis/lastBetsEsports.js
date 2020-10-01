import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.redis_db;

class LastBetsEsportsSchema{};

LastBetsEsportsSchema.prototype.name = 'LastBetsEsports';


LastBetsEsportsSchema.prototype.schema = {
    app              : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    timestamp        : { type : Date, required : true},
    lastBetsEsports  : [{
        bet         : {
            _id       : { type : String, required: true},
            betAmount : { type : Number, required: true},
            winAmount : { type : Number, required: true},
            isWon     : { type : Boolean, required : true},
            timestamp : { type : Date, required : true},
        },
        currency    : {
            _id       : { type: String, required: true},
            ticker    : { type: String, required: true},
            name      : { type: String, required: true},
            image     : { type: String, required: true},
        },
        user        : {
            _id       : { type : String, required: true},
            username  : { type : String, required: true},
        },
        game        : [{
            _id           : { type : String, required: true},
            external_id   : { type: Number, required: true},
            name          : { type: String, required: true},
            slug          : { type: String, required: true},
            image         : { type: String, required: true},
            meta_name     : { type: String, required: true},
        }]
    }],
}

LastBetsEsportsSchema.prototype.model = db.model(LastBetsEsportsSchema.prototype.name, new db.Schema(LastBetsEsportsSchema.prototype.schema));

export {
    LastBetsEsportsSchema
}

