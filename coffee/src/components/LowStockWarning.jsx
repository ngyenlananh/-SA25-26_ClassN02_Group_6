
import { useEffect, useState } from 'react';
import { getLowStockMaterials } from '../services/materialService';

function LowStockWarning() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStock = () => {
      getLowStockMaterials()
        .then(data => {
          setMaterials(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    };
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 120000); // 2 phút
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!materials.length) return null;

  return (
    <div className="low-stock-warning bg-red-50 border border-red-200 shadow-lg rounded-xl p-4 mb-4 w-full animate-fadeIn animate-pulse-fast">
      <div className="flex items-center mb-2 gap-2">
        <span className="text-red-500 text-xl">⚠️</span>
        <span className="font-bold text-red-700 text-base">Cảnh báo sắp hết hạn</span>
        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{materials.length}</span>
      </div>
      <ul className="space-y-2">
        {materials.map(m => (
          <li key={m._id} className="flex items-center bg-red-100 hover:bg-red-200 transition rounded-lg px-3 py-2 shadow-sm">
            <span className="font-semibold text-red-800">{m.name.trim()}</span>
            <span className="text-xs text-red-600 ml-2">(Còn lại: <span className="font-bold">{m.quantity}</span> | Ngưỡng: {m.min})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LowStockWarning;
