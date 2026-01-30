
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');

// Lấy danh sách campaign kèm lượt sử dụng và doanh thu
// Lọc, tìm kiếm, phân trang campaign
router.get('/', async (req, res) => {
    try {
        const {
            search = '',
            code = '',
            status = '',
            time = '',
            page = 1,
            limit = 10
        } = req.query;

        // Xây dựng điều kiện lọc
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { desc: { $regex: search, $options: 'i' } }
            ];
        }
        if (code) filter.code = { $regex: code, $options: 'i' };
        if (status) filter.status = status;
        if (time) filter.time = { $regex: time, $options: 'i' };

        // Phân trang
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Campaign.countDocuments(filter);
        const campaigns = await Campaign.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Lấy tất cả transaction có campaignCode
        const transactions = await Transaction.find({ campaignCode: { $exists: true, $ne: null } });
        // Tính toán lượt sử dụng và doanh thu cho từng campaign
        const now = new Date();
        const campaignsWithStats = campaigns.map(campaign => {
            const usedTransactions = transactions.filter(tran => tran.campaignCode === campaign.code);
            const used = usedTransactions.length;
            const revenue = usedTransactions.reduce((sum, tran) => sum + (tran.amount || 0), 0);
            // Kiểm tra hết lượt hoặc hết hạn
            let status = campaign.status;
            let warning = '';
            // Hết lượt sử dụng
            if (used >= campaign.limit) status = 'expired';
            // Gần hết lượt sử dụng (>= 90% limit)
            else if (used >= 0.9 * campaign.limit) warning = 'Sắp đạt giới hạn lượt sử dụng!';
            // Hết hạn (nếu campaign.time có định dạng ngày kết thúc)
            // Giả sử campaign.time có dạng: 'Từ 20/01/2026 đến hết 31/01/2026'
            const match = campaign.time && campaign.time.match(/đến hết (\d{2}\/\d{2}\/\d{4})/);
            if (match) {
                const endDate = match[1].split('/').reverse().join('-');
                const end = new Date(endDate);
                if (end < now) status = 'expired';
                else if ((end - now) / (1000 * 60 * 60 * 24) <= 3) warning = 'Sắp hết hạn!'; // còn <= 3 ngày
            }
            return {
                ...campaign.toObject(),
                used,
                revenue,
                status,
                warning
            };
        });
        res.json({
            data: campaignsWithStats,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Tạo mới campaign
router.post('/', async (req, res) => {
    try {
        const newCampaign = new Campaign(req.body);
        await newCampaign.save();
        res.status(201).json(newCampaign);
    } catch (err) {
        res.status(400).json({ error: 'Create failed' });
    }
});

// Cập nhật campaign
router.put('/:id', async (req, res) => {
    try {
        await Campaign.findByIdAndUpdate(req.params.        id, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: 'Update failed' });
    }
});

// Xóa campaign
router.delete('/:id', async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: 'Delete failed' });
    }
});

module.exports = router;
