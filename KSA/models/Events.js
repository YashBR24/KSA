const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const querySchema = new mongoose.Schema({
    name: { type: String, required: true },
    event_logo: { type: String, required: false },
    contentType: { type: String, required: false },
    event_date: { type: Date, required: true },
    location: { type: String, required: true },
    event_fee: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
    delete: { type: Boolean, default: false },
    institute: { type: Schema.Types.ObjectId, ref: 'Institute', required: true } // Added institute field
});

const Events = mongoose.models.Events || mongoose.model('Events', querySchema);
module.exports = Events;