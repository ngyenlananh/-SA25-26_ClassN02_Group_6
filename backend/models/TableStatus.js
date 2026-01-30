const mongoose = require('mongoose');

const TableStatusSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['empty', 'occupied'], default: 'empty' },
  updatedAt: { type: Date, default: Date.now },
  sensorData: { type: mongoose.Schema.Types.Mixed }, // Lưu thông tin cảm biến nếu cần
});

module.exports = mongoose.model('TableStatus', TableStatusSchema);