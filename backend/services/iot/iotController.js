const TableStatus = require('../../models/TableStatus');
const { emitTableStatusUpdate } = require('../../utils/socket');
// POST /api/iot/table-status
exports.receiveTableStatus = async (req, res) => {
  try {
    const { tableNumber, status, sensorData } = req.body;
    if (!tableNumber || !status) {
      return res.status(400).json({ error: 'Thiếu thông tin bàn hoặc trạng thái!' });
    }
    const updated = await TableStatus.findOneAndUpdate(
      { tableNumber },
      { status, updatedAt: new Date(), sensorData },
      { upsert: true, new: true }
    );
    // Phát sự kiện realtime cho frontend
    emitTableStatusUpdate({ tableNumber, status, updatedAt: updated.updatedAt, sensorData });
    res.json({ success: true, table: updated });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái bàn', detail: error.message });
  }
};
// Nhận dữ liệu cảm biến từ IoT và cập nhật tồn kho
const Material = require('../../models/Material');

// POST /api/iot/sensor-data
exports.receiveSensorData = async (req, res) => {
  try {
    const { data } = req.body; // [{ code, quantity }]
    if (!Array.isArray(data)) return res.status(400).json({ error: 'Dữ liệu cảm biến không hợp lệ!' });
    const results = [];
    for (const item of data) {
      const material = await Material.findOneAndUpdate(
        { code: item.code },
        { quantity: item.quantity },
        { new: true }
      );
      if (material) results.push(material);
    }
    res.json({ success: true, updated: results });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật tồn kho từ IoT', detail: error.message });
  }
};
