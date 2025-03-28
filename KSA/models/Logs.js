const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const logsschema = new mongoose.Schema({
    ip: { type: String, required: false } ,
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Logs = mongoose.models.Logs || mongoose.model('Logs', logsschema);

module.exports = Logs;