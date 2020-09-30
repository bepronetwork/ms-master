import { globals } from "../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class TopUpSchema{};

TopUpSchema.prototype.name = 'TopUp';

TopUpSchema.prototype.schema =  {
    reason   : { type : String, required: true},
    amount   : { type : Number, required: true},
    currency : { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required : true},
    user     : { type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true },
    admin    : { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required : true},
    wallet   : { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
}


TopUpSchema.prototype.model = db.model(TopUpSchema.prototype.name, new db.Schema(TopUpSchema.prototype.schema, { timestamps: true }));
      
export {
    TopUpSchema
}
