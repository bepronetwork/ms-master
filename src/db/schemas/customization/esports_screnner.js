import { globals } from "../../../Globals";
let db = globals.main_db;

class EsportsScrennerSchema{};

EsportsScrennerSchema.prototype.name = 'EsportsScrenner';

EsportsScrennerSchema.prototype.schema =  {
    link_url    : {type : String},
    button_text : {type : String},
    title       : {type : String},
    subtitle    : {type : String}
}


EsportsScrennerSchema.prototype.model = db.model(EsportsScrennerSchema.prototype.name, new db.Schema(EsportsScrennerSchema.prototype.schema));
export {
    EsportsScrennerSchema
}
