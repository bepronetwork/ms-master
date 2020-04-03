import { globals } from "../../Globals";
let db = globals.main_db;

class TypographySchema{};

TypographySchema.prototype.name = 'Typography';

TypographySchema.prototype.schema =  {
    url  : { type : String, required : true, default: 'https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFWJ0bf8pkAp6a.woff2' },
    name : { type : String, required : true, default: 'OpenSans-Regular' }
}

TypographySchema.prototype.model = db.model(TypographySchema.prototype.name, new db.Schema(TypographySchema.prototype.schema));

export {
    TypographySchema
}