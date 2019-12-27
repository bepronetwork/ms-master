import { globals } from "../../Globals";
let db = globals.main_db;

class TypographySchema{};

TypographySchema.prototype.name = 'Typography';

TypographySchema.prototype.schema =  {
    fontFamily : { type : String },
    fontStyle  : { type : String },
    fontWeight : { type : String },
    src        : { type : mongoose.Schema.Types.ObjectId, ref: 'SrcTypography', required : true },
    unicode    : { type : String }
}


TypographySchema.prototype.model = db.model(TypographySchema.prototype.name, new db.Schema(TypographySchema.prototype.schema));
      
export {
    TypographySchema
}
