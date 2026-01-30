const SystemConfig = require('../models/SystemConfig');
const bcrypt = require('bcrypt');

// Lấy cấu hình hệ thống
exports.getConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Cập nhật cấu hình hệ thống
exports.updateConfig = async (req, res) => {
  try {
    console.log('REQ BODY:', req.body); // Log dữ liệu nhận được từ frontend

    // Hỗ trợ cả dữ liệu lồng (object) hoặc phẳng (field rời)
    let updateData = {};
    if (req.body.shopInfo || req.body.bankInfo || req.body.printer || req.body.admin) {
      if (req.body.shopInfo) updateData.shopInfo = req.body.shopInfo;
      if (req.body.bankInfo) updateData.bankInfo = req.body.bankInfo;
      if (req.body.printer) updateData.printer = req.body.printer;
      if (req.body.admin) updateData.admin = req.body.admin;
    } else {
      const {
        name, address, hotline, wifiPassword, billMessage,
        bankName, accountNumber, vat,
        paperSize, language, autoPrint, sound,
        adminUsername, adminPassword
      } = req.body;
      updateData = {
        shopInfo: {
          name,
          address,
          hotline,
          wifiPassword,
          billMessage
        },
        bankInfo: {
          bankName,
          accountNumber,
          vat
        },
        printer: {
          paperSize,
          language,
          autoPrint,
          sound
        }
      };
      if (adminUsername || adminPassword) {
        updateData.admin = {};
        if (adminUsername) updateData.admin.username = adminUsername;
        if (adminPassword) updateData.admin.password = adminPassword;
      }
    }

    // Nếu có trường admin.password thì hash trước khi lưu
    if (updateData.admin && updateData.admin.password) {
      updateData.admin.password = await bcrypt.hash(updateData.admin.password, 10);
    }
    // Cập nhật document duy nhất (nếu chưa có sẽ tạo mới)
    const config = await SystemConfig.findOneAndUpdate({}, updateData, { new: true, upsert: true });
    res.json({ success: true, config });
  } catch (err) {
    console.error('Lỗi khi lưu cấu hình:', err);
    res.status(500).json({ error: 'Server error', details: err.message, stack: err.stack });
  }
};

// Đổi mật khẩu admin
exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const config = await SystemConfig.findOne();
    if (!config) return res.status(404).json({ error: 'Config not found' });
    const match = await bcrypt.compare(currentPassword, config.admin.password);
    if (!match) return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    config.admin.password = await bcrypt.hash(newPassword, 10);
    await config.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Backup hệ thống (chỉ cập nhật thời gian backup)
exports.backupSystem = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    if (!config) return res.status(404).json({ error: 'Config not found' });
    config.backup.lastBackup = new Date();
    await config.save();
    res.json({ success: true, lastBackup: config.backup.lastBackup });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset hệ thống (xóa cấu hình)
exports.resetSystem = async (req, res) => {
  try {
    await SystemConfig.deleteMany();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
