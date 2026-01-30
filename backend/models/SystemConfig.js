const mongoose = require('mongoose');

const SystemConfigSchema = new mongoose.Schema({
  shopInfo: {
    name: String,
    address: String,
    hotline: String,
    wifiPassword: String,
    billMessage: String
  },
  bankInfo: {
    bankName: String,
    accountNumber: String,
    vat: { type: Number, default: 0 }
  },
  admin: {
    username: { type: String, default: 'admin' },
    password: String // hashed password
  },
  printer: {
    paperSize: { type: String, default: '58mm' },
    language: { type: String, default: 'vi' },
    autoPrint: { type: Boolean, default: false },
    sound: { type: Boolean, default: false }
  },
  backup: {
    lastBackup: Date
  }
});

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
