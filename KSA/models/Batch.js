const mongoose = require('mongoose');
const { Schema } = mongoose;

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    start_time: { type: String, required: true }, // e.g., "09:00 AM"
    end_time: { type: String, required: true },   // e.g., "11:00 AM"
    active: { type: Boolean, default: true },
    createdOn: { type: Date, default: Date.now }
});

const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);

module.exports = Batch;