const mongoose = require('mongoose');
const { Schema } = mongoose;

const sportSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    createdOn: { type: Date, default: Date.now }
});

const Sport = mongoose.models.Sport || mongoose.model('Sport', sportSchema);

module.exports = Sport;