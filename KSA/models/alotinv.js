const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const invschema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    qty: { type: Number, required: true, default: 0 },
    description: { type: String, required: false },
    payment_method: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    inv_id: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    active: { type: Boolean, default: true },
    delete: { type: Boolean, default: false }
});

const AlotInv = mongoose.models.AlotInv || mongoose.model('AlotInv', invschema);

module.exports = AlotInv;