import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Sidebar from './components/Layout/Sidebar';
import POS from './components/POS/POS';
import Inventory from './components/Inventory/Inventory';
import Dashboard from './components/Dashboard/Dashboard';
import Settings from './components/Config/Settings';
import CRM from './components/CRM/CRM';
import Finance from './components/Finance/Finance';
import Staff from './components/Staff/Staff';
import Marketing from './components/Marketing/Marketing';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Statistics from './pages/Statistics';
import SystemSettings from './components/Config/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';

const Placeholder = ({t}) => (
    <div className="w-full h-full p-[30px] animate-fadeIn text-accent font-bold text-xl">
        {t} - Đang cập nhật...
    </div>
);

const MainContent = () => {
    const { activePage } = useCart();
    return (
        <main className="flex-1 h-full overflow-hidden relative bg-bg">
            {activePage === 'pos' && <POS />}
            {activePage === 'inventory' && <Inventory />}
            {activePage === 'stats' && <Dashboard />}
            {activePage === 'settings' && <Settings />}
            {activePage === 'crm' && <CRM />}
            {activePage === 'finance' && <Finance />}
            {activePage === 'marketing' && <Marketing />}
            {activePage === 'staff' && <Staff />}
        </main>
    );
};

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/system" element={<SystemSettings />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/*" element={
        <CartProvider>
          <div className="flex h-screen w-screen bg-bg text-text font-sans overflow-hidden">
            <Sidebar />
            <MainContent />
          </div>
        </CartProvider>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
