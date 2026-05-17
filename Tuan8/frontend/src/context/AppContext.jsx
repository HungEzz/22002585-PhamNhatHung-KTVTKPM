import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [page, setPage] = useState('products'); // 'products' | 'cart' | 'order'
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [toasts, setToasts] = useState([]);
  const [orderResult, setOrderResult] = useState(null);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      try {
        // Try PU2, fallback to local state if service not running
        try {
          await api.addToCart(product.id, quantity);
        } catch {
          /* PU2 may not be running in this assignment scope */
        }
        setCart((prev) => {
          const exists = prev.find((i) => i.product.id === product.id);
          if (exists) {
            return prev.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          }
          return [...prev, { product, quantity }];
        });
        addToast(`✅ Đã thêm "${product.name}" vào giỏ hàng`);
      } catch (err) {
        addToast(err.message, 'error');
      }
    },
    [addToast]
  );

  const updateQty = useCallback((productId, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    addToast('🗑️ Đã xoá sản phẩm khỏi giỏ hàng');
  }, [addToast]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        page, setPage,
        cart, addToCart, updateQty, removeItem,
        cartCount, cartTotal,
        toasts, addToast,
        orderResult, setOrderResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
