const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    apiKey: { type: String, required: true },
    activate: { type: Boolean, default: false },
    isAuto: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);