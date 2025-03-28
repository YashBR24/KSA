// models/Transaction.js
const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amt_in_out: { type: String, required: true, enum: ['IN', 'OUT'] },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    identification: { type: String },
    // balance_before_transaction: { type: Number},
    // balance_after_transaction: { type: Number },
    method: {
        type: String,
        required: true,
        default: 'CASH',
        enum: ['CASH', 'UPI', 'CARD', 'NET BANKING', 'CHEQUE', 'DEMAND DRAFT']
    },
    createdAt: { type: Date, default: Date.now },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    institute_name: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;