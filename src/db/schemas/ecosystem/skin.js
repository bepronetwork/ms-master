import {globals} from "../../../Globals";
let db = globals.ecosystem_db;

class SkinSchema{};

SkinSchema.prototype.name = 'Skin';

SkinSchema.prototype.schema = {
    skin_type : { type : String, required : true },
    name      : { type : String, required : true }
}

SkinSchema.prototype.model = db.model(SkinSchema.prototype.name, new db.Schema(SkinSchema.prototype.schema));

export {
    SkinSchema
}
