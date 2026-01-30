import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const COLORS = {
  'Kim Cương': '#06b6d4',
  'Vàng': '#facc15',
  'Bạc': '#a3a3a3',
  'Đồng': '#ea580c',
};

export default function RankPieChart({ customers }) {
  // Đếm số lượng từng hạng thẻ
  const rankCounts = React.useMemo(() => {
    const counts = { 'Kim Cương': 0, 'Vàng': 0, 'Bạc': 0, 'Đồng': 0 };
    customers.forEach(c => {
      if (counts[c.rank] !== undefined) counts[c.rank]++;
    });
    return counts;
  }, [customers]);

  const data = {
    labels: Object.keys(rankCounts),
    datasets: [
      {
        data: Object.values(rankCounts),
        backgroundColor: Object.keys(rankCounts).map(r => COLORS[r]),
        borderColor: '#222',
        borderWidth: 3,
        cutout: '70%',
      },
    ],
  };

  return (
    <div className="bg-surface rounded-2xl flex flex-col items-center justify-center border border-accent/30 shadow-lg p-4" style={{ width: 200, height: 200, minWidth:200, minHeight:200, position:'relative' }}>
      <div style={{width:120, height:120, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Doughnut data={data} options={{
          plugins: {
            legend: { display: false },
            datalabels: { display: false },
          },
          cutout: '70%',
          maintainAspectRatio: false,
        }} />
      </div>
    </div>
  );
}
