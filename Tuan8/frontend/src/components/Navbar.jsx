import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { page, setPage, cartCount } = useApp();

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); setPage('products'); }}>
        ⚡ Flash<span>Sale</span>
      </a>
      <div className="navbar-nav">
        <button
          id="nav-products"
          className={`nav-btn ${page === 'products' ? 'active' : ''}`}
          onClick={() => setPage('products')}
        >
          🛍️ Sản phẩm
        </button>
        <button
          id="nav-cart"
          className={`cart-btn`}
          onClick={() => setPage('cart')}
        >
          🛒 Giỏ hàng
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
