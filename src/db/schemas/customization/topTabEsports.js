import { globals } from "../../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class TopTabEsportsSchema{};

TopTabEsportsSchema.prototype.name = 'TopTabEsports';

TopTabEsportsSchema.prototype.schema =  {
    topTabEsports : [{
        name      : {type : String},
        icon      : {type : String},
        link_url  : {type : String}
    }]
}


TopTabEsportsSchema.prototype.model = db.model(TopTabEsportsSchema.prototype.name, new db.Schema(TopTabEsportsSchema.prototype.schema));
export {
    TopTabEsportsSchema
}
