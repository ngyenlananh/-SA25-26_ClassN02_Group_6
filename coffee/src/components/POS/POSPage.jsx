// src/components/POS/POSPage.jsx
import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../../constants/mockMenu';

const POSPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Logic lọc món ăn theo danh mục
  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(product => product.category === activeCategory);

  // Hàm định dạng tiền tệ (Ví dụ: 25000 -> 25.000 ₫)
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* --- CỘT TRÁI: DANH SÁCH MÓN (Chiếm 70% chiều rộng) --- */}
      <div className="w-[70%] flex flex-col h-full">
        
        {/* 1. Header & Tìm kiếm */}
        <div className="h-16 bg-white border-b flex items-center px-4 justify-between shrink-0">
          <h1 className="font-bold text-xl text-gray-700">☕ MENU GỌI MÓN</h1>
          <input 
            type="text" 
            placeholder="Tìm món..." 
            className="border bg-gray-50 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 2. Danh mục (Categories) */}
        <div className="p-2 bg-white shadow-sm shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors
                  ${activeCategory === cat.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Lưới sản phẩm (Product Grid) - Phần cuộn chính */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow cursor-pointer flex flex-col overflow-hidden h-64 group"
                onClick={() => alert(`Bạn vừa chọn: ${product.name}`)}
              >
                {/* Ảnh món */}
                <div className="h-36 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Thông tin */}
                <div className="p-3 flex flex-col justify-between flex-1">
                  <h3 className="font-bold text-gray-800 line-clamp-2">{product.name}</h3>
                  <p className="text-blue-600 font-extrabold text-lg">{formatMoney(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI: HÓA ĐƠN / GIỎ HÀNG (Chiếm 30% chiều rộng) --- */}
      <div className="w-[30%] bg-white border-l shadow-xl flex flex-col h-full z-10">
        
        {/* Header Giỏ hàng */}
        <div className="h-16 border-b flex items-center justify-between px-4 bg-gray-50 shrink-0">
          <span className="font-bold text-gray-700">Đơn hàng #001</span>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString('vi-VN')}</span>
        </div>

        {/* Danh sách món đã chọn (Tạm thời để trống) */}
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center flex-col text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>Chưa có món nào</p>
          <p className="text-xs mt-1">Vui lòng chọn món bên trái</p>
        </div>

        {/* Footer: Tổng tiền & Nút thanh toán */}
        <div className="border-t p-4 bg-gray-50 shrink-0">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-medium">0 ₫</span>
          </div>
          <div className="flex justify-between mb-4 text-xl font-bold text-blue-800">
            <span>Tổng cộng:</span>
            <span>0 ₫</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg">
            THANH TOÁN
          </button>
        </div>

      </div>
    </div>
  );
};

export default POSPage;