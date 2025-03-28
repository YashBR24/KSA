const mongoose = require('mongoose');
const { Schema } = mongoose;

const instituteSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    createdOn: { type: Date, default: Date.now }
});

const Institute = mongoose.models.Institute || mongoose.model('Institute', instituteSchema);

module.exports = Institute;