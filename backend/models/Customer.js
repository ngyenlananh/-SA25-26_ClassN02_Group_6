const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  registerDate: String, // hoặc Date
  rank: String, // Vàng, Bạc, Đồng
  point: Number,
  total: Number,
  lastVisit: String // hoặc Date
});

module.exports = mongoose.model('Customer', CustomerSchema);
