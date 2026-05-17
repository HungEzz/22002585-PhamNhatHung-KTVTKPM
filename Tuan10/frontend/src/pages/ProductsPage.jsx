import { useState, useEffect } from 'react';
import { getProducts } from '../api';
import { useApp } from '../context/AppContext';

// Mock products khi Product Service chưa chạy
const MOCK_PRODUCTS = [
  { id:'p1', name:'iPhone 15 Pro Max 256GB', price:28990000, originalPrice:34990000, image:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', rating:4.9, sold:1200, category:'Điện thoại' },
  { id:'p2', name:'Samsung Galaxy S24 Ultra', price:26990000, originalPrice:31990000, image:'https://images.unsplash.com/photo-1706525715238-53db4b3de921?w=400', rating:4.8, sold:980, category:'Điện thoại' },
  { id:'p3', name:'MacBook Air M3 8GB 256GB', price:27490000, originalPrice:32490000, image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', rating:4.9, sold:540, category:'Laptop' },
  { id:'p4', name:'Sony WH-1000XM5', price:7490000, originalPrice:9490000, image:'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', rating:4.8, sold:2300, category:'Tai nghe' },
  { id:'p5', name:'iPad Pro M4 11 inch 256GB', price:21990000, originalPrice:25990000, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', rating:4.9, sold:670, category:'Tablet' },
  { id:'p6', name:'Apple Watch Series 10', price:11490000, originalPrice:13990000, image:'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400', rating:4.7, sold:890, category:'Đồng hồ' },
  { id:'p7', name:'ASUS ROG Zephyrus G14', price:35990000, originalPrice:42990000, image:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', rating:4.8, sold:320, category:'Laptop' },
  { id:'p8', name:'AirPods Pro 2', price:5990000, originalPrice:7490000, image:'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', rating:4.8, sold:3100, category:'Tai nghe' },
  { id:'p9', name:'Xiaomi 14 Ultra', price:22990000, originalPrice:27990000, image:'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400', rating:4.7, sold:760, category:'Điện thoại' },
  { id:'p10', name:'Dell XPS 15 OLED', price:42990000, originalPrice:49990000, image:'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?w=400', rating:4.8, sold:280, category:'Laptop' },
];

export default function ProductsPage({ setSvcStatus }) {
  const { addItem } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    getProducts()
      .then(data => { setProducts(data.products || data); setSvcStatus(p => ({ ...p, product: true })); })
      .catch(() => { setProducts(MOCK_PRODUCTS); setSvcStatus(p => ({ ...p, product: false })); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      {/* Search bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '8px' }}>
        <input
          id="product-search"
          className="form-input"
          style={{ flex: 1, borderRadius: '2px' }}
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="section-title">
        🗂️ Danh sách sản phẩm
        <span className="micro-badge" style={{ fontSize: '0.72rem' }}>Product Service :8082</span>
      </div>

      {loading && <div className="spinner" />}

      {!loading && (
        <div className="products-grid">
          {filtered.map(p => {
            const discount = Math.round((1 - p.price / (p.originalPrice || p.price * 1.2)) * 100);
            return (
              <div key={p.id} className="product-card" id={`pcard-${p.id}`}>
                <img
                  className="product-img"
                  src={p.image}
                  alt={p.name}
                  onError={e => { e.target.src = `https://placehold.co/400x180/f5f5f5/ee4d2d?text=${encodeURIComponent(p.name.slice(0,10))}`; }}
                />
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span className="product-price">{p.price.toLocaleString('vi-VN')}₫</span>
                    {discount > 0 && <span style={{ background: 'var(--orange)', color: '#fff', fontSize: '0.68rem', padding: '1px 5px', borderRadius: '2px', fontWeight: 700 }}>-{discount}%</span>}
                  </div>
                  {p.originalPrice && <div className="product-original">{p.originalPrice.toLocaleString('vi-VN')}₫</div>}
                  <div className="product-rating">⭐ {p.rating}</div>
                  <div className="product-sold">Đã bán: {p.sold?.toLocaleString()}</div>
                </div>
                <button
                  id={`add-cart-${p.id}`}
                  className="btn-add-cart"
                  onClick={() => addItem(p)}
                >
                  🛒 Thêm vào giỏ
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
