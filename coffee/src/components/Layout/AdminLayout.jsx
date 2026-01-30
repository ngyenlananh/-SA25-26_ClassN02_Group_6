// src/components/Layout/AdminLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. SIDEBAR TRÁI */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b font-bold text-xl text-red-600">
          COFFEE MANAGER
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block p-3 rounded hover:bg-red-50 text-gray-700 font-medium">
            📊 Tổng quan
          </Link>
          <Link to="/admin/inventory" className="block p-3 rounded hover:bg-red-50 text-gray-700 font-medium">
            📦 Kho hàng
          </Link>
          <Link to="/pos" className="block p-3 mt-10 bg-red-600 text-white rounded text-center">
            Chuyển sang Bán hàng
          </Link>
        </nav>
      </aside>

      {/* 2. NỘI DUNG CHÍNH (Thay đổi theo từng trang) */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
            <Outlet /> {/* Đây là nơi nội dung con sẽ hiển thị */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;