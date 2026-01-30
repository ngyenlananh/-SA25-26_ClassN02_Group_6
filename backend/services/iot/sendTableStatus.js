// Gửi tín hiệu trạng thái bàn lên server (node sendTableStatus.js)
const axios = require('axios');

// Dữ liệu trạng thái bàn mẫu
const tableStatus = {
  tableNumber: 'A1',
  status: 'occupied', // hoặc 'empty'
  sensorData: { pressure: 1 }
};

async function sendTableStatus() {
  try {
    const res = await axios.post('http://localhost:5000/api/iot/table-status', tableStatus);
    console.log('Gửi trạng thái bàn thành công:', res.data);
  } catch (err) {
    console.error('Lỗi gửi trạng thái bàn:', err.response?.data || err.message);
  }
}

sendTableStatus();
