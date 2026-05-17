import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { login } from '../api';
import { FlowDiagram } from '../components/Navbar';

export default function LoginPage() {
  const { setUser, setPage, addToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setError('Vui lòng nhập username'); return; }
    setLoading(true); setError('');
    try {
      const data = await login(username.trim(), password);
      setUser(data.user);
      setPage('tours');
      addToast(`🎉 Xin chào, ${data.user.name}!`);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (u) => { setUsername(u); setPassword('demo'); };

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <h1>✈️ TravelSOA</h1>
        <p>Hệ thống đặt tour du lịch theo kiến trúc Orchestration-Driven SOA</p>
        <FlowDiagram />
      </div>

      <div className="login-wrap">
        <div className="login-card">
          <div className="login-header">
            <h2>🔐 Đăng nhập</h2>
            <p>Đăng nhập để xem và đặt tour du lịch</p>
          </div>
          <div className="login-body">
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  className="form-input"
                  type="text"
                  placeholder="Nhập username (vd: demo, user1)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  className="form-input"
                  type="password"
                  placeholder="Nhập password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <button
                id="login-submit-btn"
                type="submit"
                className="btn btn-primary"
                style={{ padding: '13px' }}
                disabled={loading}
              >
                {loading ? '⏳ Đang xác thực qua Orchestrator...' : '🚀 Đăng nhập'}
              </button>
            </form>

            <div className="login-hint">
              Thử nhanh:&nbsp;
              {['demo', 'user1', 'user2'].map((u) => (
                <button
                  key={u}
                  id={`quick-login-${u}`}
                  onClick={() => quickLogin(u)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', fontWeight: 600, marginRight: '8px' }}
                >
                  {u}
                </button>
              ))}
            </div>
            <div className="login-hint" style={{ fontSize: '0.73rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', color: 'var(--text-muted)' }}>
              📡 Login → <strong>Orchestrator (:8080)</strong> → User Service (:8081)
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
