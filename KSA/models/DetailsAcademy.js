const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const detailsacademy = new mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    plan_limit: {type: Number, required: true},
    sport: {type: String, enum: ['Cricket', 'Football'], required: false},
    active: {type: Boolean, default: true},
    createdOn: {type: Date, default: Date.now}
});

// Explicitly naming the model to avoid collisions
const DetailsAcademy = mongoose.models.DetailsAcademy || mongoose.model('DetailsAcademy', detailsacademy);

module.exports = DetailsAcademy;
