import { globals } from "../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class TopUpSchema{};

TopUpSchema.prototype.name = 'TopUp';

TopUpSchema.prototype.schema =  {
    reason     : { type : String, required : true},
    balance    : { type : Number},
    user       : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    currency   : { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' },
    wallet     : { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet'},
    admin      : { type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
    app        : { type: mongoose.Schema.Types.ObjectId, ref: 'App'},
}


TopUpSchema.prototype.model = db.model(TopUpSchema.prototype.name, new db.Schema(TopUpSchema.prototype.schema, { timestamps: true }));
      
export {
    TopUpSchema
}
