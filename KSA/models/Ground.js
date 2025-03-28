const mongoose = require('mongoose');
const { Schema } = mongoose;

const groundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile_no: {
        type: Number,
        required: true
    },
    booked_by: {
        type: String,
        enum: ['Manager', 'Admin', 'User'],
        required: true,
        default: 'User'
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }, // Total booking amount
    turf: {
        type: String,
        enum: ['TURF-A', 'TURF-B'], // Adjusted for turf-specific naming
        required: true
    },
    payment_method: {
        type: String,
        enum: ['CASH', 'UPI', 'CARD', 'NET BANKING', 'CHEQUE', 'DEMAND DRAFT'],
        required: true,
        default: 'CASH'
    },
    payment_status: {
        type: String,
        enum: ['Pending', 'Partial', 'Paid'],
        required: true,
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }, // Booking active/inactive status
    description: {
        type: String
    },
    advance: {
        type: Number,
        default: 0
    }, // Advance payment amount
    leftover: {
        type: Number,
        default: function() {
            return this.amount - this.advance; // Default leftover is amount minus advance
        }
    }, // Remaining amount to be paid
    advpaymentmode: {
        type: String,
        enum: ['CASH', 'UPI', 'CARD', 'NET BANKING', 'CHEQUE', 'DEMAND DRAFT', ''],
        default: ''
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: 'DetailsTurfGround', // Changed to reference DetailsTurfGround
        required: true
    },
    started: {
        type: Boolean,
        default: false
    },
    ended: {
        type: Boolean,
        default: false
    },
    institute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        required: true // Added for institute-wise tracking
    },
    institute_name: {
        type: String,
        required: true // Store institute name for convenience
    }
});

const Ground = mongoose.models.Ground || mongoose.model('Ground', groundSchema);
module.exports = Ground;