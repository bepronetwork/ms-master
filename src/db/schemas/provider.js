import { globals } from "../../Globals";
import mongoose from 'mongoose';
let db = globals.main_db;


class ProviderSchema{};

ProviderSchema.prototype.name = 'Provider';

ProviderSchema.prototype.schema = {
    api_key   : { type: String, required: true },
    api_url   : { type: String, required: true },
    logo      : { type: String, required: true },
    name      : { type: String, required: true },
    app       : { type: mongoose.Schema.Types.ObjectId, ref: 'App', required : true},
    activated : { type: Boolean, default: true },
 };

// Mongoose o only allows once per type
ProviderSchema.prototype.model = db.model('Provider', new db.Schema(ProviderSchema.prototype.schema));

export {
    ProviderSchema
}


