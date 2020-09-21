import { globals } from "../../../Globals";
let db = globals.main_db;

class IconsSchema{};

IconsSchema.prototype.name = 'Icons';

IconsSchema.prototype.schema =  {
    ids : [{
        position  : {type : Number},
        link      : {type : String},
        name      : {type : String},
    }],
    useDefaultIcons : { type : Boolean, default : true}
}


IconsSchema.prototype.model = db.model(IconsSchema.prototype.name, new db.Schema(IconsSchema.prototype.schema));
export {
    IconsSchema
}
