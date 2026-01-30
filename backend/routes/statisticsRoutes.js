const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/revenue-week', statisticsController.revenueWeek);
router.get('/recent-orders', statisticsController.recentOrders);
router.get('/orders-in-week', statisticsController.ordersInWeek);
// Bạn có thể thêm các route thống kê khác ở đây nếu cần

module.exports = router;
