import axios from 'axios';

const API_URL = 'http://localhost:5000/api/statistics';

export const fetchRevenueWeek = async () => {
  const res = await axios.get(`${API_URL}/revenue-week`);
  return res.data;
};

export const fetchRecentOrders = async () => {
  const res = await axios.get(`${API_URL}/recent-orders`);
  return res.data;
};

export const fetchOrdersInWeek = async () => {
  const res = await axios.get(`${API_URL}/orders-in-week`);
  return res.data;
};
