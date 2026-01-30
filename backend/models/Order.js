const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      note: { type: String },
    }
  ],
  status: { type: String, enum: ['new', 'in_progress', 'done'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);