import { globals } from "../../../Globals";
let db = globals.main_db;

class JackpotSchema{};

JackpotSchema.prototype.name = 'Jackpot';

JackpotSchema.prototype.schema =  {
    name                : { type: String, required : true},
    metaName            : { type: String, required : true},
    edge                : { type : Number, required : true},
    app                 : { type: mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    resultSpace         : [{type: mongoose.Schema.Types.ObjectId, ref: 'ResultSpace', required : true }],
    betSystem           : { type: Number, required : true},
    timestamp           : { type: Date, required : true},
    wallets             : [{
        wallet              : { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
        tableLimit          : { type: Number}
    }],
    metadataJSON        : { type: JSON},
    result              : [{ type: Number}],
    bets                : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet'}],
    isClosed            : { type: Boolean , required : true, default : false},
    maxBet              : { type: Number, default : 0}
}


JackpotSchema.prototype.model = db.model(JackpotSchema.prototype.name, new db.Schema(JackpotSchema.prototype.schema));
export {
    JackpotSchema
}
