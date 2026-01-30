const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
  date: String, // hoặc Date
  type: String, // 'import' hoặc 'export'
  qty: Number,
  note: String,
  staff: String
});

module.exports = mongoose.model('History', HistorySchema);
