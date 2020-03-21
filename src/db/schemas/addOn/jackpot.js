import { globals } from "../../../Globals";
let db = globals.main_db;

class JackpotSchema{};

JackpotSchema.prototype.name = 'Jackpot';

JackpotSchema.prototype.schema =  {
    name                : { type: String, required : true},
    metaName            : { type: String, required : true},
    description         : { type: String, required : true},
    rules               : { type: String, required : true},
    edge                : { type : Number, required : true},
    app                 : { type: mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    // Event Data
    resultSpace         : [{type: mongoose.Schema.Types.ObjectId, ref: 'ResultSpace', required : true }],
    image_url           : { type: String, required: true },
    betSystem           : { type: Number, required : true},  // 0 or 1 (auto or oracle)
    timestamp           : { type: Date, required : true},
    wallets             : [{
        wallet      : { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
        tableLimit  : { type: Number}
    }],
    metadataJSON        : { type: JSON},
    result              : [{ type: Number}],
    bets                : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet'}],
    isClosed            : { type: Boolean , required : true, default : false},
    maxBet              : { type: Number, default : 0},
    background_url      : { type: String, default: null }
}


JackpotSchema.prototype.model = db.model(JackpotSchema.prototype.name, new db.Schema(JackpotSchema.prototype.schema));
export {
    JackpotSchema
}
