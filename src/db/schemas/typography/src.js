import { globals } from "../../../Globals";
let db = globals.main_db;

class SrcTypographySchema{};

SrcTypographySchema.prototype.name = 'SrcTypography';

SrcTypographySchema.prototype.schema =  {
    local  : [{ type : String }],
    url    : { type : String },
    format : { type : String },
}


SrcTypographySchema.prototype.model = db.model(SrcTypographySchema.prototype.name, new db.Schema(SrcTypographySchema.prototype.schema));
      
export {
    SrcTypographySchema
}
