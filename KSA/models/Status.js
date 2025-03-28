const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name:{type:String,enum:['TURF','GROUND','ADMISSION'],required:true},
    description:{type:String,required:false},
    active:{ type: Boolean, default: true }
});
module.exports = mongoose.model('Status', imageSchema);
