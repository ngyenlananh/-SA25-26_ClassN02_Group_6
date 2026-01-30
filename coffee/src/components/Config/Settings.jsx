import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
    // --- STATE QUẢN LÝ CẤU HÌNH ---
    const [storeInfo, setStoreInfo] = useState({
        name: 'Starbuzz Coffee',
        address: '123 Đường Láng, Hà Nội',
        phone: '0901234567',
        wifiPass: '12345678',
        welcome: 'Cảm ơn quý khách, hẹn gặp lại!'
    });

    const [paymentConfig, setPaymentConfig] = useState({
        bankName: 'MB Bank',
        accountNo: '0334613060',
        accountName: 'NGUYEN VAN A',
        vat: 8,
    });

    const [sysConfig, setSysConfig] = useState({
        paperSize: '80mm',
        autoPrint: true,
        soundAlert: true, // Âm thanh đơn mới
        language: 'vi',   // Ngôn ngữ
        theme: 'dark'     // Giao diện
    });

    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

    // --- HANDLERS ---
    const handleChangeStore = (e) => setStoreInfo({...storeInfo, [e.target.name]: e.target.value});
    const handleChangePayment = (e) => setPaymentConfig({...paymentConfig, [e.target.name]: e.target.value});
    const handleChangeSys = (key, val) => setSysConfig({...sysConfig, [key]: val});
    
    const handleSave = async () => {
        const configData = {
            shopInfo: {
                name: storeInfo.name,
                address: storeInfo.address,
                hotline: storeInfo.phone,
                wifiPassword: storeInfo.wifiPass,
                billMessage: storeInfo.welcome
            },
            bankInfo: {
                bankName: paymentConfig.bankName,
                accountNumber: paymentConfig.accountNo,
                vat: paymentConfig.vat
            },
            printer: {
                paperSize: sysConfig.paperSize,
                language: sysConfig.language,
                autoPrint: sysConfig.autoPrint,
                sound: sysConfig.soundAlert
            }
        };
        try {
            await axios.put('/api/system', configData);
            alert("✅ Đã lưu toàn bộ cấu hình hệ thống!");
        } catch (error) {
            alert("❌ Lỗi khi lưu cấu hình!");
        }
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if(password.new !== password.confirm) return alert("❌ Mật khẩu xác nhận không khớp!");
        alert("✅ Đã đổi mật khẩu thành công!");
        setPassword({ current: '', new: '', confirm: '' });
    };

    const handleBackup = () => alert("📦 Đang tải xuống bản sao lưu...");
    const handleReset = () => {
        if(confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn Reset toàn bộ dữ liệu?")) alert("Đã Reset!");
    };

    return (
        <div className="w-full h-full p-[30px] animate-fadeIn overflow-y-auto relative bg-bg">
            <div className="text-lg font-bold mb-[20px] text-accent border-b border-white/10 pb-2 flex justify-between items-center">
                <span>⚙️ Cấu hình Hệ thống Toàn diện</span>
                <button onClick={handleSave} className="bg-accent text-white text-sm px-6 py-2 rounded-lg hover:brightness-110 shadow-lg font-bold">
                    Lưu thay đổi
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-10">
                
                {/* 1. THÔNG TIN CỬA HÀNG */}
                <div className="bg-surface p-6 rounded-2xl border border-white/5 h-fit">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                        🏠 Thông tin Quán
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-text-dim block mb-1">Tên hiển thị</label>
                            <input name="name" value={storeInfo.name} onChange={handleChangeStore} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none font-bold" />
                        </div>
                        <div>
                            <label className="text-xs text-text-dim block mb-1">Địa chỉ (In hóa đơn)</label>
                            <input name="address" value={storeInfo.address} onChange={handleChangeStore} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-text-dim block mb-1">Hotline</label>
                                <input name="phone" value={storeInfo.phone} onChange={handleChangeStore} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1">Pass Wifi</label>
                                <input name="wifiPass" value={storeInfo.wifiPass} onChange={handleChangeStore} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-text-dim block mb-1">Lời chào cuối bill</label>
                            <textarea name="welcome" value={storeInfo.welcome} onChange={handleChangeStore} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none h-[70px]" />
                        </div>
                    </div>
                </div>

                {/* 2. CỘT PHẢI: NHIỀU MỤC NHỎ */}
                <div className="flex flex-col gap-6">
                    
                    {/* THANH TOÁN */}
                    <div className="bg-surface p-6 rounded-2xl border border-white/5">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                            💳 Ngân hàng & Thuế
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <select name="bankName" value={paymentConfig.bankName} onChange={handleChangePayment} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none">
                                <option>MB Bank</option><option>Vietcombank</option><option>Techcombank</option>
                            </select>
                            <input name="accountNo" value={paymentConfig.accountNo} onChange={handleChangePayment} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none font-mono" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-white font-bold text-sm">Thuế VAT (%)</span>
                            <input type="number" name="vat" value={paymentConfig.vat} onChange={handleChangePayment} className="w-[60px] bg-bg border border-[#444] rounded p-2 text-white text-center font-bold" />
                        </div>
                    </div>

                    {/* 🆕 BẢO MẬT (MỚI) */}
                    <div className="bg-surface p-6 rounded-2xl border border-white/5">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                            🔐 Đổi Mật Khẩu Admin
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-3">
                            <input type="password" placeholder="Mật khẩu hiện tại" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none focus:border-accent" value={password.current} onChange={e=>setPassword({...password, current: e.target.value})} />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="password" placeholder="Mật khẩu mới" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none focus:border-accent" value={password.new} onChange={e=>setPassword({...password, new: e.target.value})} />
                                <input type="password" placeholder="Xác nhận lại" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none focus:border-accent" value={password.confirm} onChange={e=>setPassword({...password, confirm: e.target.value})} />
                            </div>
                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Cập nhật mật khẩu</button>
                        </form>
                    </div>

                    {/* 🆕 CÀI ĐẶT CHUNG (MỚI) */}
                    <div className="bg-surface p-6 rounded-2xl border border-white/5">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                            🖨️ Máy in & Hệ thống
                        </h3>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-text-dim text-sm">Khổ giấy in</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleChangeSys('paperSize', '58mm')} className={`px-3 py-1 rounded text-xs font-bold border ${sysConfig.paperSize === '58mm' ? 'bg-accent text-white border-accent' : 'border-[#444] text-text-dim'}`}>58mm</button>
                                <button onClick={() => handleChangeSys('paperSize', '80mm')} className={`px-3 py-1 rounded text-xs font-bold border ${sysConfig.paperSize === '80mm' ? 'bg-accent text-white border-accent' : 'border-[#444] text-text-dim'}`}>80mm</button>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-text-dim text-sm">Ngôn ngữ (Language)</span>
                            <select value={sysConfig.language} onChange={(e)=>handleChangeSys('language', e.target.value)} className="bg-bg border border-[#444] text-white text-xs p-1 rounded">
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-text-dim">In tự động</span>
                                <input type="checkbox" checked={sysConfig.autoPrint} onChange={()=>handleChangeSys('autoPrint', !sysConfig.autoPrint)} className="accent-accent w-4 h-4" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-text-dim">Âm thanh báo</span>
                                <input type="checkbox" checked={sysConfig.soundAlert} onChange={()=>handleChangeSys('soundAlert', !sysConfig.soundAlert)} className="accent-accent w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button onClick={handleBackup} className="flex-1 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded border border-blue-500/30 font-bold text-xs">☁️ Sao lưu</button>
                            <button onClick={handleReset} className="flex-1 py-2 bg-danger/20 text-danger hover:bg-danger/30 rounded border border-danger/30 font-bold text-xs">🗑️ Reset</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;