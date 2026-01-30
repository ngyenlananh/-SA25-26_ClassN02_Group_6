const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const materialController = require('../controllers/materialController');
// Cảnh báo tồn kho
router.get('/low-stock', materialController.getLowStockMaterials);

// Lấy danh sách nguyên liệu
router.get('/', async (req, res) => {
  const materials = await Material.find();
  res.json(materials);
});

// Thêm nguyên liệu (kiểm tra trùng mã code)
router.post('/', async (req, res) => {
  const exists = await Material.findOne({ code: req.body.code });
  if (exists) {
    return res.status(400).json({ error: 'Mã nguyên liệu đã tồn tại!' });
  }
  const material = new Material(req.body);
  await material.save();
  res.json(material);
});


// Nhập kho nguyên liệu (tăng số lượng)
router.post('/:id/nhap', async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: 'Số lượng nhập không hợp lệ!' });
  }
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ error: 'Không tìm thấy nguyên liệu!' });
  // Đảm bảo quantity là số
  const currentQty = Number(material.quantity) || 0;
  const addQty = Number(quantity);
  material.quantity = currentQty + addQty;
  await material.save();
  res.json(material);
});

// Cập nhật nguyên liệu
router.put('/:id', async (req, res) => {
  const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(material);
});

// Xóa nguyên liệu
router.delete('/:id', async (req, res) => {
  await Material.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
