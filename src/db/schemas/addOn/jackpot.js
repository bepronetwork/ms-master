import { globals } from "../../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class JackpotSchema{};

JackpotSchema.prototype.name = 'Jackpot';

JackpotSchema.prototype.schema =  {
    edge                : { type : Number, required : true, default : 0},
    app                 : { type: mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    wallets             : [{
        wallet              : { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
        tableLimit          : { type: Number}
    }],
    result              : [{ type: Object}],
    maxBet              : { type: Number, default : 0},
    // bets                : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet'}] //TODO Relation with bet
}


JackpotSchema.prototype.model = db.model(JackpotSchema.prototype.name, new db.Schema(JackpotSchema.prototype.schema));
export {
    JackpotSchema
}
