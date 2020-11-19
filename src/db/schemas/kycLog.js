import {globals} from "../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class KYCLogSchema{};

KYCLogSchema.prototype.name = 'KYCLog';

KYCLogSchema.prototype.schema = {
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    app_id  : { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
    kyc_id  : {type: String, required : true}
}

KYCLogSchema.prototype.model = db.model(KYCLogSchema.prototype.name, new db.Schema(KYCLogSchema.prototype.schema, { timestamps: true }));

export {
    KYCLogSchema
}