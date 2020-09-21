import {globals} from "../../../Globals";
let db = globals.main_db;

class MoonPaySchema{};

MoonPaySchema.prototype.name = 'MoonPay';

MoonPaySchema.prototype.schema =  {
    key                   : { type : String, default : ''},
    isActive              : { type : Boolean, default : false},
    name                  : { type : String, default : 'MoonPay'},
    metaName              : { type : String, default : 'moonpay'},
    link                  : { type : String, default : 'https://www.moonpay.io'}, 
}


MoonPaySchema.prototype.model = db.model(MoonPaySchema.prototype.name, new db.Schema(MoonPaySchema.prototype.schema));
      
export {
    MoonPaySchema
}
