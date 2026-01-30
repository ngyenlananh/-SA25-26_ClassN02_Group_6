const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  id: String,
  date: String,
  type: String,
  amount: Number,
  category: String,
  desc: String,
  staff: String,
  status: {
    type: String,
    enum: ['Chờ duyệt', 'Đã thanh toán', 'Hủy'],
    default: 'Chờ duyệt'
  },
  fileMinhChung: String,
  campaignCode: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
