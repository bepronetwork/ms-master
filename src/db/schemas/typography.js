import { globals } from "../../Globals";
let db = globals.main_db;

class TypographySchema{};

TypographySchema.prototype.name = 'Typography';

TypographySchema.prototype.schema =  {
    local  : [{ type : String }],
    url    : { type : String },
    format : { type : String },
}


TypographySchema.prototype.model = db.model(TypographySchema.prototype.name, new db.Schema(TypographySchema.prototype.schema));

export {
    TypographySchema
}