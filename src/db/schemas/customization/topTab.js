import { globals } from "../../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class TopTabSchema{};

TopTabSchema.prototype.name = 'TopTab';

TopTabSchema.prototype.schema =  {
    ids : [{
        name      : {type : String, required: true},
        icon      : {type : String, required: true},
        link_url  : {type : String, required: true}
    }],
    isTransparent : { type : Boolean, default : false},
}


TopTabSchema.prototype.model = db.model(TopTabSchema.prototype.name, new db.Schema(TopTabSchema.prototype.schema));
export {
    TopTabSchema
}
