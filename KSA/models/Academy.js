const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const academySchema = new mongoose.Schema({
    roll_no: { type: String, required: true },
    name: { type: String, required: false },
    amount: { type: Number, required: false },
    session: { type: String, required: false },
    plan_time: { type: String, required: false },
    father: { type: String, required: false },
    occupation: { type: String, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    dob: { type: Date, required: false },
    name_of_school: { type: String, required: false },
    current_class: { type: String, required: false },
    photo: { type: String, required: false },
    signature: { type: String, required: false },
    date_and_place: { type: String, required: false },
    father_signature: { type: String, required: false },
    from: { type: Date, default: Date.now },
    to: { type: Date, required: false },
    payment_number: { type: Number },
    plan_id: { type: Schema.Types.ObjectId, ref: 'DetailsAcademy', required: false },
    sport_id: { type: Schema.Types.ObjectId, ref: 'Sport', required: true }, // New field
    institute_id: { type: Schema.Types.ObjectId, ref: 'Institute', required: true }, // New field
    active: { type: Boolean, default: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    id_card_generated: { type: Boolean, default: false },
    id_card_given: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    delete: { type: Boolean, default: false }
});

const Academy = mongoose.models.Academy || mongoose.model('Academy', academySchema);

module.exports = Academy;
