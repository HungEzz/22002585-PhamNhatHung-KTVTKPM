import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [page, setPage]   = useState('products'); // login | register | products | cart | orders
  const [cart, setCart]   = useState([]);          // local cart state
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!user) setPage('login');
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  const doLogin = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setPage('products');
  }, []);

  const doLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    setPage('login');
    addToast('👋 Đã đăng xuất');
  }, [addToast]);

  // Local cart helpers (mirrors cart service)
  const addItem = useCallback((product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.productId === product.id);
      if (ex) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { productId: product.id, name: product.name, price: product.price, image: product.image, qty }];
    });
    addToast(`✅ Thêm "${product.name}" vào giỏ`);
  }, [addToast]);

  const updateQty = useCallback((productId, delta) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }, []);

  const removeItem = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
    addToast('🗑️ Đã xoá sản phẩm');
  }, [addToast]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppCtx.Provider value={{
      user, doLogin, doLogout,
      page, setPage,
      cart, addItem, updateQty, removeItem, clearCart, cartCount, cartTotal,
      toasts, addToast,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
