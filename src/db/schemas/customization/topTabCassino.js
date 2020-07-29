import { globals } from "../../../Globals";
let db = globals.main_db;

class TopTabCassinoSchema{};

TopTabCassinoSchema.prototype.name = 'TopTabCassino';

TopTabCassinoSchema.prototype.schema =  {
    topTabCassino : [{
        _id       : { type : mongoose.Schema.Types.ObjectId, required: true},
        name      : {type : String},
        icon      : {type : String},
        link_url  : {type : String}
    }]
}


TopTabCassinoSchema.prototype.model = db.model(TopTabCassinoSchema.prototype.name, new db.Schema(TopTabCassinoSchema.prototype.schema));
export {
    TopTabCassinoSchema
}
