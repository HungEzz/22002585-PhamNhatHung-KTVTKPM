import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useApp();
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product);
    setAdding(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} id="modal-close-btn">✕</button>
        <div className="modal-inner">
          <img
            className="modal-img"
            src={product.image}
            alt={product.name}
            onError={(e) => { e.target.src = 'https://placehold.co/400x320/13131a/ff4d00?text=No+Image'; }}
          />
          <div className="modal-info">
            <span className="product-category">{product.category}</span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{product.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="product-price">{product.price.toLocaleString('vi-VN')}₫</span>
              <span className="product-original">{product.originalPrice.toLocaleString('vi-VN')}₫</span>
              <span className="product-discount">-{discount}%</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span className="product-rating">⭐ {product.rating}</span>
              <span>📦 Đã bán: {product.sold?.toLocaleString()}</span>
            </div>
            <div className={`product-stock ${product.stock < 10 ? 'low' : ''}`}>
              {product.stock < 10
                ? `🔥 Chỉ còn ${product.stock} sản phẩm!`
                : `Còn hàng: ${product.stock} sản phẩm`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-card2)', padding: '6px 10px', borderRadius: '6px' }}>
              📡 Data từ <strong style={{ color: 'var(--primary)' }}>Redis Data Grid</strong> · PU1-Product
            </div>
            <button
              id="modal-add-cart-btn"
              className="btn-add-cart"
              style={{ margin: 0 }}
              onClick={handleAdd}
              disabled={adding || product.stock === 0}
            >
              {adding ? '⏳ Đang thêm...' : product.stock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
