const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const staffSchema = new mongoose.Schema({
    roll_no: { type: String,required: true },
    role: { type: String,enum : ['Staff','Coach'], required: true },
    name: { type: String, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    dob: { type: Date, required: false },
    photo: { type: String, required: false },
    sport_id: { type: Schema.Types.ObjectId, ref: 'Sport', required: true },
    active: { type: Boolean, default: true },
    user_id:{ type: Schema.Types.ObjectId, ref: 'User' },
    id_card_generated: { type: Boolean, default: false },
    id_card_given: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    delete:{type:Boolean,default:false}
});

const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);

module.exports = Staff;


