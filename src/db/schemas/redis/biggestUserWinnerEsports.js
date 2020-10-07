import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.redis_db;

class BiggestUserWinnerEsportsSchema{};

BiggestUserWinnerEsportsSchema.prototype.name = 'BiggestUserWinnerEsports';

BiggestUserWinnerEsportsSchema.prototype.schema = {
    app         : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    timestamp   : { type : Date, required : true},
    biggestUserWinnerEsports: [{
        currency    : {
            _id       : { type: String, required: true},
            ticker    : { type: String, required: true},
            name      : { type: String, required: true},
            image     : { type: String, required: true},
        },
        user        : {
            _id       : { type: String, required: true},
            username  : { type: String, required: true},
        },
        game        : [{
            _id           : { type : String, required: true},
            external_id   : { type: Number, required: true},
            name          : { type: String, required: true},
            slug          : { type: String, required: true},
            image         : { type: String, required: true},
            meta_name     : { type: String, required: true},
        }],
        winAmount   : { type : Number, required: true},
    }],
}


BiggestUserWinnerEsportsSchema.prototype.model = db.model(BiggestUserWinnerEsportsSchema.prototype.name, new db.Schema(BiggestUserWinnerEsportsSchema.prototype.schema));
export {
    BiggestUserWinnerEsportsSchema
}

