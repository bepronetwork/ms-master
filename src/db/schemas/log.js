import {globals} from "../../Globals";
let db = globals.main_db;

class LogSchema{};

LogSchema.prototype.name = 'Log';

LogSchema.prototype.schema = {
    ip          : {type: String, required : true},
    countryCode : {type: Number, required : true},
    route       : {type: String, required : false},
    process     : {type : String, required : false},
    creator     : {type : String, required : false},
    time        : {type : Date, required : false}
}

LogSchema.prototype.model = db.model(LogSchema.prototype.name, new db.Schema(LogSchema.prototype.schema));

export {
    LogSchema
}
