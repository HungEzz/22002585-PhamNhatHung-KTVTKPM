import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);         // logged-in user
  const [page, setPage] = useState('login');       // login | tours | booking
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPage('login');
    addToast('👋 Đã đăng xuất');
  }, [addToast]);

  return (
    <AppContext.Provider value={{ user, setUser, page, setPage, toasts, addToast, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
