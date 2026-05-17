import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AuthPage from './pages/AuthPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import './index.css';

function Router({ setSvcStatus, svcStatus }) {
  const { user, page } = useApp();
  if (!user) return <AuthPage />;
  if (page === 'cart')    return <CartPage />;
  return <ProductsPage setSvcStatus={setSvcStatus} />;
}

export default function App() {
  const [svcStatus, setSvcStatus] = useState({ user: false, product: false, cart: false, order: false });
  return (
    <AppProvider>
      <Navbar svcStatus={svcStatus} />
      <Router setSvcStatus={setSvcStatus} svcStatus={svcStatus} />
      <Toast />
    </AppProvider>
  );
}
