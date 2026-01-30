import axios from 'axios';

const API_URL = 'http://localhost:5000/api/iot/data';

export const getSensorData = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};
