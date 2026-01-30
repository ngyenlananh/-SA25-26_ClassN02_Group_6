import React from 'react';
import { useCart } from '../../context/CartContext';

const Sidebar = () => {
    const { activePage, setActivePage } = useCart();
    const menu = [
        { id: 'pos', label: '🖥️ Bán hàng & Bàn' },
        { id: 'inventory', label: '📦 Kho hàng' },
        { id: 'crm', label: '👥 Khách hàng' },
        { id: 'finance', label: '💰 Thu - Chi' },
        { id: 'marketing', label: '🎁 Khuyến mãi' },
        { id: 'staff', label: '👔 Nhân viên' },
        { id: 'stats', label: '📊 Thống kê' },
        { id: 'settings', label: '⚙️ Hệ thống' },
    ];

    return (
        <nav className="w-[240px] bg-surface flex flex-col p-[30px_20px] border-r border-white/5 h-full">
            <div className="text-xl font-extrabold text-accent mb-10 text-center">STARBUZZ ERP</div>
            {menu.map(item => (
                <div 
                    key={item.id} 
                    className={`
                        p-[14px_18px] rounded-xl mb-2 cursor-pointer flex items-center gap-3 
                        text-sm font-medium transition-all duration-200
                        ${activePage === item.id 
                            ? 'bg-accent text-primary font-bold shadow-lg' 
                            : 'text-text-dim hover:bg-white/5 hover:text-text'
                        }
                    `}
                    onClick={() => setActivePage(item.id)}
                >
                    {item.label}
                </div>
            ))}
        </nav>
    );
};

export default Sidebar;