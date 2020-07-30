import { globals } from "../../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';

class TopTabCassinoSchema{};

TopTabCassinoSchema.prototype.name = 'TopTabCassino';

TopTabCassinoSchema.prototype.schema =  {
    topTabCassino : [{
        name      : {type : String, required: true},
        icon      : {type : String, required: true},
        link_url  : {type : String, required: true}
    }]
}


TopTabCassinoSchema.prototype.model = db.model(TopTabCassinoSchema.prototype.name, new db.Schema(TopTabCassinoSchema.prototype.schema));
export {
    TopTabCassinoSchema
}
