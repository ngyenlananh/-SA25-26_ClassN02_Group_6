// IoT routes
const iotRoutes = require('./services/iot/iotRoutes');


const statisticsRoutes = require('./routes/statisticsRoutes');
// Entry point backend (app.js)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const http = require('http');
const { initSocket } = require('./utils/socket');
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
// Cho phép truy cập file minh chứng
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/warehouse');


require('./models/Material');
require('./models/History');
require('./models/Customer');
require('./models/Transaction');
require('./models/Order');
const orderRoutes = require('./routes/orderRoutes');





const materialRoutes = require('./routes/materialRoutes');
const historyRoutes = require('./routes/historyRoutes');
const customerRoutes = require('./routes/customerRoutes');
const financeRoutes = require('./routes/financeRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const staffRoutes = require('./routes/staffRoutes');



app.use('/api/materials', materialRoutes);
app.use('/api/materials', historyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', financeRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/statistics', statisticsRoutes);

// API nhận đơn đặt món
app.use('/api/orders', orderRoutes);

// Route nhận dữ liệu cảm biến từ IoT
app.use('/api/iot', iotRoutes);

initSocket(server);
server.listen(5000, () => console.log('Backend running on port 5000 (app.js)'));
