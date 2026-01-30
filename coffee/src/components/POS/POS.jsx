// import React, { useState } from 'react';
// import { useCart } from '../../context/CartContext';
// import PaymentModal from './PaymentModal';

// const POS = () => {
//     const { products, tables, selectedTable, setSelectedTable, addToCart, cartItems } = useCart();
//     const [showPayment, setShowPayment] = useState(null);
//     const total = cartItems.reduce((acc, item) => acc + item.price, 0);

//     const cats = [
//         {key: 'drink', name: '☕ Đồ uống'},
//         {key: 'snack', name: '🍿 Đồ ăn vặt'},
//         {key: 'ciga', name: '🚬 Thuốc lá'},
//         {key: 'topping', name: '✨ Toppings'}
//     ];

//     return (
//         <div className="w-full h-full p-[30px] overflow-y-auto animate-fadeIn">
//             <div className="grid grid-cols-[1fr_400px] gap-[25px]">
//                 {/* MENU SIDE */}
//                 <div>
//                     <div className="text-lg font-bold mb-[15px] text-accent border-b border-white/10 pb-2 flex items-center gap-2">
//                         🏠 Sơ đồ bàn
//                     </div>
//                     <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 mb-[30px]">
//                         {tables.map(t => (
//                             <div key={t.id} onClick={() => setSelectedTable(t.id)}
//                                 className={`
//                                     bg-surface p-4 rounded-[15px] text-center cursor-pointer border-2 transition-all
//                                     ${selectedTable === t.id ? 'border-warning bg-warning/10' : t.status === 'occupied' ? 'border-danger bg-danger/10' : 'border-transparent hover:border-white/10'}
//                                 `}>
//                                 Bàn {t.id}
//                             </div>
//                         ))}
//                     </div>
//                     {cats.map(cat => (
//                         <div key={cat.key} className="bg-white/5 rounded-[20px] p-5 mb-[25px] border border-white/5">
//                             <div className="text-lg font-bold mb-[15px] text-accent border-b border-white/10 pb-2">{cat.name}</div>
//                             <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[15px]">
//                                 {products.filter(p => p.cat === cat.key).map((p, idx) => (
//                                     <div key={idx} className="bg-surface rounded-2xl overflow-hidden cursor-pointer border border-white/5 text-center hover:border-accent hover:-translate-y-1 transition-all group"
//                                         onClick={() => addToCart(p)}>
//                                         <img src={p.img} alt={p.name} className="w-full h-[100px] object-cover" />
//                                         <div className="p-2.5 text-[13px]">
//                                             <b className="block mb-1 group-hover:text-accent">{p.name}</b>
//                                             <span className="text-text-dim">{p.price.toLocaleString()}đ</span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 {/* BILL SIDE */}
//                 <div className="relative">
//                     <div className="bg-surface rounded-[24px] p-[25px] border border-white/5 sticky top-0">
//                         <h3 className="text-lg font-bold mb-4">{selectedTable ? `Đang chọn: Bàn ${selectedTable}` : 'Vui lòng chọn bàn'}</h3>
//                         <div className="flex-1 overflow-y-auto min-h-[250px] border-b border-dashed border-[#444] mb-4 text-text-dim">
//                             {cartItems.length === 0 ? "Trống" : cartItems.map((item, i) => (
//                                 <div key={i} className="flex justify-between mb-2 text-sm"><span>{item.name}</span><span className="text-text">{item.price.toLocaleString()}đ</span></div>
//                             ))}
//                         </div>
//                         <div className="text-2xl font-extrabold text-accent flex justify-between py-4 border-t border-[#333]"><span>Tổng</span><span>{total.toLocaleString()}đ</span></div>
//                         <button className="w-full py-4 rounded-xl font-bold bg-accent text-white hover:brightness-110 mb-3" onClick={() => total > 0 && setShowPayment('qr')}>THANH TOÁN QR</button>
//                         <button className="w-full py-4 rounded-xl font-bold bg-[#eee] text-primary hover:bg-white" onClick={() => total > 0 && setShowPayment('cash')}>TIỀN MẶT</button>
//                     </div>
//                 </div>
//             </div>
//             {showPayment && <PaymentModal type={showPayment} total={total} onClose={() => setShowPayment(null)} />}
//         </div>
//     );
// };
// export default POS;
















import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import PaymentModal from './PaymentModal';

const POS = () => {
    const { products, tables, selectedTable, setSelectedTable, addToCart, cartItems } = useCart();
    const [showPayment, setShowPayment] = useState(null);
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    const cats = [
        {key: 'drink', name: '☕ Đồ uống'},
        {key: 'snack', name: '🍿 Đồ ăn vặt'},
        {key: 'ciga', name: '🚬 Thuốc lá'},
        {key: 'topping', name: '✨ Toppings'}
    ];

    return (
        // Container bao ngoài: Full width, Full height, padding 30px
        <div className="w-full h-full p-[30px] overflow-hidden animate-fadeIn flex flex-col">
            
            {/* Grid Layout: Cột trái (1fr - tự giãn) | Cột phải (400px - cố định) */}
            <div className="grid grid-cols-[1fr_400px] gap-[25px] h-full overflow-hidden">
                
                {/* --- CỘT TRÁI: DANH SÁCH BÀN & MENU (Cho phép cuộn dọc) --- */}
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar pb-20">
                    {/* Phần Sơ đồ bàn */}
                    <div className="sticky top-0 bg-bg z-10 pt-2 pb-4">
                        <div className="text-lg font-bold mb-[15px] text-accent border-b border-white/10 pb-2 flex items-center gap-2">
                            🏠 Sơ đồ bàn
                        </div>
                        {/* Grid bàn: Tự động xuống dòng, min 100px */}
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                            {tables.map(t => (
                                <div key={t.id} onClick={() => setSelectedTable(t.id)}
                                    className={`
                                        bg-surface p-4 rounded-[15px] text-center cursor-pointer border-2 transition-all font-bold select-none
                                        ${selectedTable === t.id 
                                            ? 'border-warning bg-warning/10 text-warning' 
                                            : t.status === 'occupied' 
                                                ? 'border-danger bg-danger/10 text-danger' 
                                                : 'border-transparent hover:border-white/10 text-text-dim hover:text-white'
                                        }
                                    `}>
                                    Bàn {t.id}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phần Menu Sản phẩm */}
                    {cats.map(cat => (
                        <div key={cat.key} className="bg-white/5 rounded-[20px] p-5 mb-[25px] border border-white/5">
                            <div className="text-lg font-bold mb-[15px] text-accent border-b border-white/10 pb-2">{cat.name}</div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[15px]">
                                {products.filter(p => p.cat === cat.key).map((p, idx) => (
                                    <div key={idx} className="bg-surface rounded-2xl overflow-hidden cursor-pointer border border-white/5 text-center hover:border-accent hover:-translate-y-1 transition-all group shadow-sm"
                                        onClick={() => addToCart(p)}>
                                        <img src={p.img} alt={p.name} className="w-full h-[100px] object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="p-2.5 text-[13px]">
                                            <b className="block mb-1 group-hover:text-accent text-white line-clamp-1">{p.name}</b>
                                            <span className="text-text-dim font-medium">{p.price.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- CỘT PHẢI: HÓA ĐƠN (Cố định, không cuộn theo trang) --- */}
                <div className="relative h-full flex flex-col">
                    <div className="bg-surface rounded-[24px] p-[25px] border border-white/5 h-full flex flex-col shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 text-white">
                            {selectedTable ? `Đang chọn: Bàn ${selectedTable}` : 'Vui lòng chọn bàn'}
                        </h3>
                        
                        {/* List món đã chọn (Cuộn riêng) */}
                        <div className="flex-1 overflow-y-auto border-b border-dashed border-[#444] mb-4 text-text-dim custom-scrollbar pr-2">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex items-center justify-center italic opacity-50">Chưa có món nào</div>
                            ) : (
                                cartItems.map((item, i) => (
                                    <div key={i} className="flex justify-between mb-3 text-sm py-2 border-b border-white/5 last:border-0">
                                        <span className="text-white font-medium">{item.name}</span>
                                        <span className="text-accent">{item.price.toLocaleString()}đ</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Tổng tiền & Nút bấm */}
                        <div className="mt-auto">
                            <div className="text-2xl font-extrabold text-accent flex justify-between py-4 border-t border-[#333]">
                                <span>Tổng</span>
                                <span>{total.toLocaleString()}đ</span>
                            </div>
                            <button className="w-full py-4 rounded-xl font-bold bg-accent text-white hover:brightness-110 mb-3 transition-all shadow-lg shadow-accent/20" 
                                onClick={() => total > 0 && setShowPayment('qr')}>
                                THANH TOÁN QR
                            </button>
                            <button className="w-full py-4 rounded-xl font-bold bg-[#eee] text-primary hover:bg-white transition-all" 
                                onClick={() => total > 0 && setShowPayment('cash')}>
                                TIỀN MẶT
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            {showPayment && <PaymentModal type={showPayment} total={total} onClose={() => setShowPayment(null)} />}
        </div>
    );
};
export default POS;