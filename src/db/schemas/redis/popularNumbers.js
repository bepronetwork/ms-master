import {globals} from "../../../Globals";
import mongoose from 'mongoose';
let db = globals.redis_db;

class PopularNumberSchema{};

PopularNumberSchema.prototype.name = 'PopularNumber';

PopularNumberSchema.prototype.schema = {
    app                 : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    timestamp           : { type : Date, required : true},
    popularNumbers      : [{
        game     : { type: String, required: true},
        numbers  : [{
            key           : { type : String, required: true},
            index         : { type : Number, required: true},
            probability   : { type : Number, required: true},
            resultAmount  : { type : Number, required : true}
        }]
    }],
}


PopularNumberSchema.prototype.model = db.model(PopularNumberSchema.prototype.name, new db.Schema(PopularNumberSchema.prototype.schema));
      
export {
    PopularNumberSchema
}
