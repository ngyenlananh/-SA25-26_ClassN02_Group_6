import React, { useState, useEffect } from 'react';
import { Store, Table, ShieldCheck, Bell, Save, RefreshCw } from 'lucide-react';
import { updateSystemConfig } from '../../services/systemService';

const SystemSettings = () => {
  // 1. Quản lý trạng thái thông tin cửa hàng
  const [shopConfig, setShopConfig] = useState({
    name: 'Starbuzz Coffee',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    hotline: '0123456789',
    wifiPassword: 'starbuzz_welcome',
    billMessage: ''
  });

  // 2. Quản lý sơ đồ bàn (Gia lập dữ liệu)
  const [tables, setTables] = useState(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, status: 'active' })));

  const handleUpdateConfig = (e) => {
    const { name, value } = e.target;
    setShopConfig({ ...shopConfig, [name]: value });
  };


  const saveToServer = async () => {
    try {
      await updateSystemConfig({
        shopInfo: {
          name: shopConfig.name,
          address: shopConfig.address,
          hotline: shopConfig.hotline,
          wifiPassword: shopConfig.wifiPassword,
          billMessage: shopConfig.billMessage || ''
        },
        bankInfo: {
          bankName: '',
          accountNumber: '',
          vat: 0
        },
        printer: {
          paperSize: '80mm',
          language: 'vi',
          autoPrint: false,
          sound: false
        },
        admin: {
          username: 'admin',
          password: 'admin'
        }
      });
      alert('Đã lưu cấu hình hệ thống thành công!');
    } catch (err) {
      alert('Lỗi khi lưu cấu hình!');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Cài đặt hệ thống</h1>
        <button 
          onClick={saveToServer}
          className="flex items-center bg-[#d4a373] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#b58a5f] transition-all"
        >
          <Save size={18} className="mr-2" /> Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KHỐI 1: THÔNG TIN CỬA HÀNG */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
          <div className="flex items-center space-x-2 text-[#d4a373] mb-6">
            <Store size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Cấu hình chung</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Tên hiển thị trên hóa đơn</label>
              <input 
                name="name"
                type="text" 
                value={shopConfig.name} 
                onChange={handleUpdateConfig}
                className="w-full bg-[#252525] border border-[#444] rounded-lg p-2.5 text-white focus:border-[#d4a373] outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Địa chỉ</label>
              <input 
                name="address"
                type="text" 
                value={shopConfig.address}
                onChange={handleUpdateConfig}
                className="w-full bg-[#252525] border border-[#444] rounded-lg p-2.5 text-white focus:border-[#d4a373] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Số điện thoại</label>
                <input name="hotline" type="text" value={shopConfig.hotline} onChange={handleUpdateConfig} className="w-full bg-[#252525] border border-[#444] rounded-lg p-2.5 text-white outline-none focus:border-[#d4a373]" />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Mật khẩu Wifi</label>
                <input name="wifiPassword" type="text" value={shopConfig.wifiPassword} onChange={handleUpdateConfig} className="w-full bg-[#252525] border border-[#444] rounded-lg p-2.5 text-white outline-none focus:border-[#d4a373]" />
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 2: PHÂN QUYỀN NHÂN VIÊN */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
          <div className="flex items-center space-x-2 text-[#d4a373] mb-6">
            <ShieldCheck size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Nhân sự & Bảo mật</h3>
          </div>
          <div className="space-y-3">
            {[
              { role: 'Admin', desc: 'Toàn quyền hệ thống', color: 'text-red-400' },
              { role: 'Manager', desc: 'Quản lý kho & Thống kê', color: 'text-blue-400' },
              { role: 'Staff', desc: 'Chỉ được phép bán hàng', color: 'text-green-400' }
            ].map((item) => (
              <div key={item.role} className="flex justify-between items-center p-3 bg-[#252525] rounded-lg border border-[#333]">
                <div>
                  <p className={`font-bold text-sm ${item.color}`}>{item.role}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors"><RefreshCw size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* KHỐI 3: QUẢN LÝ SƠ ĐỒ BÀN */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-[#d4a373]">
              <Table size={20} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Sơ đồ vị trí bàn</h3>
            </div>
            <span className="text-xs text-gray-500">Tổng số: {tables.length} bàn</span>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-3">
            {tables.map((table) => (
              <div 
                key={table.id} 
                className="aspect-square bg-[#252525] border border-[#444] rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#d4a373] hover:text-[#d4a373] transition-all cursor-pointer"
              >
                <span className="text-xs font-bold">Bàn</span>
                <span className="text-lg">{table.id}</span>
              </div>
            ))}
            <button className="aspect-square border-2 border-dashed border-[#444] rounded-lg flex items-center justify-center text-gray-500 hover:text-[#d4a373] hover:border-[#d4a373] transition-all">
              <span className="text-2xl">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;