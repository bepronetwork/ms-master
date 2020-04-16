import {globals} from "../../../Globals";
let db = globals.ecosystem_db;

class AddOnSchema{};

AddOnSchema.prototype.name = 'AddOn';

AddOnSchema.prototype.schema = {
    name        : { type: String, required : true},
    description : { type: String, required : true},
    image_url   : { type: String, required : true},
    endpoint    : { type: String, required : true},
    price       : { type: Number }
}

AddOnSchema.prototype.model = db.model(AddOnSchema.prototype.name, new db.Schema(AddOnSchema.prototype.schema));
export {
    AddOnSchema
}
