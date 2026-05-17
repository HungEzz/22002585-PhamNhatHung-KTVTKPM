import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { checkout } from '../api';

export default function CartPage() {
  const { cart, updateQty, removeItem, cartTotal, setPage, setOrderResult, addToast } = useApp();
  const [checking, setChecking] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setChecking(true);
    try {
      // Try PU3 checkout endpoint; fallback to local simulation
      let result;
      try {
        result = await checkout();
      } catch {
        // Simulate order when PU3 not running
        result = {
          success: true,
          orderId: 'ORD-' + Date.now(),
          items: cart,
          total: cartTotal,
          timestamp: new Date().toISOString(),
          source: 'local-simulation',
        };
      }
      setOrderResult({ ...result, items: cart, total: cartTotal });
      setPage('order');
      addToast('🎉 Đặt hàng thành công!');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setChecking(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="section-title">🛒 Giỏ hàng</div>
        <div className="cart-empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <p>Giỏ hàng trống. <button onClick={() => setPage('products')} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Xem sản phẩm</button></p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section-title">🛒 Giỏ hàng ({cart.length} sản phẩm)</div>

      <div style={{ overflowX: 'auto' }}>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(({ product, quantity }) => (
              <tr key={product.id} id={`cart-row-${product.id}`}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      className="cart-item-img"
                      src={product.image}
                      alt={product.name}
                      onError={(e) => { e.target.src = 'https://placehold.co/60x60/13131a/ff4d00?text=?'; }}
                    />
                    <span className="cart-item-name">{product.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {product.price.toLocaleString('vi-VN')}₫
                </td>
                <td>
                  <div className="cart-qty">
                    <button className="qty-btn" id={`qty-dec-${product.id}`} onClick={() => updateQty(product.id, -1)}>−</button>
                    <span style={{ minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                    <button className="qty-btn" id={`qty-inc-${product.id}`} onClick={() => updateQty(product.id, 1)}>+</button>
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>
                  {(product.price * quantity).toLocaleString('vi-VN')}₫
                </td>
                <td>
                  <button className="remove-btn" id={`remove-btn-${product.id}`} onClick={() => removeItem(product.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cart-summary">
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Tổng thanh toán</div>
          <div className="cart-total">{cartTotal.toLocaleString('vi-VN')}₫</div>
        </div>
        <button
          id="checkout-btn"
          className="btn-checkout"
          onClick={handleCheckout}
          disabled={checking}
        >
          {checking ? '⏳ Đang xử lý...' : '⚡ Đặt hàng ngay'}
        </button>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        📡 Giỏ hàng lưu trong <strong>Redis Data Grid</strong> · PU2 (port 8082) · PU3 Checkout (port 8083)
      </div>
    </div>
  );
}
