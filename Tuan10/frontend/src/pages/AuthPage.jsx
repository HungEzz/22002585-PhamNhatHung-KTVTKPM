import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { login, register } from '../api';

export default function AuthPage() {
  const { doLogin, addToast } = useApp();
  const [mode, setMode]     = useState('login'); // login | register
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  // form state
  const [form, setForm] = useState({ username: '', password: '', email: '', full_name: '' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const data = await login({ username: form.username, password: form.password });
        doLogin(data.user, data.token);
        addToast(`🎉 Xin chào, ${data.user.full_name}!`);
      } else {
        if (!form.email || !form.full_name) { setError('Vui lòng điền đầy đủ thông tin'); setLoading(false); return; }
        const data = await register({ username: form.username, password: form.password, email: form.email, full_name: form.full_name });
        doLogin(data.user, data.token);
        addToast(`✅ Đăng ký thành công! Xin chào ${data.user.full_name}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = m => { setMode(m); setError(''); setSuccess(''); };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🛍️ ShopMicro</h1>
          <p>E-Commerce · Microservices Architecture</p>
        </div>
        <div className="auth-body">
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '0.5rem' }}>
            {['login','register'].map(m => (
              <button key={m} id={`tab-${m}`} onClick={() => switchMode(m)}
                style={{ flex: 1, padding: '10px', background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.88rem', color: mode===m ? 'var(--orange)' : 'var(--text-muted)',
                  borderBottom: mode===m ? '2px solid var(--orange)' : '2px solid transparent',
                  marginBottom: '-2px', fontFamily: 'inherit' }}>
                {m === 'login' ? '🔐 Đăng nhập' : '📝 Đăng ký'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input id="input-fullname" className="form-input" placeholder="Nguyễn Văn A" value={form.full_name} onChange={set('full_name')} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Username</label>
              <input id="input-username" className="form-input" placeholder="demo / admin / hung" value={form.username} onChange={set('username')} autoComplete="username" />
            </div>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Email</label>
                <input id="input-email" className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input id="input-password" className="form-input" type="password" placeholder={mode==='login'?'demo123 / admin123 / hung123':'Tạo mật khẩu'} value={form.password} onChange={set('password')} autoComplete={mode==='login'?'current-password':'new-password'} />
            </div>
            {error   && <div className="error-msg">❌ {error}</div>}
            {success && <div className="success-msg">✅ {success}</div>}
            <button id="auth-submit-btn" className="btn btn-orange btn-full" type="submit" disabled={loading}>
              {loading ? '⏳ Đang xử lý...' : mode === 'login' ? '🚀 Đăng nhập' : '📝 Tạo tài khoản'}
            </button>
          </form>

          {mode === 'login' && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '8px 12px', borderRadius: '4px' }}>
              🔑 Demo: <strong>demo</strong>/demo123 · <strong>admin</strong>/admin123 · <strong>hung</strong>/hung123
            </div>
          )}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            🏗️ User Service <span className="micro-badge">:8081</span> · DB riêng: SQLite
          </div>
        </div>
      </div>
    </div>
  );
}
