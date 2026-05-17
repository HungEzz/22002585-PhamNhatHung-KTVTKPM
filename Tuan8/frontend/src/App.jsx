import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';

function AppRouter() {
  const { page } = useApp();
  if (page === 'cart') return <CartPage />;
  if (page === 'order') return <OrderPage />;
  return <ProductsPage />;
}

export default function App() {
  return (
    <AppProvider>
      <Navbar />
      <AppRouter />
      <Toast />
    </AppProvider>
  );
}
