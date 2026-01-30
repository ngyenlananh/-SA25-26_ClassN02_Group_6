const express = require('express');
const router = express.Router();
const History = require('../models/History');

// Lấy lịch sử nhập/xuất của một nguyên liệu
router.get('/:id/history', async (req, res) => {
  const logs = await History.find({ materialId: req.params.id }).sort({ date: -1 });
  res.json(logs);
});

// Thêm lịch sử nhập/xuất
router.post('/:id/history', async (req, res) => {
  const { date, type, qty, note, staff } = req.body;
  const log = new History({ materialId: req.params.id, date, type, qty, note, staff });
  await log.save();
  res.json(log);
});

module.exports = router;
