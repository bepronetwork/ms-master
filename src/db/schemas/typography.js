import { globals } from "../../Globals";
let db = globals.main_db;

class TypographySchema{};

TypographySchema.prototype.name = 'Typography';

TypographySchema.prototype.schema =  {
    url  : { type : String, default: '' },
    name : { type : String, default: '' }
}

TypographySchema.prototype.model = db.model(TypographySchema.prototype.name, new db.Schema(TypographySchema.prototype.schema));

export {
    TypographySchema
}