import { useApp } from '../context/AppContext';

const SERVICES = [
  { key: 'user',    label: 'User :8081',    port: 8081 },
  { key: 'product', label: 'Product :8082', port: 8082 },
  { key: 'cart',    label: 'Cart :8083',    port: 8083 },
  { key: 'order',   label: 'Order :8084',   port: 8084 },
];

export default function Navbar({ svcStatus }) {
  const { user, page, setPage, doLogout, cartCount } = useApp();
  if (!user) return null;
  return (
    <>
      <nav className="navbar">
        <div className="brand" id="nav-brand" onClick={() => setPage('products')}>
          🛍️ ShopMicro
        </div>
        <div className="nav-actions">
          <button id="nav-products" className="nav-icon-btn" onClick={() => setPage('products')}>🗂️ Sản phẩm</button>
          <button id="nav-cart" className="nav-icon-btn" onClick={() => setPage('cart')}>
            🛒 Giỏ hàng
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button id="nav-orders" className="nav-icon-btn" onClick={() => setPage('orders')}>📦 Đơn hàng</button>
          <span className="nav-icon-btn" style={{ cursor: 'default', opacity: 0.8 }}>👤 {user.full_name}</span>
          <button id="nav-logout" className="nav-icon-btn" onClick={doLogout}>Đăng xuất</button>
        </div>
      </nav>
      <div className="svc-strip">
        <span style={{ color: '#666', fontWeight: 600 }}>Microservices:</span>
        {SERVICES.map(s => (
          <span key={s.key}>
            <span className={`svc-dot ${svcStatus[s.key] ? 'on' : 'off'}`}></span>
            {s.label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: '#999' }}>Mỗi service có DB riêng · Không share DB</span>
      </div>
    </>
  );
}
