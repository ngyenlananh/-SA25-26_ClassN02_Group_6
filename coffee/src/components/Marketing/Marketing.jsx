import React, { useState, useMemo, useEffect } from 'react';

const Marketing = () => {
    // --- DATA ---
    const [promos, setPromos] = useState([]);

    // Fetch campaigns from backend when component mounts
    useEffect(() => {
        fetch('http://localhost:5000/api/campaigns')
            .then(res => res.json())
            .then(result => setPromos(result.data))
            .catch(() => {});
    }, []);
    const [activeTab, setActiveTab] = useState('all'); 
    const [showModal, setShowModal] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null); // State để lưu CTKM đang sửa
    const [copiedId, setCopiedId] = useState(null);

    // --- STATS ---
    const stats = useMemo(() => {
        return {
            totalRunning: promos.filter(p => p.status === 'running').length,
            totalUsed: promos.reduce((sum, p) => sum + p.used, 0),
            totalRevenue: promos.reduce((sum, p) => sum + p.revenue, 0)
        };
    }, [promos]);

    const filteredPromos = promos.filter(p => activeTab === 'all' || p.status === activeTab);

    // --- HANDLERS ---
    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Mở Modal để tạo mới
    const handleCreate = () => {
        setEditingPromo(null); // Reset form
        setShowModal(true);
    };

    // Mở Modal để sửa
    const handleEdit = (promo) => {
        setEditingPromo(promo); // Đổ dữ liệu vào form
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Bạn có chắc muốn xóa chương trình này không?")) {
            await fetch(`http://localhost:5000/api/campaigns/${id}`, {
                method: 'DELETE'
            });
            fetch('http://localhost:5000/api/campaigns')
                .then(res => res.json())
                .then(result => setPromos(result.data));
        }
    };

    const handleStop = (id) => {
        if(window.confirm("Dừng chương trình này ngay lập tức?")) {
            setPromos(promos.map(p => p.id === id ? { ...p, status: 'expired' } : p));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formProps = {
            code: formData.get('code').toUpperCase(),
            title: formData.get('title'),
            desc: formData.get('desc'),
            time: formData.get('time'),
            color: formData.get('color'),
            limit: Number(formData.get('limit')),
            status: formData.get('status')
        };

        if (editingPromo) {
            // Update campaign
            await fetch(`http://localhost:5000/api/campaigns/${editingPromo._id || editingPromo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formProps)
            });
        } else {
            // Create new campaign
            await fetch('http://localhost:5000/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formProps, used: 0, revenue: 0 })
            });
        }
        // Refresh campaign list
        fetch('http://localhost:5000/api/campaigns')
            .then(res => res.json())
            .then(result => setPromos(result.data));
        setShowModal(false);
    };

    return (
        <div className="w-full h-full p-[30px] animate-fadeIn overflow-y-auto relative bg-bg">
            <div className="text-lg font-bold mb-[20px] text-accent border-b border-white/10 pb-2 flex justify-between items-center">
                <span>🎁 Marketing & Khuyến mãi</span>
                <button onClick={handleCreate} className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:brightness-110 shadow-lg shadow-accent/20 font-bold">
                    + Tạo Campaign
                </button>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-3 gap-5 mb-8">
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">Đang chạy</div>
                    <div className="text-3xl font-extrabold text-white">{stats.totalRunning} <span className="text-sm font-normal text-text-dim">chương trình</span></div>
                    <div className="absolute right-4 top-4 text-4xl opacity-10">🔥</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">Lượt sử dụng</div>
                    <div className="text-3xl font-extrabold text-accent">{stats.totalUsed.toLocaleString()} <span className="text-sm font-normal text-text-dim">lượt</span></div>
                    <div className="absolute right-4 top-4 text-4xl opacity-10">🎫</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">Doanh thu mang lại</div>
                    <div className="text-3xl font-extrabold text-success">+{stats.totalRevenue.toLocaleString()}đ</div>
                    <div className="absolute right-4 top-4 text-4xl opacity-10">💰</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
                {['all', 'running', 'upcoming', 'expired'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-accent' : 'text-text-dim hover:text-white'}`}>
                        {tab === 'all' && 'Tất cả'}
                        {tab === 'running' && 'Đang chạy'}
                        {tab === 'upcoming' && 'Sắp tới'}
                        {tab === 'expired' && 'Đã kết thúc'}
                        {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-accent rounded-t-full"></span>}
                    </button>
                ))}
            </div>

            {/* Grid Vouchers */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                {filteredPromos.map((p) => (
                    <div key={p._id || p.id} className={`relative bg-surface rounded-2xl border border-white/5 overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${p.status === 'expired' ? 'opacity-60 grayscale' : ''}`}>
                        {/* 1. Header Card */}
                        <div className={`h-[100px] bg-gradient-to-r ${p.color} p-5 relative`}>
                            <div className="flex justify-between items-start">
                                <span className="bg-black/20 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">
                                    {p.status === 'running' ? '● ĐANG CHẠY' : p.status === 'upcoming' ? '⏱ SẮP TỚI' : '⏹ ĐÃ KẾT THÚC'}
                                </span>
                                <div className="text-white text-3xl opacity-20 font-black tracking-tighter">
                                    {Math.round((p.used / p.limit) * 100)}%
                                </div>
                            </div>
                            <h3 className="text-white font-black text-xl mt-1 shadow-sm truncate">{p.title}</h3>
                            {/* Hiển thị cảnh báo nếu có */}
                            {p.warning && (
                                <div className="mt-2 text-xs font-bold text-warning bg-yellow-100/10 border border-yellow-400/30 rounded px-2 py-1 inline-block animate-pulse">
                                    ⚠️ {p.warning}
                                </div>
                            )}
                            {/* Răng cưa */}
                            <div className="absolute bottom-[-6px] left-0 w-full h-[12px] bg-surface" style={{clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'}}></div>
                        </div>

                        {/* 2. Body Card */}
                        <div className="p-5 pt-6 relative">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-text font-bold text-sm truncate">{p.desc}</span>
                            </div>
                            
                            <div className="bg-bg p-3 rounded-lg border border-white/5 mb-4 flex justify-between items-center group/code">
                                <div>
                                    <div className="text-[10px] text-text-dim">MÃ KHUYẾN MÃI</div>
                                    <div className="font-mono text-accent font-bold tracking-widest">{p.code}</div>
                                </div>
                                <button 
                                    onClick={() => handleCopy(p.code, p._id || p.id)} 
                                    className={`text-xs px-3 py-1 rounded font-bold transition-all ${copiedId === (p._id || p.id) ? 'bg-success text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                >
                                    {copiedId === (p._id || p.id) ? 'Đã Copy!' : 'Copy'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-text-dim">Tiến độ</span>
                                        <span className="text-white font-bold">{p.used}/{p.limit}</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${p.color}`} style={{width: `${(p.used/p.limit)*100}%`}}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs pt-3 border-t border-white/5">
                                    <span className="text-text-dim">🕒 {p.time}</span>
                                    <span className="text-success font-bold">+{p.revenue.toLocaleString()}đ</span>
                                </div>
                            </div>

                            {/* 👇👇👇 3. OVERLAY THAO TÁC (ĐÃ THÊM LẠI) 👇👇👇 */}
                            <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => handleEdit(p)} className="w-[120px] py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 shadow-lg transform hover:scale-105 transition-all">
                                    ✏️ Chỉnh sửa
                                </button>
                                {p.status === 'running' && (
                                    <button onClick={() => handleStop(p._id || p.id)} className="w-[120px] py-2 bg-warning text-black font-bold rounded-lg hover:bg-yellow-400 shadow-lg transform hover:scale-105 transition-all">
                                        ⏸ Tạm dừng
                                    </button>
                                )}
                                <button onClick={() => handleDelete(p._id || p.id)} className="w-[120px] py-2 bg-danger text-white font-bold rounded-lg hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all">
                                    🗑️ Xóa bỏ
                                </button>
                            </div>
                            {/* 👆👆👆 -------------------------------------- 👆👆👆 */}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL FORM --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl w-[500px] shadow-2xl">
                        <h3 className="text-xl font-bold text-accent mb-6 border-b border-white/10 pb-3">
                            {editingPromo ? '✏️ Cập nhật Campaign' : '🎁 Thiết lập Campaign Mới'}
                        </h3>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Mã Code</label>
                                    <input name="code" defaultValue={editingPromo?.code} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none font-mono font-bold uppercase" placeholder="VD: TET2025" />
                                </div>
                                <div>
                                    <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Giới hạn số lượng</label>
                                    <input name="limit" type="number" defaultValue={editingPromo?.limit || 100} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none font-bold" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Tên chương trình</label>
                                <input name="title" defaultValue={editingPromo?.title} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none" placeholder="VD: Khai xuân như ý..." />
                            </div>
                            
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Mô tả ưu đãi</label>
                                <input name="desc" defaultValue={editingPromo?.desc} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none" placeholder="VD: Giảm 50%..." />
                            </div>

                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Thời gian áp dụng</label>
                                <input name="time" defaultValue={editingPromo?.time} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none" placeholder="VD: 7h - 9h sáng" />
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Trạng thái</label>
                                <select name="status" defaultValue={editingPromo?.status || 'upcoming'} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none">
                                    <option value="running">Đang chạy</option>
                                    <option value="upcoming">Sắp tới</option>
                                    <option value="expired">Đã kết thúc</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-text-dim block mb-2 uppercase font-bold">Màu sắc thẻ Voucher</label>
                                <div className="flex gap-3 justify-between">
                                    {[
                                        {val: 'from-orange-500 to-red-500', label: 'Cam Đỏ'},
                                        {val: 'from-blue-400 to-indigo-600', label: 'Xanh Dương'},
                                        {val: 'from-emerald-400 to-teal-600', label: 'Xanh Lá'},
                                        {val: 'from-purple-500 to-pink-500', label: 'Tím Hồng'},
                                    ].map((c, i) => (
                                        <label key={i} className="cursor-pointer flex flex-col items-center gap-1">
                                            <input type="radio" name="color" value={c.val} defaultChecked={editingPromo ? editingPromo.color === c.val : i===0} className="accent-accent w-4 h-4"/>
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.val} border-2 border-transparent hover:border-white`}></div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors">Hủy bỏ</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-accent text-white hover:brightness-110 font-bold shadow-lg shadow-accent/20">
                                    {editingPromo ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketing;