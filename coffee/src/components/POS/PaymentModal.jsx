import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const PaymentModal = ({ type, total, onClose }) => {
    const { checkout, selectedTable } = useCart();
    const [success, setSuccess] = useState(false);

    const handleComplete = () => {
        setSuccess(true);
        setTimeout(() => { checkout(); onClose(); }, 2500);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center backdrop-blur-sm animate-fadeIn">
            <div className="bg-white text-black p-[35px] rounded-[25px] w-[420px] text-center shadow-2xl">
                {!success ? (
                    <>
                        {type === 'qr' ? (
                            <>
                                <h3 className="text-xl font-bold mb-2">Quét mã thanh toán</h3>
                                <p className="mb-4 text-gray-600">Tổng: {total.toLocaleString()}đ</p>
                                <img src={`https://img.vietqr.io/image/MB-0334613060-compact.png?amount=${total}&addInfo=Ban%20${selectedTable}`} className="w-[260px] mx-auto rounded-xl border border-gray-200 mb-6" />
                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-gray-100 rounded-xl font-bold" onClick={onClose}>ĐÓNG</button>
                                    <button className="flex-1 py-3 bg-accent text-white rounded-xl font-bold" onClick={handleComplete}>HOÀN TẤT</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-2">Thanh toán tiền mặt</h3>
                                <p className="mb-4 text-2xl font-bold">{total.toLocaleString()}đ</p>
                                <button className="w-full py-3 bg-accent text-white rounded-xl font-bold mb-3" onClick={handleComplete}>XÁC NHẬN ĐÃ THU</button>
                                <button className="w-full py-3 bg-gray-100 rounded-xl font-bold" onClick={onClose}>QUAY LẠI</button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="py-5">
                        <div className="w-20 h-20 border-4 border-success rounded-full mx-auto mb-5 flex items-center justify-center text-4xl text-success">✓</div>
                        <h2 className="text-xl font-extrabold text-primary">THANH TOÁN THÀNH CÔNG!</h2>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PaymentModal;