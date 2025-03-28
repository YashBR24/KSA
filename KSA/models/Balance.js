// models/Balance.js
const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    balance: { type: Number, default: 0 },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
});

const Balance = mongoose.models.Balance || mongoose.model('Balance', balanceSchema);
module.exports = Balance;