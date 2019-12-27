import { globals } from "../../Globals";
let db = globals.main_db;

class SrcSchema{};

SrcSchema.prototype.name = 'SrcTypography';

SrcSchema.prototype.schema =  {
    local  : { type : String },
    local  : { type : String },
    url    : { type : String },
    format : { type : String },
}


SrcSchema.prototype.model = db.model(SrcSchema.prototype.name, new db.Schema(SrcSchema.prototype.schema));
      
export {
    SrcSchema
}
