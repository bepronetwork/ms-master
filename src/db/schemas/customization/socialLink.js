import { globals } from "../../../Globals";
import mongoose from 'mongoose';

let db = globals.main_db;

class SocialLinkSchema{};

SocialLinkSchema.prototype.name = 'SocialLink';

SocialLinkSchema.prototype.schema =  {
    ids : [{
        href        : { type : String },
        name        : { type : String },
        image_url   : {type : String}
    }]
}


SocialLinkSchema.prototype.model = db.model(SocialLinkSchema.prototype.name, new db.Schema(SocialLinkSchema.prototype.schema));
      
export {
    SocialLinkSchema
}
