import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ summary }) => {
    const data = {
        labels: Object.keys(summary),
        datasets: [
            {
                data: Object.values(summary),
                backgroundColor: [
                    '#22c55e', // Thu - xanh
                    '#ef4444'  // Chi - đỏ
                ],
                borderColor: '#18191A', // viền đen
                borderWidth: 3,
            },
        ],
    };
    return (
        <div style={{ width: 220, height: 220, borderRadius: '50%', background: '#18191A', padding: 8 }}>
            <Pie data={{
                ...data,
                datasets: data.datasets.map(ds => ({
                    ...ds,
                    borderColor: '#fff',
                    borderWidth: 3
                }))
            }} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
    );
};

export default CategoryPieChart;
