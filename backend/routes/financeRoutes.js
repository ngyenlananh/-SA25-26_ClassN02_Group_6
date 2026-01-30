
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
// const multer = require('multer');
const path = require('path');



// Lấy danh sách giao dịch theo tháng/năm
router.get('/', async (req, res) => {
  const { month, year } = req.query;
  let filter = {};
  if (month && year) {
    // Lọc theo tháng/năm từ chuỗi date dạng dd/mm/yyyy
    filter = {
      date: { $regex: `/${month}/${year}$` }
    };
  }
  const transactions = await Transaction.find(filter).sort({ date: -1 });
  res.json(transactions);
});

// Thêm giao dịch mới
router.post('/', async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.json(transaction);
});


// Xóa giao dịch
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Sửa giao dịch
router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
