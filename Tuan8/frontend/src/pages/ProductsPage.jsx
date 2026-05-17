import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api';
import { useApp } from '../context/AppContext';
import ProductModal from '../components/ProductModal';

export default function ProductsPage() {
  const { addToCart } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [latency, setLatency] = useState(null);
  const [pu1Online, setPu1Online] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const t0 = Date.now();
    try {
      const data = await getProducts();
      setLatency(Date.now() - t0);
      setProducts(data.products || []);
      setPu1Online(true);
    } catch (err) {
      setPu1Online(false);
      setError('⚠️ Không kết nối được PU1. Đảm bảo product-service đang chạy trên port 8081.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <>
      {/* Flash banner */}
      <div className="flash-banner">
        <h1>⚡ Flash Sale – Bán Hàng Sốc!</h1>
        <p>Ưu đãi cực sốc – Số lượng có hạn – Nhanh tay kẻo hết!</p>
        <div className="arch-badge">🏗️ Space-Based Architecture · Data Grid: Redis</div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <span>
          <span className={`status-dot ${pu1Online ? '' : 'offline'}`}></span>
          PU1 – Product Service {pu1Online ? 'Online' : 'Offline'}
        </span>
        {latency !== null && <span>⚡ Latency: <strong>{latency}ms</strong></span>}
        <span>📡 Source: <strong>Redis Data Grid</strong></span>
        <span className="tag">Port 8081</span>
      </div>

      <div className="page">
        <div className="section-title">
          🛍️ Danh sách sản phẩm
          <button
            id="refresh-products-btn"
            onClick={fetchProducts}
            style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            🔄 Tải lại từ Redis
          </button>
        </div>

        {loading && (
          <>
            <div className="spinner" />
            <p className="loading-text">Đang tải từ Redis Data Grid...</p>
          </>
        )}

        {error && (
          <div style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '1.5rem', color: '#ff6b8a', textAlign: 'center' }}>
            {error}
            <br />
            <button onClick={fetchProducts} style={{ marginTop: '1rem', padding: '8px 20px', borderRadius: '8px', background: 'var(--primary)', border: 'none', color: '#fff', cursor: 'pointer' }}>
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="products-grid">
            {products.map((p) => {
              const discount = Math.round((1 - p.price / p.originalPrice) * 100);
              return (
                <div key={p.id} className="product-card" id={`product-card-${p.id}`}>
                  <img
                    className="product-img"
                    src={p.image}
                    alt={p.name}
                    onClick={() => setSelected(p)}
                    onError={(e) => { e.target.src = 'https://placehold.co/400x200/13131a/ff4d00?text=No+Image'; }}
                  />
                  <div className="product-body" onClick={() => setSelected(p)}>
                    <span className="product-category">{p.category}</span>
                    <div className="product-name">{p.name}</div>
                    <div style={{ display: 'flex', align: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="product-price">{p.price.toLocaleString('vi-VN')}₫</span>
                      <span className="product-discount">-{discount}%</span>
                    </div>
                    <span className="product-original">{p.originalPrice.toLocaleString('vi-VN')}₫</span>
                    <span className="product-rating">⭐ {p.rating} · Đã bán {p.sold?.toLocaleString()}</span>
                    <span className={`product-stock ${p.stock < 10 ? 'low' : ''}`}>
                      {p.stock < 10 ? `🔥 Còn ${p.stock}!` : `Kho: ${p.stock}`}
                    </span>
                  </div>
                  <button
                    id={`add-cart-btn-${p.id}`}
                    className="btn-add-cart"
                    disabled={p.stock === 0}
                    onClick={() => addToCart(p)}
                  >
                    {p.stock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
