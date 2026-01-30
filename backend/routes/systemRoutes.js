const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

// Lấy cấu hình hệ thống
router.get('/', systemController.getConfig);
// Cập nhật cấu hình hệ thống
router.put('/', systemController.updateConfig);
// Đổi mật khẩu admin
router.post('/change-password', systemController.changeAdminPassword);
// Backup hệ thống
router.post('/backup', systemController.backupSystem);
// Reset hệ thống
router.post('/reset', systemController.resetSystem);

module.exports = router;
