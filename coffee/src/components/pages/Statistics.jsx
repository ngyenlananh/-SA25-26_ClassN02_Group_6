import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const data = [
  { name: '01/01', revenue: 2400 },
  { name: '02/01', revenue: 3500 },
  { name: '03/01', revenue: 9800 },
  { name: '04/01', revenue: 3908 },
  { name: '05/01', revenue: 4800 },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333] flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-white text-xl font-bold">{value}</p>
    </div>
  </div>
);

const StatisticsModule = () => {
  return (
    <div className="space-y-6">
      {/* 4 Thẻ chỉ số nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Doanh thu ngày" value="1.250.000đ" icon={DollarSign} color="bg-orange-600" />
        <StatCard title="Tổng đơn hàng" value="45" icon={ShoppingBag} color="bg-blue-600" />
        <StatCard title="Khách hàng" value="32" icon={Users} color="bg-green-600" />
        <StatCard title="Tăng trưởng" value="+12%" icon={TrendingUp} color="bg-purple-600" />
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
        <h3 className="text-[#d4a373] font-bold mb-4">Biểu đồ doanh thu tuần</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4a373" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={12} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} axisLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#222', border: 'none'}} />
              <Area type="monotone" dataKey="revenue" stroke="#d4a373" fill="url(#colorRev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};