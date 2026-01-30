const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  shift: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  workDays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', StaffSchema);
