import {globals} from "../../../Globals";
let db = globals.main_db;

class CripsrSchema{};

CripsrSchema.prototype.name = 'Cripsr';

CripsrSchema.prototype.schema =  {
    key                   : { type : String},
    isActive              : { type : Boolean, default : false},
    name                  : { type : String, default : 'Cripsr'},
    metaName              : { type : String, default : 'cripsr'},
    link                  : { type : String, default : 'https://crisp.chat'}, 
}


CripsrSchema.prototype.model = db.model(CripsrSchema.prototype.name, new db.Schema(CripsrSchema.prototype.schema));
      
export {
    CripsrSchema
}
