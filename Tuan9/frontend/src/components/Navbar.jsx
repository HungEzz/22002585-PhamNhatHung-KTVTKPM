import { useApp } from '../context/AppContext';

const FLOW_NODES = [
  { label: 'Frontend', icon: '🖥️', cls: 'active' },
  { label: 'Orchestrator', icon: '🎛️', cls: 'orchestrator' },
  { label: 'User Svc', icon: '👤', cls: '' },
  { label: 'Tour Svc', icon: '🗺️', cls: '' },
  { label: 'Booking', icon: '📋', cls: '' },
  { label: 'Payment', icon: '💳', cls: '' },
];

export default function Navbar({ orchOnline }) {
  const { user, page, setPage, logout } = useApp();

  return (
    <>
      <nav className="navbar">
        <div className="brand" onClick={() => user && setPage('tours')}>
          ✈️ Travel<span className="brand-dot">SOA</span>
        </div>
        <span className="arch-pill">Orchestration-Driven SOA</span>
        <div className="nav-actions">
          {user && (
            <>
              <span className="nav-user">👤 <strong>{user.name}</strong></span>
              <button id="nav-tours-btn" className="btn btn-secondary" onClick={() => setPage('tours')}>🗺️ Tours</button>
              <button id="nav-logout-btn" className="btn btn-outline" onClick={logout}>Đăng xuất</button>
            </>
          )}
        </div>
      </nav>

      {user && (
        <div className="status-bar">
          <span>
            <span className={`status-dot ${orchOnline ? 'online' : 'offline'}`}></span>
            Orchestrator {orchOnline ? 'Online' : 'Offline (mock mode)'}
          </span>
          <span className="tag amber">Port 8080</span>
          <span style={{ color: 'var(--text-muted)' }}>
            ⚠️ Frontend → <strong>chỉ</strong> gọi Orchestrator · Orchestrator điều phối tất cả services
          </span>
        </div>
      )}
    </>
  );
}

export function FlowDiagram() {
  return (
    <div className="flow-diagram">
      {FLOW_NODES.map((n, i) => (
        <>
          <div key={n.label} className={`flow-node ${n.cls}`}>
            <span className="flow-icon">{n.icon}</span>
            {n.label}
          </div>
          {i < FLOW_NODES.length - 1 && (
            <span key={`arr-${i}`} className="flow-arrow">
              {i === 0 ? '→' : i === 1 ? '⇄' : '↕'}
            </span>
          )}
        </>
      ))}
    </div>
  );
}
