const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Lấy danh sách nhân viên
router.get('/', staffController.getAllStaff);
// Lấy 1 nhân viên
router.get('/:id', staffController.getStaffById);
// Thêm nhân viên
router.post('/', staffController.createStaff);
// Cập nhật nhân viên
router.put('/:id', staffController.updateStaff);
// Xóa nhân viên
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
