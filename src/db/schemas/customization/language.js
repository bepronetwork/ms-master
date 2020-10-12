import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.main_db;

class LanguageSchema{};

LanguageSchema.prototype.name = 'Language';

LanguageSchema.prototype.schema = {
    isActivated : { type: Boolean , required : true, default : true },
    prefix      : { type: String, required: true, default : "EN" },
    name        : { type: String, required: true, default : "English" },
    logo        : { type: String },
}

LanguageSchema.prototype.model = db.model(LanguageSchema.prototype.name, new db.Schema(LanguageSchema.prototype.schema));

export {
    LanguageSchema
}
