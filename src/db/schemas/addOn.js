import { globals } from "../../Globals";
let db = globals.main_db;
import mongoose from 'mongoose';
class AddOnSchema{};

AddOnSchema.prototype.name = 'AddOn';

AddOnSchema.prototype.schema =  {
    jackpot : { type : mongoose.Schema.Types.ObjectId, ref: 'Jackpot' }
}


AddOnSchema.prototype.model = db.model(AddOnSchema.prototype.name, new db.Schema(AddOnSchema.prototype.schema));
export {
    AddOnSchema
}
