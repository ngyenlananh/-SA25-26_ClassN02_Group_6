const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// Thêm khách hàng
router.post('/', async (req, res) => {
  // Kiểm tra trùng số điện thoại
  const exists = await Customer.findOne({ phone: req.body.phone });
  if (exists) {
    return res.status(400).json({ error: 'Số điện thoại đã tồn tại!' });
  }
  // Tạo các trường mặc định nếu không có
  const now = new Date();
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    rank: req.body.rank,
    registerDate: req.body.registerDate || now.toLocaleDateString('vi-VN'),
    point: typeof req.body.point === 'number' ? req.body.point : 0,
    total: typeof req.body.total === 'number' ? req.body.total : 0,
    lastVisit: req.body.lastVisit || now.toLocaleDateString('vi-VN')
  });
  await customer.save();
  res.json(customer);
});

// Cập nhật khách hàng
router.put('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(customer);
});

// Xóa khách hàng
router.delete('/:id', async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
