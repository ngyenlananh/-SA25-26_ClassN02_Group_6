const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// API nhận đơn đặt món từ thiết bị IoT hoặc tablet
router.post('/order', async (req, res) => {
  try {
    const { tableNumber, items } = req.body;
    if (!tableNumber || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Thiếu thông tin bàn hoặc món.' });
    }
    const order = new Order({ tableNumber, items });
    await order.save();
    // TODO: Emit sự kiện cho frontend nhân viên nếu dùng socket
    res.status(201).json({ message: 'Đặt món thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
