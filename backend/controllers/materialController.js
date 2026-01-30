const Material = require('../models/Material');

// Lấy danh sách vật tư cần cảnh báo tồn kho
exports.getLowStockMaterials = async (req, res) => {
  try {
    // Dùng trường min thay vì warningThreshold
    const lowStockMaterials = await Material.find({
      $expr: { $lte: ["$quantity", { $toInt: "$min" }] }
    });
    res.json(lowStockMaterials);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
