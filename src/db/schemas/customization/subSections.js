import { globals } from "../../../Globals";
let db = globals.main_db;

class SubSectionsSchema{};

SubSectionsSchema.prototype.name = 'SubSections';

SubSectionsSchema.prototype.schema =  {
    ids : [{
        title            : {type : String},
        text             : {type : String},
        image_url        : {type : String},
        background_url   : {type : String},
        background_color : {type : String},
        position         : {type : Number},
        location         : {type : Number}
    }]
}


SubSectionsSchema.prototype.model = db.model(SubSectionsSchema.prototype.name, new db.Schema(SubSectionsSchema.prototype.schema));
export {
    SubSectionsSchema
}
