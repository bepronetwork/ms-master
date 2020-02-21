import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.main_db;

class MailSenderSchema{};

MailSenderSchema.prototype.name = 'MailSender';

MailSenderSchema.prototype.schema =  {
    apiKey             : { type : String},
    templateIds        : [{ type : String}],
}


MailSenderSchema.prototype.model = db.model(MailSenderSchema.prototype.name, new db.Schema(MailSenderSchema.prototype.schema));
      
export {
    MailSenderSchema
}
