import {globals} from "../../Globals";
let db = globals.main_db;

class ProviderTokenSchema{};

ProviderTokenSchema.prototype.name = 'ProviderToken';

ProviderTokenSchema.prototype.schema = {
    token : {type: String, required : true},
}


ProviderTokenSchema.prototype.model = db.model(ProviderTokenSchema.prototype.name, new db.Schema(ProviderTokenSchema.prototype.schema));

export {
    ProviderTokenSchema
}
