import { globals } from "../../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';
class BannersSchema{};

BannersSchema.prototype.name = 'Banners';

BannersSchema.prototype.schema =  {
    languages: [
        {
            language : { type : mongoose.Schema.Types.ObjectId, ref: 'Language' },
            useStandardLanguage : { type : Boolean, default : true},
            ids                     : [{
                image_url   : {type : String},
                link_url    : {type : String},
                button_text : {type : String},
                title       : {type : String},
                subtitle    : {type : String}
            }],
            autoDisplay : { type : Boolean, default : false},
            fullWidth   : { type : Boolean, default : false}
        }
    ]
}

BannersSchema.prototype.model = db.model(BannersSchema.prototype.name, new db.Schema(BannersSchema.prototype.schema));
export {
    BannersSchema
}
