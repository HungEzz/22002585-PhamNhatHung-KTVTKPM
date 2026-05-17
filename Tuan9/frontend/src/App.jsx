import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import ToursPage from './pages/ToursPage';
import './index.css';

function AppRouter({ orchOnline, setOrchOnline }) {
  const { page, user } = useApp();
  if (!user || page === 'login') return <LoginPage />;
  return <ToursPage setOrchOnline={setOrchOnline} />;
}

export default function App() {
  const [orchOnline, setOrchOnline] = useState(true);
  return (
    <AppProvider>
      <Navbar orchOnline={orchOnline} />
      <AppRouter orchOnline={orchOnline} setOrchOnline={setOrchOnline} />
      <Toast />
    </AppProvider>
  );
}
