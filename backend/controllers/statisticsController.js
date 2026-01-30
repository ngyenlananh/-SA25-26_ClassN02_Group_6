// API: Lấy danh sách đơn hàng trong tuần hiện tại
exports.ordersInWeek = async (req, res) => {
        try {
                const now = new Date();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // CN đầu tuần
                startOfWeek.setHours(0,0,0,0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);
                endOfWeek.setHours(0,0,0,0);
                const orders = await Order.find({
                        createdAt: { $gte: startOfWeek, $lt: endOfWeek }
                }).sort({ createdAt: -1 });
                const mapped = orders.map(order => ({
                        id: order._id,
                        time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
                        total: order.amount,
                        status: order.status === 'Đã thanh toán' ? 'Success' : (order.status === 'Chờ duyệt' ? 'Pending' : order.status),
                        items: typeof order.desc === 'object' ? JSON.stringify(order.desc) : (order.desc || ''),
                }));
                res.json(mapped);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};


const Order = require('../models/Transaction');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');
const Material = require('../models/Material');

// 1. Tổng doanh thu ngày hôm nay
exports.revenueToday = async (req, res) => {
        try {
                const start = new Date();
                start.setHours(0,0,0,0);
                const end = new Date();
                end.setHours(23,59,59,999);
                const result = await Order.aggregate([
                        { $match: { createdAt: { $gte: start, $lte: end } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                ]);
                res.json({ revenue: result[0]?.total || 0 });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

// 2. Tổng số đơn hàng hôm nay
exports.ordersToday = async (req, res) => {
        try {
                const start = new Date();
                start.setHours(0,0,0,0);
                const end = new Date();
                end.setHours(23,59,59,999);
                const count = await Order.countDocuments({ createdAt: { $gte: start, $lte: end } });
                res.json({ orders: count });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

// 3. Khách hàng mới hôm nay
exports.newCustomersToday = async (req, res) => {
        try {
                const start = new Date();
                start.setHours(0,0,0,0);
                const end = new Date();
                end.setHours(23,59,59,999);
                const count = await Customer.countDocuments({ createdAt: { $gte: start, $lte: end } });
                res.json({ newCustomers: count });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

// 4. Nhân sự online
exports.staffOnline = async (req, res) => {
        try {
                const count = await Staff.countDocuments({ status: 'online' });
                res.json({ online: count });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

// 5. Biểu đồ doanh thu tuần này
exports.revenueWeek = async (req, res) => {
        try {
                const now = new Date();
                const week = [];
                const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                for (let i = 6; i >= 0; i--) {
                        const day = new Date(now);
                        day.setDate(now.getDate() - i);
                        day.setHours(0,0,0,0);
                        const nextDay = new Date(day);
                        nextDay.setDate(day.getDate() + 1);
                        const result = await Order.aggregate([
                                { $match: { createdAt: { $gte: day, $lt: nextDay } } },
                                { $group: { _id: null, total: { $sum: "$amount" } } }
                        ]);
                        week.push({
                                name: weekdays[day.getDay()],
                                dt: result[0]?.total || 0
                        });
                }
                res.json(week);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

// 6. Tỷ trọng bán hàng (giả lập)
exports.salesRatio = async (req, res) => {
        try {
                // Tùy vào cấu trúc DB, bạn cần join với bảng sản phẩm để group theo loại
                // Ở đây trả về mẫu
                res.json({
                        drink: 60,
                        food: 30,
                        other: 10
                });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

// 7. Đơn hàng mới nhất
exports.recentOrders = async (req, res) => {
        try {
                const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
                // Chuẩn hóa dữ liệu trả về cho frontend
                const mapped = orders.map(order => ({
                        id: order._id,
                        time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
                        total: order.amount,
                        status: order.status === 'Đã thanh toán' ? 'Success' : (order.status === 'Chờ duyệt' ? 'Pending' : order.status),
                        items: typeof order.desc === 'object' ? JSON.stringify(order.desc) : (order.desc || ''),
                }));
                res.json(mapped);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

// 8. Cảnh báo tồn kho (tự động theo min)
exports.lowStock = async (req, res) => {
        try {
                const materials = await Material.find();
                // Lọc những nguyên liệu có quantity <= min
                const lowStock = materials.filter(m =>
                        Number(m.quantity) <= Number(m.min)
                );
                res.json(lowStock);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

