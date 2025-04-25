const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amt_in_out: { type: String, required: true, enum: ['IN', 'OUT'] },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    // identification: { type: String },
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
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true // Adding index for better query performance
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

// Add index for better query performance
transactionSchema.index({ institute: 1, isDeleted: 1 });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;