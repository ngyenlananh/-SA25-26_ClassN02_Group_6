import React from 'react';
import { Edit2, Trash2, EyeOff } from 'lucide-react';

const FoodTable = ({ foods, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden mt-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#252525] text-[#d4a373] uppercase text-xs font-bold tracking-wider">
            <th className="px-6 py-4">Hình ảnh</th>
            <th className="px-6 py-4">Tên món</th>
            <th className="px-6 py-4">Danh mục</th>
            <th className="px-6 py-4">Giá bán</th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#333]">
          {foods.map((item) => (
            <tr key={item.id} className="hover:bg-[#222] transition-colors group">
              <td className="px-6 py-4">
                <img 
                  src={item.image || 'https://via.placeholder.com/50'} 
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover border border-[#444]"
                />
              </td>
              <td className="px-6 py-4 text-white font-medium">{item.name}</td>
              <td className="px-6 py-4 text-gray-400">
                <span className="bg-[#333] px-2 py-1 rounded text-xs">{item.category}</span>
              </td>
              <td className="px-6 py-4 text-[#d4a373] font-bold">
                {item.price.toLocaleString()}đ
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'Available' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {item.status === 'Available' ? 'Đang bán' : 'Hết hàng'}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(item)} className="p-2 text-blue-400 hover:bg-blue-900 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onToggleStatus(item)} className="p-2 text-yellow-400 hover:bg-yellow-900 rounded-lg">
                    <EyeOff size={18} />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-2 text-red-400 hover:bg-red-900 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTable;