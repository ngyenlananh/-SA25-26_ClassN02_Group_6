const mongoose = require('mongoose');
const MaterialSchema = new mongoose.Schema({
  code: String,
  name: String,
  group: String,
  quantity: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  expiry: String,
  status: String,
  warningThreshold: { type: Number, default: 10 },
  min: { type: Number, default: 0 }
});

module.exports = mongoose.model('Material', MaterialSchema);
