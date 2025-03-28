const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    data: { type: Buffer, required: true },  // Binary data of the image
    contentType: { type: String, required: true } ,// MIME type, e.g., 'image/jpeg'
    title: { type: String, required: true },
    description: { type: String, required: true },
    uploadedBy: { type: String, enum: ['admin', 'coach'], required: true },
    uploadedAt: { type: Date, default: Date.now },
    active:{ type: Boolean, default: true }
});
module.exports = mongoose.model('GroundImages', imageSchema);
