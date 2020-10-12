import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.ecosystem_db;

class LanguageSchema{};

LanguageSchema.prototype.name = 'Language';

LanguageSchema.prototype.schema = {
    prefix    : { type: String, required: true },
    name      : { type: String, required: true },
    logo      : { type: String, required: true },
}

LanguageSchema.prototype.model = db.model(LanguageSchema.prototype.name, new db.Schema(LanguageSchema.prototype.schema));

export {
    LanguageSchema
}
