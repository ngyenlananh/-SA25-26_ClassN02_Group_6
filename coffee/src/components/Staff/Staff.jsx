// ...existing code...
import React, { useState, useMemo, useEffect } from 'react';

const Staff = () => {
    // Kiểm tra quyền admin (phải đặt ở đầu hàm component)
    const isAdmin = typeof window !== 'undefined' && localStorage.getItem('user') === 'admin';
    // --- STAFF DATA FROM API ---
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");

    // Fetch staff list from backend
    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            setApiError("");
            try {
                const res = await fetch("/api/staff");
                if (!res.ok) throw new Error("Lỗi khi lấy danh sách nhân viên");
                const data = await res.json();
                setStaffList(data);
            } catch (err) {
                setApiError(err.message || "Lỗi không xác định");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    // Dữ liệu giả lập chấm công
    const MOCK_ATTENDANCE = [
        { date: '25/12/2024', in: '06:55', out: '15:05', total: '8h 10p', status: 'Đúng giờ' },
        { date: '24/12/2024', in: '07:05', out: '15:00', total: '7h 55p', status: 'Đi muộn' },
        { date: '23/12/2024', in: '06:50', out: '15:10', total: '8h 20p', status: 'Đúng giờ' },
    ];

    // --- STATE ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [showAttendance, setShowAttendance] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    // --- STATS ---
    const stats = useMemo(() => {
        return {
            total: staffList.length,
            online: staffList.filter(s => s.status === 'online').length,
            totalSalary: staffList.reduce((sum, s) => sum + s.salary, 0)
        };
    }, [staffList]);

    // --- HANDLERS ---
    const handleAdd = () => { setEditingStaff(null); setShowModal(true); };
    const handleEdit = (staff) => { setEditingStaff(staff); setShowModal(true); };

    // --- FILTERED STAFF ---
    const filteredStaff = useMemo(() => {
        return staffList.filter(s => {
            const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchRole = filterRole ? s.role === filterRole : true;
            const matchStatus = filterStatus ? s.status === filterStatus : true;
            return matchName && matchRole && matchStatus;
        });
    }, [staffList, searchTerm, filterRole, filterStatus]);
    const handleViewAttendance = (staff) => {
        setSelectedStaff(staff);
        setShowAttendance(true);
    };
    const [errorMsg, setErrorMsg] = useState("");
    // Thêm/sửa nhân viên qua API
    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        const formData = new FormData(e.target);
        const staffData = {
            code: formData.get('code'),
            name: formData.get('name'),
            role: formData.get('role'),
            phone: formData.get('phone'),
            shift: formData.get('shift'),
            salary: Number(formData.get('salary')),
            status: formData.get('status'),
            workDays: editingStaff ? editingStaff.workDays : 0
        };
        try {
            let res;
            if (editingStaff) {
                // Update
                res = await fetch(`/api/staff/${editingStaff._id}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(staffData)
                });
            } else {
                // Create
                res = await fetch("/api/staff", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(staffData)
                });
            }
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Lỗi khi lưu nhân viên");
            }
            // Reload staff list
            const refreshed = await fetch("/api/staff");
            setStaffList(await refreshed.json());
            setShowModal(false);
        } catch (err) {
            setErrorMsg(err.message || "Lỗi không xác định");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
        try {
            const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Lỗi khi xóa nhân viên");
            }
            // Reload staff list
            const refreshed = await fetch("/api/staff");
            setStaffList(await refreshed.json());
        } catch (err) {
            alert(err.message || "Lỗi không xác định");
        }
    };



    return (
        <div className="w-full h-full p-[30px] animate-fadeIn overflow-y-auto relative bg-bg">
            <div className="text-lg font-bold mb-[20px] text-accent border-b border-white/10 pb-2 flex justify-between items-center">
                <span>👔 Quản lý Nhân sự</span>
                                <button onClick={handleAdd} className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:brightness-110 shadow-lg shadow-accent/20 font-bold">
                                        + Thêm nhân viên
                                </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-3 gap-5 mb-8">
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">Tổng nhân sự</div>
                    <div className="text-3xl font-extrabold text-white">{stats.total} <span className="text-sm font-normal text-text-dim">người</span></div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">Đang trong ca</div>
                    <div className="text-3xl font-extrabold text-success">{stats.online} <span className="text-sm font-normal text-text-dim">/ {stats.total}</span></div>
                    <div className="absolute right-4 top-4 text-4xl opacity-10 animate-pulse">🟢</div>
                </div>
                <div className="bg-surface p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">Quỹ lương dự kiến</div>
                    <div className="text-3xl font-extrabold text-warning">{stats.totalSalary.toLocaleString()}đ</div>
                </div>
            </div>

            {/* Filter Bar (Mới bổ sung) */}
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-[15px] mb-6 bg-surface p-[15px] rounded-[15px]">
                <input 
                    type="text" placeholder="🔍 Tìm nhân viên theo tên, SĐT..." 
                    className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none focus:border-accent"
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
                <select className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none" onChange={e => setFilterRole(e.target.value)}>
                    <option value="">Tất cả Chức vụ</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Pha chế">Pha chế</option>
                    <option value="Thu ngân">Thu ngân</option>
                    <option value="Kế toán">Kế toán</option>
                    <option value="Phục vụ">Phục vụ</option>
                    <option value="Trưởng ca">Trưởng ca</option>
                    <option value="Tạp vụ">Tạp vụ</option>
                    <option value="Bảo vệ">Bảo vệ</option>
                </select>
                <select className="bg-bg border border-[#333] text-white p-3 rounded-lg outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả Trạng thái</option>
                    <option value="online">Đang làm</option>
                    <option value="offline">Đã về</option>
                </select>
                <div className="w-[50px]"></div> {/* Spacer */}
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto">            <div>
              <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Trạng thái</label>
              <select name="status" defaultValue={editingStaff?.status || "offline"} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none">
                <option value="online">Đang làm</option>
                <option value="offline">Đã về</option>
              </select>
            </div>                                 
                <table className="w-full border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr>
                            {["Mã NV", "Họ tên", "Chức vụ", "Liên hệ", "Ca làm việc", "Trạng thái", "Thao tác"].map(h => (
                                <th key={h} className="text-left p-[15px] text-text-dim text-[13px] uppercase font-bold">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center text-text-dim py-8">Đang tải dữ liệu...</td></tr>
                        ) : apiError ? (
                            <tr><td colSpan={7} className="text-center text-danger py-8">{apiError}</td></tr>
                        ) : filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-text-dim py-8">Không tìm thấy nhân viên nào.</td>
                            </tr>
                        ) : (
                            filteredStaff.map((s) => (
                                <tr key={s._id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-[15px] bg-surface first:rounded-l-xl font-mono text-accent font-bold">{s.code}</td>
                                    <td className="p-[15px] bg-surface">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold border border-white/10 text-white">
                                                {s.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-white">{s.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-[15px] bg-surface">
                                        <span className="bg-white/5 px-2 py-1 rounded text-xs text-text-dim border border-white/5">{s.role}</span>
                                    </td>
                                    <td className="p-[15px] bg-surface text-sm">{s.phone}</td>
                                    <td className="p-[15px] bg-surface text-sm text-text-dim">{s.shift}</td>
                                    <td className="p-[15px] bg-surface">
                                        {s.status === 'online' ? (
                                            <span className="flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-2 py-1 rounded border border-success/20">
                                                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Đang làm
                                            </span>
                                        ) : (
                                            <span className="text-text-dim text-xs font-bold bg-white/5 px-2 py-1 rounded border border-white/5">● Đã về</span>
                                        )}
                                    </td>
                                    <td className="p-[15px] bg-surface last:rounded-r-xl">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(s)} className="p-2 rounded bg-white/5 hover:bg-accent/20 hover:text-accent transition-colors" title="Sửa thông tin">✏️</button>
                                            <button onClick={() => handleViewAttendance(s)} className="p-2 rounded bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-colors" title="Xem chấm công">🕒</button>
                                            <button onClick={() => handleDelete(s._id)} className="p-2 rounded bg-white/5 hover:bg-danger/20 hover:text-danger transition-colors" title="Xóa nhân viên">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL 1: THÊM / SỬA NHÂN VIÊN --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl w-[600px] shadow-2xl">
                        <h3 className="text-xl font-bold text-accent mb-6 border-b border-white/10 pb-3">
                            {editingStaff ? '✏️ Cập nhật Hồ sơ' : '👔 Thêm nhân viên mới'}
                        </h3>
                        {errorMsg && <div className="col-span-2 text-danger text-center font-bold mb-2 animate-pulse">{errorMsg}</div>}
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Mã NV</label>
                                <input name="code" defaultValue={editingStaff?.code} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" placeholder="NV..." />
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Họ và Tên</label>
                                <input name="name" defaultValue={editingStaff?.name} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white focus:border-accent outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Số điện thoại</label>
                                <input name="phone" defaultValue={editingStaff?.phone} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Chức vụ</label>
                                <select name="role" defaultValue={editingStaff?.role || "Phục vụ"} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none">
                                    <option>Quản lý</option>
                                    <option>Pha chế</option>
                                    <option>Phục vụ</option>
                                    <option>Bảo vệ</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Ca làm việc chính</label>
                                <input name="shift" defaultValue={editingStaff?.shift} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" placeholder="VD: Ca Sáng (7h-15h)" />
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Lương cơ bản (Tháng)</label>
                                <input name="salary" type="number" defaultValue={editingStaff?.salary} required className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-text-dim block mb-1 uppercase font-bold">Trạng thái</label>
                                <select name="status" defaultValue={editingStaff?.status || 'offline'} className="w-full bg-bg border border-[#444] rounded-lg p-3 text-white outline-none">
                                    <option value="online">Đang làm</option>
                                    <option value="offline">Đã về</option>
                                </select>
                            </div>
                            
                            <div className="col-span-2 flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors">Hủy bỏ</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-accent text-white hover:brightness-110 font-bold shadow-lg shadow-accent/20">Lưu Hồ sơ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: LỊCH SỬ CHẤM CÔNG (MỚI) --- */}
            {showAttendance && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-center backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface border border-white/10 p-0 rounded-2xl w-[600px] shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-accent">🕒 Bảng chấm công</h3>
                                <p className="text-sm text-text-dim">Nhân viên: <span className="text-white font-bold">{selectedStaff?.name}</span></p>
                            </div>
                            <button onClick={() => setShowAttendance(false)} className="text-text-dim hover:text-white text-2xl">&times;</button>
                        </div>
                        
                        <div className="p-5">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-text-dim border-b border-white/10">
                                        <th className="text-left pb-3 font-medium">Ngày</th>
                                        <th className="text-center pb-3 font-medium">Check-in</th>
                                        <th className="text-center pb-3 font-medium">Check-out</th>
                                        <th className="text-right pb-3 font-medium">Tổng giờ</th>
                                        <th className="text-right pb-3 font-medium">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_ATTENDANCE.map((log, idx) => (
                                        <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                                            <td className="py-3 text-white">{log.date}</td>
                                            <td className="py-3 text-center text-success font-mono">{log.in}</td>
                                            <td className="py-3 text-center text-danger font-mono">{log.out}</td>
                                            <td className="py-3 text-right font-bold">{log.total}</td>
                                            <td className="py-3 text-right">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.status === 'Đúng giờ' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-bg/50 text-right">
                            <button onClick={() => setShowAttendance(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-sm">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;