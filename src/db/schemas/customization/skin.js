import { globals } from "../../../Globals";
let db = globals.main_db;

class SkinSchema{};

SkinSchema.prototype.name = 'Skin';

SkinSchema.prototype.schema =  {
    skin_type : { type : String, required : true, default : 'default' }
}


SkinSchema.prototype.model = db.model(SkinSchema.prototype.name, new db.Schema(SkinSchema.prototype.schema));
      
export {
    SkinSchema
}
