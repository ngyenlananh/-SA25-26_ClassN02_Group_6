import React, { useState } from 'react';
import LowStockWarning from '../LowStockWarning';
import { useNavigate } from 'react-router-dom';
import { fetchRevenueWeek, fetchRecentOrders, fetchOrdersInWeek } from '../../services/statisticsService';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend 
} from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    // State cho dữ liệu thực
    const [dataRevenue, setDataRevenue] = useState([
        { name: 'T2', dt: 4000000 }, { name: 'T3', dt: 3000000 },
        { name: 'T4', dt: 2000000 }, { name: 'T5', dt: 2780000 },
        { name: 'T6', dt: 1890000 }, { name: 'T7', dt: 6390000 }, { name: 'CN', dt: 8490000 },
    ]);
    const [recentOrders, setRecentOrders] = useState([
        { id: '#10234', time: '10:32', total: 125000, status: 'Success', items: '2 Cafe, 1 Bánh' },
        { id: '#10233', time: '10:15', total: 45000, status: 'Success', items: '1 Trà đào' },
        { id: '#10232', time: '09:50', total: 320000, status: 'Pending', items: 'Combo Nhóm 4' },
        { id: '#10231', time: '09:45', total: 85000, status: 'Success', items: '2 Bạc xỉu' },
    ]);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [ordersInWeek, setOrdersInWeek] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const dataCategory = [
        { name: 'Đồ uống', value: 65, color: '#d4a373' },
        { name: 'Đồ ăn', value: 25, color: '#4ade80' },
        { name: 'Khác', value: 10, color: '#fb7185' },
    ];



    const formatCurrency = (value) => `${value.toLocaleString()}đ`;

    return (
        <div className="w-full h-full p-[30px] animate-fadeIn overflow-y-auto relative bg-bg">
            <div className="text-lg font-bold mb-[20px] text-accent border-b border-white/10 pb-2 flex justify-between items-center">
                <span>📊 Trung tâm điều hành</span>
                <div className="text-xs text-text-dim font-normal">Cập nhật: Vừa xong</div>
            </div>

            {/* 1. OVERVIEW CARDS */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase mb-2">Doanh thu ngày</div>
                    <div className="text-2xl font-extrabold text-success">4.200.000đ</div>
                    <div className="text-xs text-text-dim mt-1">↗ 12% hôm qua</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase mb-2">Đơn hàng</div>
                    <div className="text-2xl font-extrabold text-white">85 <span className="text-sm font-normal">đơn</span></div>
                    <div className="text-xs text-text-dim mt-1">Trung bình 50k/đơn</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase mb-2">Khách hàng</div>
                    <div className="text-2xl font-extrabold text-accent">32 <span className="text-sm font-normal">mới</span></div>
                    <div className="text-xs text-text-dim mt-1">12 khách quay lại</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase mb-2">Nhân sự online</div>
                    <div className="text-2xl font-extrabold text-blue-400">03 <span className="text-sm font-normal">người</span></div>
                    <div className="text-xs text-text-dim mt-1">Ca Sáng (7h-15h)</div>
                </div>
            </div>

            {/* 2. CHARTS AREA */}
            <div className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
                <div className="bg-surface p-6 rounded-2xl border border-white/5 h-[300px]">
                    <h3 className="text-white font-bold mb-4 text-sm flex justify-between">
                        📈 Biểu đồ doanh thu tuần này
                        <span className="text-xs text-accent cursor-pointer" onClick={async () => {
                            setLoadingOrders(true);
                            setShowOrdersModal(true);
                            try {
                                const orders = await fetchOrdersInWeek();
                                setOrdersInWeek(orders);
                            } finally {
                                setLoadingOrders(false);
                            }
                        }}>Chi tiết &rarr;</span>
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={dataRevenue}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d4a373" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tick={{fill: '#999', fontSize: 10}} />
                            <YAxis stroke="#666" tick={{fill: '#999', fontSize: 10}} tickFormatter={(val)=>`${val/1000000}M`} />
                            <Tooltip contentStyle={{backgroundColor:'#1a1c1e', borderColor:'#333'}} itemStyle={{color:'#d4a373'}} formatter={formatCurrency} />
                            <Area type="monotone" dataKey="dt" stroke="#d4a373" strokeWidth={2} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-white/5 h-[300px] flex flex-col">
                    <h3 className="text-white font-bold mb-2 text-sm">🍰 Tỷ trọng bán hàng</h3>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={dataCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                    {dataCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor:'#1a1c1e', borderColor:'#333'}} />
                                <Legend verticalAlign="bottom" height={36} iconSize={10} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM SECTION: Recent Orders & Stock Alerts */}
            <div className="grid grid-cols-[2fr_1fr] gap-6">
                
                {/* Bảng đơn hàng gần đây */}
                <div className="bg-surface p-6 rounded-2xl border border-white/5">
                    <h3 className="text-white font-bold mb-4 text-sm flex justify-between items-center">
                        🧾 Đơn hàng mới nhất
                        <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-text-dim" onClick={() => navigate('/orders')}>Xem tất cả</button>
                    </h3>
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
                                {recentOrders.map((order, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-3 py-3 font-bold text-accent">{order.id}</td>
                                        <td className="px-3 py-3 text-text-dim">{order.time}</td>
                                        <td className="px-3 py-3 truncate max-w-[150px] text-white">{order.items}</td>
                                        <td className="px-3 py-3 font-bold">{order.total.toLocaleString()}đ</td>
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

                {/* Cảnh báo tồn kho động từ backend */}
                <LowStockWarning />
            </div>

            {/* Modal hiển thị đơn hàng trong tuần */}
            {showOrdersModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-surface p-8 rounded-xl w-[90vw] max-w-3xl max-h-[80vh] overflow-auto relative">
                        <button className="absolute top-2 right-4 text-xl text-danger" onClick={() => setShowOrdersModal(false)}>×</button>
                        <h2 className="text-xl font-bold mb-4 text-accent">Đơn hàng trong tuần</h2>
                        {loadingOrders ? (
                            <div className="text-accent">Đang tải dữ liệu...</div>
                        ) : (
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
                                    {ordersInWeek.map((order, i) => (
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
                                    {/* Dòng tổng */}
                                    <tr className="bg-black/20 font-bold">
                                        <td colSpan={3} className="px-3 py-3 text-right text-accent">Tổng cộng</td>
                                        <td className="px-3 py-3 text-success">{ordersInWeek.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}đ</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;