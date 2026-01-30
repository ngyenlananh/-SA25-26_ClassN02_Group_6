import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, defs, stop, linearGradient 
} from 'recharts';

// Dữ liệu mẫu doanh thu theo ngày
const data = [
  { name: 'Thứ 2', revenue: 4000 },
  { name: 'Thứ 3', revenue: 3000 },
  { name: 'Thứ 4', revenue: 5000 },
  { name: 'Thứ 5', revenue: 2780 },
  { name: 'Thứ 6', revenue: 1890 },
  { name: 'Thứ 7', revenue: 6390 },
  { name: 'Chủ Nhật', revenue: 8490 },
];

const RevenueChart = () => {
  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      padding: '20px', 
      borderRadius: '12px',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#d4a373' }}>Thống kê doanh thu tuần này</h3>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4a373" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#888" 
              tick={{fill: '#888', fontSize: 12}} 
              axisLine={false}
            />
            <YAxis 
              stroke="#888" 
              tick={{fill: '#888', fontSize: 12}} 
              axisLine={false}
              tickFormatter={(value) => `${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }}
              itemStyle={{ color: '#d4a373' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#d4a373" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;