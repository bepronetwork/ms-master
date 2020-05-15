import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.redis_db;

class BiggestBetWinnerSchema{};

BiggestBetWinnerSchema.prototype.name = 'BiggestBetWinner';

BiggestBetWinnerSchema.prototype.schema = {
    app         : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    game        : { type : mongoose.Schema.Types.ObjectId, ref: 'Games', required : true },
    timestamp   : { type : Date, required : true},
    biggestBetWinner: [{
        bet         : {
            _id       : { type : mongoose.Schema.Types.ObjectId, required: true},
            betAmount : { type : Number, required: true},
            winAmount : { type : Number, required: true},
            isWon     : { type : Boolean, required : true},
            timestamp : { type : Date, required : true},
        },
        currency    : {
            _id       : { type : mongoose.Schema.Types.ObjectId, required: true},
            ticker    : { type: String, required: true},
            name      : { type: String, required: true},
            image     : { type: String, required: true}, 
        },
        user        : { 
            _id       : { type : mongoose.Schema.Types.ObjectId, required: true},
            username  : { type : String, required: true},
        },
        game        : {
            _id       : { type : mongoose.Schema.Types.ObjectId, required: true},
            name      : { type: String, required: true},
            metaName  : { type: String, required: true},
            image_url : { type: String, required: true},
        },    
    }],
}


BiggestBetWinnerSchema.prototype.model = db.model(BiggestBetWinnerSchema.prototype.name, new db.Schema(BiggestBetWinnerSchema.prototype.schema));
      
export {
    BiggestBetWinnerSchema
}
