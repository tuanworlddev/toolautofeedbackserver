const mongoose = require('mongoose');

const adTaskScheme = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', require: true },
    adId: { type: String, require: true },
    budget: { type: Number, require: true },
    startTime: { type: Date, require: true },
    startDate: { type: Date, require: true },
    endDate: { type: Date, require: true },
    activate: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('AdTask', adTaskScheme);