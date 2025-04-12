// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const batchSchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
//     start_time: { type: String, required: true }, // e.g., "09:00 AM"
//     end_time: { type: String, required: true },   // e.g., "11:00 AM"
//     active: { type: Boolean, default: true },
//     createdOn: { type: Date, default: Date.now }
// });
//
// const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);
//
// module.exports = Batch;


const mongoose = require('mongoose');
const { Schema } = mongoose;

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    start_time: { type: String, required: true }, // e.g., "09:00 AM"
    end_time: { type: String, required: true },   // e.g., "11:00 AM"
    sport_id: {
        type: Schema.Types.ObjectId,
        ref: 'Sport',
        required: true
    }, // New field to associate batch with a sport
    active: { type: Boolean, default: true },
    createdOn: { type: Date, default: Date.now }
});

const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);

module.exports = Batch;