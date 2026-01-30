import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const Inventory = () => {
    // const { inventory } = useCart(); // Lấy dữ liệu từ Context
    const [inventory, setInventory] = useState([]);
        // Hàm load danh sách kho từ backend
        const fetchInventory = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/materials');
                if (res.ok) {
                    const data = await res.json();
                    setInventory(data);
                }
            } catch (err) {
                // Có thể xử lý lỗi ở đây
            }
        };

        useEffect(() => {
            fetchInventory();
        }, []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // --- STATE QUẢN LÝ MODAL ---
    const [showModal, setShowModal] = useState(false); // Modal Thêm/Sửa
    const [editingItem, setEditingItem] = useState(null);
    
    const [showHistoryModal, setShowHistoryModal] = useState(false); // Modal Thẻ kho
    const [selectedHistory, setSelectedHistory] = useState({ name: '', logs: [] });

    // --- MOCK DATA: THẺ KHO (LỊCH SỬ NHẬP XUẤT) ---
    const MOCK_LOGS = [
        { date: '25/12/2024 08:30', type: 'import', qty: 50, note: 'Nhập hàng định kỳ', staff: 'Lan Anh' },
        { date: '24/12/2024 14:20', type: 'export', qty: -5, note: 'Bán hàng (POS)', staff: 'Hệ thống' },
        { date: '24/12/2024 09:15', type: 'export', qty: -2, note: 'Hủy hàng hỏng', staff: 'Minh Tâm' },
        { date: '23/12/2024 10:00', type: 'import', qty: 20, note: 'Nhập bổ sung', staff: 'Lan Anh' },
    ];

    // Filter Logic
    const filtered = inventory.filter(i => {
        const matchSearch = i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = filterCat === '' || i.group === filterCat;
        const matchStatus = filterStatus === '' || (filterStatus === 'Low' ? i.quantity <= i.min : i.quantity > i.min);
        return matchSearch && matchCat && matchStatus;
    });

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // --- HANDLERS ---
    const handleAdd = () => { setEditingItem(null); setShowModal(true); };
    const handleEdit = (item) => { setEditingItem(item); setShowModal(true); };
    
    const handleDelete = async (item) => {
        if (window.confirm(`Xác nhận xóa nguyên liệu: ${item.name}?`)) {
            try {
                const res = await fetch(`http://localhost:5000/api/materials/${item._id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    alert('Đã xóa!');
                    fetchInventory();
                } else {
                    alert('Lỗi xóa!');
                }
            } catch (err) {
                alert('Lỗi kết nối backend!');
            }
        }
    };

    const handleViewHistory = (item) => {
        // Random log để demo
        const logs = Math.random() > 0.5 ? MOCK_LOGS : MOCK_LOGS.slice(0, 3);
        setSelectedHistory({ name: item.name, logs: logs });
        setShowHistoryModal(true);
    };

    const [error, setError] = useState("");
    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        const form = e.target;
        const materialData = {
            code: form[1].value,
            name: form[0].value,
            group: form[2].value,
            quantity: form[3].value,
            min: form[4].value,
            cost: form[5].value,
            expiry: form[6].value,
            status: form.elements["status"].value,
        };
        try {
            let res;
            if (editingItem && editingItem._id) {
                // Chỉnh sửa: gọi PUT
                res = await fetch(`http://localhost:5000/api/materials/${editingItem._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(materialData)
                });
            } else {
                // Thêm mới: gọi POST
                res = await fetch('http://localhost:5000/api/materials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(materialData)
                });
            }
            if (res.ok) {
                alert('Đã lưu thông tin kho!');
                setShowModal(false);
                fetchInventory();
            } else {
                const errData = await res.json();
                setError(errData.error || 'Lỗi lưu kho!');
            }
        } catch (err) {
            setError('Lỗi kết nối backend!');
        }
    };

    return (
        <div className="w-full h-full p-[30px] animate-fadeIn overflow-y-auto relative">
            <div className="text-lg font-bold mb-[15px] text-accent border-b border-white/10 pb-2">
                📦 Quản lý Kho nguyên liệu
            </div>
            
            {/* Filter Bar */}
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-[15px] mb-5 bg-surface p-[15px] rounded-[15px]">
                <input 
                    type="text" placeholder="🔍 Tìm theo tên hoặc mã NL..." 
                    className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none focus:border-accent"
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
                />
                <select className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none" onChange={e => setFilterCat(e.target.value)}>
                    <option value="">Tất cả Nhóm</option>
                    <option value="Cafe">Cà phê</option>
                    <option value="Sữa">Sữa</option>
                    <option value="Trà">Trà</option>
                    <option value="Vật dụng">Vật dụng</option>
                </select>
                <select className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none" onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả Trạng thái</option>
                    <option value="Good">Tốt</option>
                    <option value="Low">Sắp hết hạn </option>
                </select>
                <button onClick={handleAdd} className="bg-accent text-white font-bold px-5 rounded-lg hover:brightness-110 shadow-lg shadow-accent/20">
                    + Nhập kho
                </button>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr>
                            {["Mã NL", "Tên mặt hàng", "Nhóm", "Tồn / Min", "Giá vốn", "HSD", "Trạng thái", "Thao tác"].map(h => (
                                <th key={h} className="text-left p-[15px] text-text-dim text-[13px] whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((i, idx) => (
                            <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                <td className="p-[15px] bg-surface first:rounded-l-xl text-accent font-bold">{i.code}</td>
                                <td className="p-[15px] bg-surface font-bold text-white">{i.name}</td>
                                <td className="p-[15px] bg-surface"><span className="bg-accent/10 text-accent px-2 py-1 rounded-md text-[11px] border border-accent/20">{i.group}</span></td>
                                <td className="p-[15px] bg-surface">
                                    <span className={i.quantity <= i.min ? 'text-danger font-bold' : 'text-white'}>{i.quantity}</span> {i.unit}
                                    <small className="block text-text-dim text-[11px]">Min: {i.min}</small>
                                </td>
                                <td className="p-[15px] bg-surface">{i.cost?.toLocaleString()}đ</td>
                                <td className="p-[15px] bg-surface text-sm text-text-dim">{i.expiry}</td>
                                <td className={`p-[15px] bg-surface font-bold text-sm ${i.status === 'Sắp hết hạn' ? 'text-danger' : 'text-success'}`}>
                                    {i.status === 'Sắp hết hạn' ? '⚠️ Sắp hết hạn' : '● Tốt'}
                                </td>
                                <td className="p-[15px] bg-surface last:rounded-r-xl">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(i)} className="p-2 rounded bg-white/5 hover:bg-accent/20 hover:text-accent transition-colors" title="Sửa">✏️</button>
                                        <button onClick={() => handleViewHistory(i)} className="p-2 rounded bg-white/5 hover:bg-warning/20 hover:text-warning transition-colors" title="Thẻ kho (Lịch sử)">📜</button>
                                        <button onClick={() => handleDelete(i)} className="p-2 rounded bg-white/5 hover:bg-danger/20 hover:text-danger transition-colors" title="Xóa">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
            <div className="flex justify-center items-center gap-3 mt-8 pb-10">
                <button 
                    className="px-4 py-2 bg-surface rounded-lg text-text-dim hover:text-white border border-[#333]"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >Trang trước</button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`w-10 h-10 rounded-lg font-bold border ${currentPage === i + 1 ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface text-text-dim hover:text-white border-[#333]'}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >{i + 1}</button>
                ))}
                <button 
                    className="px-4 py-2 bg-surface rounded-lg text-text-dim hover:text-white border border-[#333]"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >Trang sau</button>
            </div>

            {/* --- MODAL 1: THÊM / SỬA --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl w-[600px] shadow-2xl">
                        <h3 className="text-xl font-bold text-accent mb-6 border-b border-white/10 pb-3">
                            {editingItem ? '✏️ Điều chỉnh kho' : '📦 Nhập nguyên liệu mới'}
                        </h3>
                        {error && <div className="col-span-2 text-center text-red-500 font-semibold mb-2">{error}</div>}
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-sm text-text-dim block mb-1">Tên nguyên liệu</label>
                                <input defaultValue={editingItem?.name} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Mã NL</label>
                                <input defaultValue={editingItem?.code} placeholder="NL-..." className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Nhóm hàng</label>
                                <select defaultValue={editingItem?.group || "Cafe"} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none">
                                    <option value="Cafe">Cà phê</option>
                                    <option value="Sữa">Sữa</option>
                                    <option value="Trà">Trà</option>
                                    <option value="Vật dụng">Vật dụng</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Số lượng tồn</label>
                                <input type="number" defaultValue={editingItem?.quantity} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Mức tối thiểu (Cảnh báo)</label>
                                <input type="number" defaultValue={editingItem?.min} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Giá vốn (VNĐ)</label>
                                <input type="number" defaultValue={editingItem?.cost} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Hạn sử dụng</label>
                                <input type="date" defaultValue={editingItem?.expiry} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Trạng thái</label>
                                <select name="status" defaultValue={editingItem?.status || "Tốt"} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none">
                                    <option value="Tốt">Tốt</option>
                                    <option value="Sắp hết hạn">Sắp hết hạn</option>
                                </select>
                            </div>
                            
                            <div className="col-span-2 flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors">HỦY</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-accent text-white hover:brightness-110 font-bold">LƯU LẠI</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: THẺ KHO (LỊCH SỬ) --- */}
            {showHistoryModal && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-center backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface border border-white/10 p-0 rounded-2xl w-[700px] shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-accent">📜 Thẻ kho: {selectedHistory.name}</h3>
                            <button onClick={() => setShowHistoryModal(false)} className="text-text-dim hover:text-white text-2xl">&times;</button>
                        </div>
                        <div className="p-5 max-h-[400px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-text-dim border-b border-white/10">
                                        <th className="text-left pb-3">Thời gian</th>
                                        <th className="text-left pb-3">Loại GD</th>
                                        <th className="text-right pb-3">Số lượng</th>
                                        <th className="text-left pl-5 pb-3">Ghi chú</th>
                                        <th className="text-right pb-3">Người thực hiện</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedHistory.logs.map((log, idx) => (
                                        <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                                            <td className="py-4 text-text-dim">{log.date}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${log.type === 'import' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                                                    {log.type === 'import' ? 'Nhập kho' : 'Xuất kho'}
                                                </span>
                                            </td>
                                            <td className={`py-4 text-right font-bold ${log.qty > 0 ? 'text-success' : 'text-danger'}`}>
                                                {log.qty > 0 ? `+${log.qty}` : log.qty}
                                            </td>
                                            <td className="py-4 pl-5">{log.note}</td>
                                            <td className="py-4 text-right text-text-dim">{log.staff}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-bg/50 text-right">
                            <button onClick={() => setShowHistoryModal(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-sm">ĐÓNG</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;