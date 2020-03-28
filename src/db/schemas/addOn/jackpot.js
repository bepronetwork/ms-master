import { globals } from "../../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class JackpotSchema{};

JackpotSchema.prototype.name = 'Jackpot';

JackpotSchema.prototype.schema =  {
    edge                : { type : Number, required : true, default : 1},
    app                 : { type: mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    limits              : [{
        currency            : { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' },
        tableLimit          : { type: Number, required : true, default : 0},
        maxBet              : { type: Number, required : true, default : 0},
        pot                 : { type: Number, required : true, default : 0}
    }],
    result              : [{ type: Object}],
    resultSpace         : {type : JSON, required : true}
}


JackpotSchema.prototype.model = db.model(JackpotSchema.prototype.name, new db.Schema(JackpotSchema.prototype.schema));
export {
    JackpotSchema
}
