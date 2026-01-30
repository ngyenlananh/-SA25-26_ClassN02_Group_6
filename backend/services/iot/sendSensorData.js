// Gửi dữ liệu cảm biến lên server (ví dụ: node sendSensorData.js)
const axios = require('axios');

// Dữ liệu cảm biến đo tồn kho với code thực tế từ database
const sensorData = [
  { code: 'NL-123', quantity: 1 },    // Muối (min: 2, test cảnh báo)
  { code: '123', quantity: 1 },       // 123 (Trà, min: 3, test cảnh báo)
  { code: 'NL-124', quantity: 2 },    // Sữa đậu (min: 1, không cảnh báo)
  { code: 'NL-254', quantity: 50 },   // Trà gừng ggg (min: 10, không cảnh báo)
  { code: 'NL-455', quantity: 10 }    // Hạt táo (min: 12, test cảnh báo)
];

async function sendData() {
  try {
    const res = await axios.post('http://localhost:5000/api/iot/sensor-data', { data: sensorData });
    console.log('Gửi dữ liệu cảm biến thành công:', res.data);
  } catch (err) {
    console.error('Lỗi gửi dữ liệu cảm biến:', err.response?.data || err.message);
  }
}

sendData();
