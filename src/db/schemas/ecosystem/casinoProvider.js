import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.ecosystem_db;

class CasinoProviderSchema{};

CasinoProviderSchema.prototype.name = 'CasinoProvider';

CasinoProviderSchema.prototype.schema = {
    api_key    : { type: String, required: true },
    api_url    : { type: String, required: true },
    logo       : { type: String, required: true },
    name       : { type: String, required: true },
    partner_id : { type: String, required: true },
}

CasinoProviderSchema.prototype.model = db.model(CasinoProviderSchema.prototype.name, new db.Schema(CasinoProviderSchema.prototype.schema));

export {
    CasinoProviderSchema
}
