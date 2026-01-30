import React, { useState, useMemo } from 'react';
import CategoryPieChart from './CategoryPieChart';

const Finance = () => {

    // ...existing code...

    // --- DỮ LIỆU GIAO DỊCH TỪ BACKEND ---
    const [transactions, setTransactions] = useState([]);
    // Gợi ý tìm kiếm
    const suggestions = React.useMemo(() => {
        const cats = Array.from(new Set(transactions.map(t => t.category)));
        const descs = Array.from(new Set(transactions.map(t => t.desc)));
        return [...cats, ...descs].filter(Boolean);
    }, [transactions]);
    const [showSuggest, setShowSuggest] = useState(false);
    // --- STATE CHỌN NGÀY/THÁNG/NĂM ---
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
    // Tạo mảng các năm từ 2022 đến năm hiện tại
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2022; y--) years.push(y);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Fetch giao dịch từ backend theo tháng/năm
    const fetchTransactions = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/transactions?month=${selectedMonth}&year=${selectedYear}`);
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            setTransactions([]);
        }
    };

    React.useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line
    }, [selectedMonth, selectedYear]);

    // --- STATES ---
    const [filterType, setFilterType] = useState('all'); // all, income, expense
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('income'); // income (Thu) hoặc expense (Chi)
    const [editingTrans, setEditingTrans] = useState(null); // Giao dịch đang sửa

    // --- TÍNH TOÁN THỐNG KÊ (Real-time) ---
    const stats = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return {
            income,
            expense,
            profit: income - expense
        };
    }, [transactions]);

    // Tổng hợp dữ liệu cho PieChart Thu/Chi
    const pieSummary = useMemo(() => ({
        'Thu': stats.income,
        'Chi': stats.expense
    }), [stats]);

    // --- LỌC DỮ LIỆU THEO NGÀY/THÁNG/NĂM (nếu chọn ngày) ---
    // Reset về trang 1 khi filter thay đổi
    const [currentPage, setCurrentPage] = useState(1);
    React.useEffect(() => { setCurrentPage(1); }, [selectedDay, selectedMonth, selectedYear, filterType, searchTerm]);
    const filteredTransactions = transactions.filter(t => {
        const matchType = filterType === 'all' || t.type === filterType;
        const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const [day, month, year] = t.date.split('/').map(Number);
        const matchMonth = month === selectedMonth && year === selectedYear;
        // Nếu chọn ngày cụ thể thì lọc đúng ngày, nếu không thì chỉ lọc theo tháng/năm
        const matchDay = selectedDay ? day === selectedDay : true;
        return matchType && matchSearch && matchMonth && matchDay;
    });
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
    const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // --- XỬ LÝ FORM ---
    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const day = selectedDay;
        const dateStr = `${day}/${selectedMonth}/${selectedYear}`;
        const amount = Number(formData.get('amount'));
        if (amount <= 0) {
            alert("Số tiền phải lớn hơn 0!");
            return;
        }
        if (editingTrans) {
            // Sửa giao dịch
            const updatedTrans = {
                ...editingTrans,
                date: dateStr,
                type: modalType,
                amount,
                category: formData.get('category'),
                desc: formData.get('desc'),
                method: formData.get('method') || 'Tiền mặt',
            };
            fetch(`http://localhost:5000/api/transactions/${editingTrans._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTrans)
            })
            .then(res => res.json())
            .then(() => {
                setShowModal(false);
                setEditingTrans(null);
                alert("Đã cập nhật phiếu thành công!");
                fetchTransactions();
            })
            .catch(() => alert("Lỗi khi cập nhật phiếu!"));
        } else {
            // Thêm mới
            const newTrans = {
                id: `GD${Math.floor(Math.random() * 1000)}`,
                date: dateStr,
                type: modalType,
                amount,
                category: formData.get('category'),
                desc: formData.get('desc'),
                method: formData.get('method') || 'Tiền mặt',
                staff: 'Admin'
            };
            fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTrans)
            })
            .then(res => res.json())
            .then(() => {
                setShowModal(false);
                alert("Đã tạo phiếu thành công!");
                fetchTransactions();
            })
            .catch(() => alert("Lỗi khi lưu phiếu!"));
        }
    };

    // Xử lý xóa giao dịch
    const handleDelete = (trans) => {
        if (window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
            fetch(`http://localhost:5000/api/transactions/${trans._id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(() => {
                fetchTransactions();
            })
            .catch(() => alert('Lỗi khi xóa!'));
        }
    };

    // Xử lý mở modal sửa
    const handleEdit = (trans) => {
        setEditingTrans(trans);
        setModalType(trans.type);
        setShowModal(true);
    };

    return (
        <div className="w-full h-full p-[30px] animate-fadeIn overflow-y-auto relative">
            <div className="text-lg font-bold mb-[15px] text-accent border-b border-white/10 pb-2">Quản lý Thu – Chi</div>


            {/* --- DASHBOARD CARDS + Pie Chart (bố cục mới) --- */}
            <div className="grid grid-cols-4 gap-5 mb-8 items-center">
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden group col-span-1">
                    <div className="text-text-dim text-sm font-medium mb-2">Tổng Thu (Tháng)</div>
                    <div className="text-2xl font-extrabold text-success">+ {stats.income.toLocaleString()}đ</div>
                    <div className="absolute right-[-10px] top-[-10px] text-[80px] opacity-5 text-success">↓</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden group col-span-1">
                    <div className="text-text-dim text-sm font-medium mb-2">Tổng Chi (Tháng)</div>
                    <div className="text-2xl font-extrabold text-danger">- {stats.expense.toLocaleString()}đ</div>
                    <div className="absolute right-[-10px] top-[-10px] text-[80px] opacity-5 text-danger">↑</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden group col-span-1">
                    <div className="text-text-dim text-sm font-medium mb-2">Lợi nhuận ròng</div>
                    <div className={`text-2xl font-extrabold ${stats.profit >= 0 ? 'text-accent' : 'text-danger'}`}>
                        {stats.profit >= 0 ? '+' : ''} {stats.profit.toLocaleString()}đ
                    </div>
                    <div className="absolute right-[-10px] top-[-10px] text-[80px] opacity-5 text-accent">$</div>
                </div>
                {/* Pie Chart tổng Thu/Chi nằm bên phải */}
                <div className="flex justify-center items-center h-full">
                    <CategoryPieChart summary={pieSummary} />
                </div>
            </div>

            {/* --- TOOLBAR --- */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-[15px] mb-5 bg-surface p-[15px] rounded-[15px]">
                <div className="relative">
                    <input 
                        type="text" placeholder="🔍 Tìm theo nội dung, danh mục..." 
                        className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none focus:border-accent w-full"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setShowSuggest(true); }}
                        onFocus={() => setShowSuggest(true)}
                        onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                        autoComplete="off"
                    />
                    {showSuggest && searchTerm && (
                        <div className="absolute left-0 right-0 top-full bg-bg border border-[#333] rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
                            {suggestions.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                <div className="p-2 text-text-dim">Không có gợi ý</div>
                            )}
                            {suggestions.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())).map((s, i) => (
                                <div
                                    key={i}
                                    className="p-2 hover:bg-accent/20 cursor-pointer text-white"
                                    onMouseDown={() => { setSearchTerm(s); setShowSuggest(false); }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <select className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none" onChange={e => setFilterType(e.target.value)}>
                    <option value="all">Tất cả giao dịch</option>
                    <option value="income">Chỉ khoản Thu (+)</option>
                    <option value="expense">Chỉ khoản Chi (-)</option>
                </select>
                <div className="flex gap-2">
                    <select
                        className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none"
                        value={selectedDay}
                        onChange={e => setSelectedDay(Number(e.target.value))}
                    >
                        <option value="">Tất cả ngày</option>
                        {[...Array(31)].map((_, i) => (
                            <option key={i+1} value={i+1}>{`Ngày ${i+1}`}</option>
                        ))}
                    </select>
                    <select
                        className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i+1} value={i+1}>{`Tháng ${i+1}`}</option>
                        ))}
                    </select>
                    <select
                        className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none"
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => { setModalType('expense'); setShowModal(true); }}
                        className="bg-danger/10 border border-danger/50 text-danger font-bold px-4 rounded-lg hover:bg-danger hover:text-white transition-all"
                    >
                        - Phiếu Chi
                    </button>
                    <button 
                        onClick={() => { setModalType('income'); setShowModal(true); }}
                        className="bg-success/10 border border-success/50 text-success font-bold px-4 rounded-lg hover:bg-success hover:text-white transition-all"
                    >
                        + Phiếu Thu
                    </button>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr>
                            {["Mã GD", "Thời gian", "Loại", "Số tiền", "Danh mục", "Nội dung", "Phương thức", "Người tạo", "Thao tác"].map(h => (
                                <th key={h} className="text-left p-[15px] text-text-dim text-[13px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.map((t) => (
                            <tr key={t._id || t.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-[15px] bg-surface first:rounded-l-xl font-mono text-text-dim">{t.id}</td>
                                <td className="p-[15px] bg-surface text-sm">{t.date}</td>
                                <td className="p-[15px] bg-surface">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                        {t.type === 'income' ? 'Phiếu Thu' : 'Phiếu Chi'}
                                    </span>
                                </td>
                                <td className={`p-[15px] bg-surface font-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}đ
                                </td>
                                <td className="p-[15px] bg-surface"><span className="bg-white/5 px-2 py-1 rounded text-xs">{t.category}</span></td>
                                <td className="p-[15px] bg-surface text-sm max-w-[200px] truncate" title={t.desc}>{t.desc}</td>
                                <td className="p-[15px] bg-surface text-xs font-bold text-text-dim">{t.method || 'Tiền mặt'}</td>
                                <td className="p-[15px] bg-surface text-text-dim text-sm">{t.staff}</td>
                                <td className="p-[15px] bg-surface last:rounded-r-xl flex gap-2">
                                    <button className="text-text-dim hover:text-accent" title="Sửa" onClick={() => handleEdit(t)}>✏️</button>
                                    <button className="text-text-dim hover:text-danger" title="Xóa" onClick={() => handleDelete(t)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                        {/* --- PHÂN TRANG --- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    className="px-3 py-1 rounded bg-bg border border-[#444] text-white disabled:opacity-50"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i+1}
                                        className={`px-3 py-1 rounded ${currentPage === i+1 ? 'bg-accent text-white' : 'bg-bg border border-[#444] text-white'}`}
                                        onClick={() => setCurrentPage(i+1)}
                                    >
                                        {i+1}
                                    </button>
                                ))}
                                <button
                                    className="px-3 py-1 rounded bg-bg border border-[#444] text-white disabled:opacity-50"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
            </div>

            {/* --- MODAL TẠO PHIẾU --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl w-[500px] shadow-2xl">
                        <h3 className={`text-xl font-bold mb-6 border-b border-white/10 pb-3 ${modalType === 'income' ? 'text-success' : 'text-danger'}`}>
                            {editingTrans ? (modalType === 'income' ? '✏️ Sửa Phiếu Thu' : '✏️ Sửa Phiếu Chi') : (modalType === 'income' ? '📥 Tạo Phiếu Thu Mới' : '📤 Tạo Phiếu Chi Mới')}
                        </h3>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <div>
                                    <label className="text-sm text-text-dim block mb-1">Ngày</label>
                                    <select name="day" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))}>
                                        {[...Array(31)].map((_, i) => (
                                            <option key={i+1} value={i+1}>{i+1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm text-text-dim block mb-1">Số tiền (VNĐ)</label>
                                    <input type="number" name="amount" required autoFocus className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white text-lg font-bold focus:border-accent outline-none" placeholder="0" defaultValue={editingTrans?.amount || ''} />
                                </div>
                                <div>
                                    <label className="text-sm text-text-dim block mb-1">Trạng thái</label>
                                    <select name="status" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" defaultValue={editingTrans?.status || 'Chờ duyệt'}>
                                        <option value="Chờ duyệt">Chờ duyệt</option>
                                        <option value="Đã thanh toán">Đã thanh toán</option>
                                        <option value="Hủy">Hủy</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Danh mục</label>
                                <select name="category" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" defaultValue={editingTrans?.category || ''}>
                                    {modalType === 'income' ? (
                                        <>
                                            <option>Bán hàng</option>
                                            <option>Thu nợ</option>
                                            <option>Khác</option>
                                        </>
                                    ) : (
                                        <>
                                            <option>Nguyên liệu</option>
                                            <option>Điện nước / Internet</option>
                                            <option>Lương nhân viên</option>
                                            <option>Sửa chữa & Bảo trì</option>
                                            <option>Marketing</option>
                                            <option>Mặt bằng</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Nội dung / Ghi chú</label>
                                <textarea name="desc" required rows="3" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none" placeholder="Nhập lý do chi/thu..." defaultValue={editingTrans?.desc || ''}></textarea>
                            </div>
                            <div>
                                <label className="text-sm text-text-dim block mb-1">Phương thức thanh toán</label>
                                <select name="method" className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" defaultValue={editingTrans?.method || 'Tiền mặt'}>
                                    <option value="Tiền mặt">Tiền mặt</option>
                                    <option value="Chuyển khoản">Chuyển khoản (QR)</option>
                                    <option value="Ví điện tử">Ví điện tử</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => { setShowModal(false); setEditingTrans(null); }} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors">HỦY BỎ</button>
                                <button type="submit" className={`flex-1 py-3 rounded-xl text-white hover:brightness-110 font-bold shadow-lg ${modalType === 'income' ? 'bg-success' : 'bg-danger'}`}>
                                    {editingTrans ? 'LƯU SỬA' : 'LƯU PHIẾU'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;