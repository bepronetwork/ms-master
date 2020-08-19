import {globals} from "../../Globals";
import mongoose from 'mongoose';
let db = globals.main_db;

class CustomizationSchema{};

CustomizationSchema.prototype.name = 'Customization';

CustomizationSchema.prototype.schema =  {
    topBar         : { type : mongoose.Schema.Types.ObjectId, ref: 'TopBar', required : true },
    banners        : { type : mongoose.Schema.Types.ObjectId, ref: 'Banners', required : true },
    subSections    : { type : mongoose.Schema.Types.ObjectId, ref: 'SubSections', required : true },
    logo           : { type : mongoose.Schema.Types.ObjectId, ref: 'Logo', required : true },
    background     : { type : mongoose.Schema.Types.ObjectId, ref: 'Background', required : true },
    colors         : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Color', required : true }],
    footer         : { type : mongoose.Schema.Types.ObjectId, ref: 'Footer', required : true },
    topIcon        : { type : mongoose.Schema.Types.ObjectId, ref: 'TopIcon', required : true },
    loadingGif     : { type : mongoose.Schema.Types.ObjectId, ref: 'LoadingGif', required : true },
    theme          : { type : String, default : "dark" },
    topTab         : { type : mongoose.Schema.Types.ObjectId, ref: 'TopTab', required : true },
}


CustomizationSchema.prototype.model = db.model(CustomizationSchema.prototype.name, new db.Schema(CustomizationSchema.prototype.schema));
      
export {
    CustomizationSchema
}
