import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CoffeeIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3 drop-shadow-lg">
    <rect width="24" height="24" rx="12" fill="#F5CBA7"/>
    <path d="M7 17C7 18.1046 8.34315 19 10 19H14C15.6569 19 17 18.1046 17 17V9H7V17Z" fill="#232325"/>
    <path d="M17 11H18C19.1046 11 20 11.8954 20 13C20 14.1046 19.1046 15 18 15H17" stroke="#232325" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 7V5M12 7V3M15 7V5" stroke="#232325" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePhone = (phone) => /^\d{9,11}$/.test(phone);

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên!';
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email!';
    else if (!validateEmail(email)) newErrors.email = 'Email không hợp lệ!';
    if (!phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại!';
    else if (!validatePhone(phone)) newErrors.phone = 'Số điện thoại không hợp lệ!';
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu!';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải từ 6 ký tự!';
    if (!confirmPassword) newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu!';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp!';
    if (!agree) newErrors.agree = 'Bạn phải đồng ý với điều khoản sử dụng!';
    // Kiểm tra trùng email
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) newErrors.email = 'Email đã được đăng ký!';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // Lưu tài khoản
    users.push({ fullName, email, phone, password });
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess('Đăng ký thành công!');
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#18191A] via-[#232325] to-[#18191A]">
      <div className="w-full max-w-md bg-[#232325]/95 shadow-2xl rounded-3xl px-12 py-10 border border-[#2d2d2d] flex flex-col items-center animate-fadeIn backdrop-blur-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)'}}>
        <CoffeeIcon />
        <h2 className="text-4xl font-extrabold mb-7 text-[#F5CBA7] text-center tracking-wide font-sans drop-shadow">Đăng ký</h2>
        {success && <div className="text-green-400 mb-4 text-center w-full font-semibold animate-pulse">{success}</div>}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="w-full mb-3">
            <input type="text" placeholder="Họ tên" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 rounded-xl bg-[#18191A] border-2 border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#F5CBA7] text-lg" />
            {errors.fullName && <div className="text-red-400 text-sm mt-1">{errors.fullName}</div>}
          </div>
          <div className="w-full mb-3">
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-[#18191A] border-2 border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#F5CBA7] text-lg" />
            {errors.email && <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
          </div>
          <div className="w-full mb-3">
            <input type="text" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 rounded-xl bg-[#18191A] border-2 border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#F5CBA7] text-lg" />
            {errors.phone && <div className="text-red-400 text-sm mt-1">{errors.phone}</div>}
          </div>
          <div className="w-full mb-3 relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-[#18191A] border-2 border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#F5CBA7] text-lg pr-12" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5CBA7]" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Ẩn' : 'Hiện'}</button>
            {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
          </div>
          <div className="w-full mb-3 relative">
            <input type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-xl bg-[#18191A] border-2 border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#F5CBA7] text-lg pr-12" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5CBA7]" tabIndex={-1} onClick={() => setShowConfirm(v => !v)}>{showConfirm ? 'Ẩn' : 'Hiện'}</button>
            {errors.confirmPassword && <div className="text-red-400 text-sm mt-1">{errors.confirmPassword}</div>}
          </div>
          <div className="w-full flex items-center mb-3">
            <input type="checkbox" id="agree" checked={agree} onChange={e => setAgree(e.target.checked)} className="mr-2" />
            <label htmlFor="agree" className="text-[#F5CBA7] text-sm">Tôi đồng ý với <a href="#" className="underline">điều khoản sử dụng</a></label>
          </div>
          {errors.agree && <div className="text-red-400 text-sm mb-2 w-full">{errors.agree}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-[#F5CBA7] to-[#e6b77a] hover:from-[#e6b77a] hover:to-[#F5CBA7] text-[#232325] font-bold p-3 rounded-xl transition-all duration-200 shadow-lg text-lg mb-2 tracking-wide">Đăng ký</button>
        </form>
        <div className="mt-3 text-base text-center text-[#aaa] w-full">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-[#F5CBA7] hover:underline font-semibold">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
