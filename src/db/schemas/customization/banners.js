import { globals } from "../../../Globals";
let db = globals.main_db;

class BannersSchema{};

BannersSchema.prototype.name = 'Banners';

BannersSchema.prototype.schema =  {
    ids                     : {type : Array, default : [{image_url: null, link_url: null}]},
    autoDisplay             : { type : Boolean, default : false}
}


BannersSchema.prototype.model = db.model(BannersSchema.prototype.name, new db.Schema(BannersSchema.prototype.schema));
      
export {
    BannersSchema
}
