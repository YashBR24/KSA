const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const imageSchema = new mongoose.Schema({
    data: { type: String, required: true },  // Binary data of the image
    contentType: { type: String, required: false } ,// MIME type, e.g., 'image/jpeg'
    title: { type: String, required: true },
    description: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    active:{ type: Boolean, default: true },
    delete: { type: Boolean, default: false }
});
const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

module.exports = Image;