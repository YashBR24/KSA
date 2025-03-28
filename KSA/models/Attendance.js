const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const attendance = new mongoose.Schema({
    rollno: {type:String},
    type: {type:String,default:"Trainee"},
    active: {type: Boolean, default: true},
    createdOn: {type: Date, default: Date.now}
});

// Explicitly naming the model to avoid collisions
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendance);

module.exports = Attendance;
