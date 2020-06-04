import { globals } from "../../../Globals";
let db = globals.main_db;

class BackgroundSchema{};

BackgroundSchema.prototype.name = 'Background';

BackgroundSchema.prototype.schema =  {
    id : { type : String }
}


BackgroundSchema.prototype.model = db.model(BackgroundSchema.prototype.name, new db.Schema(BackgroundSchema.prototype.schema));
      
export {
    BackgroundSchema
}
