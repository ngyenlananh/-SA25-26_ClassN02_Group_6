import React, { createContext, useContext, useState } from 'react';
import { PRODUCTS, INVENTORY_DATA,CUSTOMERS } from '../constants/mockMenu';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [activePage, setActivePage] = useState('pos');
    const [tables, setTables] = useState(Array.from({length: 12}, (_, i) => ({ id: i+1, status: 'empty' })));
    const [selectedTable, setSelectedTable] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        if (!selectedTable) {
            alert("Vui lòng chọn bàn trước!");
            return;
        }
        setCartItems([...cartItems, product]);
    };

    const checkout = () => {
        if (selectedTable) {
            const newTables = tables.map(t => t.id === selectedTable ? {...t, status: 'occupied'} : t);
            setTables(newTables);
            setSelectedTable(null);
            setCartItems([]);
        }
    };

    return (
        <CartContext.Provider value={{ 
            activePage, setActivePage,
            tables, selectedTable, setSelectedTable,
            cartItems, addToCart, checkout,
            products: PRODUCTS,
            inventory: INVENTORY_DATA,
            customers: CUSTOMERS // <--- THÊM DÒNG NÀY
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);