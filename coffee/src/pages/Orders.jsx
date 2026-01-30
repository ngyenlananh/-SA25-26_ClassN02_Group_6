import React, { useEffect, useState } from 'react';
import { fetchRecentOrders } from '../services/statisticsService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentOrders()
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Không thể tải dữ liệu đơn hàng!');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-accent">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-danger">{error}</div>;

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-accent">Danh sách đơn hàng</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-dim uppercase bg-white/5">
            <tr>
              <th className="px-3 py-2 rounded-l-lg">Mã đơn</th>
              <th className="px-3 py-2">Thời gian</th>
              <th className="px-3 py-2">Món</th>
              <th className="px-3 py-2">Tổng tiền</th>
              <th className="px-3 py-2 rounded-r-lg">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-3 py-3 font-bold text-accent">{order.id}</td>
                <td className="px-3 py-3 text-text-dim">{order.time}</td>
                <td className="px-3 py-3 truncate max-w-[150px] text-white">{typeof order.items === 'object' ? JSON.stringify(order.items) : order.items}</td>
                <td className="px-3 py-3 font-bold">{order.total?.toLocaleString()}đ</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === 'Success' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
