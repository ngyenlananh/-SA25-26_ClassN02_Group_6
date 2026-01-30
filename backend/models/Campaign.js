const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    code: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    time: { type: String, required: true },
    color: { type: String, required: true },
    limit: { type: Number, required: true },
    used: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    status: { type: String, default: 'upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
