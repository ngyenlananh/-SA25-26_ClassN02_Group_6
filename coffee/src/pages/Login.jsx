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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lấy danh sách user đã đăng ký
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const isAdmin = email === 'admin' && password === '123456';
    const isUser = users.find(u => u.email === email && u.password === password);
    if (isAdmin || isUser) {
      localStorage.setItem('user', email);
      navigate('/');
    } else {
      setError('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#18191A] via-[#232325] to-[#18191A]">
      <div className="w-full max-w-md bg-[#232325]/95 shadow-2xl rounded-3xl px-12 py-10 border border-[#2d2d2d] flex flex-col items-center animate-fadeIn backdrop-blur-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)'}}>
        <CoffeeIcon />
        <h2 className="text-4xl font-extrabold mb-7 text-[#F5CBA7] text-center tracking-wide font-sans drop-shadow">Đăng nhập</h2>
        {error && <div className="text-red-400 mb-4 text-center w-full font-semibold animate-pulse">{error}</div>}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            placeholder="Email đăng nhập"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-[#232325] border-2 border-[#F5CBA7] text-[#F5CBA7] focus:outline-none focus:ring-2 focus:ring-[#F5CBA7] transition-all duration-200 shadow-inner text-lg placeholder-[#bfa77a]"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded-xl bg-[#232325] border-2 border-[#F5CBA7] text-[#F5CBA7] focus:outline-none focus:ring-2 focus:ring-[#F5CBA7] transition-all duration-200 shadow-inner text-lg placeholder-[#bfa77a]"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#F5CBA7] to-[#e6b77a] hover:from-[#e6b77a] hover:to-[#F5CBA7] text-[#232325] font-bold p-3 rounded-xl transition-all duration-200 shadow-lg text-lg mb-2 tracking-wide"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-3 text-base text-center text-[#aaa] w-full">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-[#F5CBA7] hover:underline font-semibold">Đăng ký</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
