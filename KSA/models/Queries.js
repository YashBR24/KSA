const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const querySchema = new mongoose.Schema({
    name: { type: String, required: true } ,
    email: { type: String, required: true },
    mobile_no: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    active:{ type: Boolean, default: true },
    delete:{ type: Boolean, default: false }
});

const Queries = mongoose.models.Queries || mongoose.model('Queries', querySchema);

module.exports = Queries;
