const mongoose = require('mongoose');
const { Schema } = mongoose;

const turfSchema = new mongoose.Schema({
    name: { type: String }, // Optional name field (e.g., turf name or booking reference)
    mobile_no: { type: Number }, // Optional mobile number,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    booked_by: {
        type: String,
        enum: ['Manager', 'Admin', 'User'],
        required: true
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
    payment_method: {
        type: String,
        required: true,
        enum: ['CASH', 'UPI', 'CARD', 'NET BANKING', 'CHEQUE', 'DEMAND DRAFT'],
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
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true // Made required for consistency
    },
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: 'Details_TGS', // Assuming 'Details_TGS' is your turf ground details model
        required: true
    },
    played: {
        type: Boolean,
        default: false
    }, // Whether the turf was used
    leftover: {
        type: Number,
        default: function() {
            return this.amount; // Default leftover is the full amount until paid
        }
    }, // Remaining amount to be paid
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

const Turf = mongoose.models.Turf || mongoose.model('Turf', turfSchema);
module.exports = Turf;