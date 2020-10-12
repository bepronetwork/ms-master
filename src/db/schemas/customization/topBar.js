import { globals } from "../../../Globals";
let db = globals.main_db;

class TopBarSchema{};

TopBarSchema.prototype.name = 'TopBar';

TopBarSchema.prototype.schema =  {
    languages: [
        {
            language : { type : mongoose.Schema.Types.ObjectId, ref: 'Language' },
            useStandardLanguage : { type : Boolean, default : true},
            text                  : { type : String},
            backgroundColor       : { type : String},
            textColor             : { type : String},
            isActive              : { type : Boolean, default : false},
        }
    ]
}

TopBarSchema.prototype.model = db.model(TopBarSchema.prototype.name, new db.Schema(TopBarSchema.prototype.schema));
export {
    TopBarSchema
}
