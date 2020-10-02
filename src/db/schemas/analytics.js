import {globals} from "../../Globals";
import mongoose from 'mongoose';
let db = globals.main_db;

class AnalyticsSchema{};

AnalyticsSchema.prototype.name = 'Analytics';

AnalyticsSchema.prototype.schema =  {
    google_tracking_id : { type : String },
}


AnalyticsSchema.prototype.model = db.model(AnalyticsSchema.prototype.name, new db.Schema(AnalyticsSchema.prototype.schema));
      
export {
    AnalyticsSchema
}
