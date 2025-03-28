const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new mongoose.Schema({
    name: { type: String, required: true } ,
    email: { type: String, required: true },
    mobile_no: { type: String, required: true },
    registeredOn: { type: Date, default: Date.now },
    payment_done:{type:Boolean, default: false},
    payment_method:{type:String, default: "Online"},
    amount:{type:Number,default:0},
    event_id : { type: Schema.Types.ObjectId, ref: 'Events', required: true },
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
});
const EventsParticipants = mongoose.models.EventsParticipants || mongoose.model('Event_Participants', querySchema);

module.exports = EventsParticipants;