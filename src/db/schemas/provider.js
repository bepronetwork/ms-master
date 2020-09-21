import { globals } from "../../Globals";
import mongoose from 'mongoose';
let db = globals.main_db;


class ProviderSchema{};

ProviderSchema.prototype.name = 'Provider';

ProviderSchema.prototype.schema = {
    api_key    : { type: String },
    api_url    : { type: String, required: true },
    logo       : { type: String, required: true },
    name       : { type: String, required: true },
    app        : { type: mongoose.Schema.Types.ObjectId, ref: 'App', required : true},
    activated  : { type: Boolean, default: false },
    partner_id : { type: String },
    providerEco: { type: String, required: true },
 };

// Mongoose o only allows once per type
ProviderSchema.prototype.model = db.model('Provider', new db.Schema(ProviderSchema.prototype.schema));

export {
    ProviderSchema
}


