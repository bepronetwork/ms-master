import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.redis_db;

class BiggestUserWinnerSchema{};

BiggestUserWinnerSchema.prototype.name = 'BiggestUserWinner';

BiggestUserWinnerSchema.prototype.schema = {
    app         : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    timestamp   : { type : Date, required : true},
    biggestUserWinner: [{
        currency    : {
            _id       : { type : String, required: true},
            ticker    : { type: String, required: true},
            name      : { type: String, required: true},
            image     : { type: String, required: true}, 
        },
        user        : { 
            _id       : { type : String, required: true},
            username  : { type : String, required: true},
        },
        game        : {
            _id       : { type : String, required: true},
            name      : { type: String, required: true},
            metaName  : { type: String, required: true},
            image_url : { type: String, required: true},
        },
        winAmount   : { type : Number, required: true},    
    }],
}


BiggestUserWinnerSchema.prototype.model = db.model(BiggestUserWinnerSchema.prototype.name, new db.Schema(BiggestUserWinnerSchema.prototype.schema));
      
export {
    BiggestUserWinnerSchema
}
