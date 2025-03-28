const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const staffattendance = new mongoose.Schema({
    rollno: {type:String},
    type: {type:String},
    tap:{type:String,enum:['IN','OUT']},
    active: {type: Boolean, default: true},
    createdOn: {type: Date, default: Date.now}
});

// Explicitly naming the model to avoid collisions
const StaffAttendance = mongoose.models.StaffAttendance || mongoose.model('StaffAttendance', staffattendance);

module.exports = StaffAttendance;