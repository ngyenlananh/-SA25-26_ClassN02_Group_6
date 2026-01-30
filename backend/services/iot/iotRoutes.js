const express = require('express');
const router = express.Router();
const iotController = require('./iotController');


// Nhận dữ liệu cảm biến từ IoT
router.post('/sensor-data', iotController.receiveSensorData);

// Nhận tín hiệu trạng thái bàn từ IoT
router.post('/table-status', iotController.receiveTableStatus);

module.exports = router;
