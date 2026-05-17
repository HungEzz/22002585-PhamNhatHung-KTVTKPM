import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createOrder, createPayment } from '../api';

const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Thẻ tín dụng', icon: '💳' },
  { id: 'momo',        label: 'MoMo',          icon: '📱' },
  { id: 'bank',        label: 'Chuyển khoản',  icon: '🏦' },
];

function CheckoutModal({ onClose }) {
  const { user, cart, cartTotal, clearCart, addToast } = useApp();
  const [pm, setPm]         = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Step 1: Create order (Order Service :8084)
      let order;
      try {
        const oData = await createOrder({
          userId: user.id,
          items: cart.map(i => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
          total: cartTotal,
        });
        order = oData.order || oData;
      } catch {
        order = { id: `ORD-${Date.now()}`, status: 'pending', source: 'local-mock' };
      }

      // Step 2: Process payment (Payment Service :8085)
      let payment;
      try {
        const pData = await createPayment({ orderId: order.id, userId: user.id, amount: cartTotal, method: pm });
        payment = pData.payment || pData;
      } catch {
        const ok = Math.random() > 0.15;
        payment = { id: `PAY-${Date.now()}`, status: ok ? 'success' : 'failed', method: pm, amount: cartTotal, transactionId: ok ? `TXN-${Math.random().toString(36).slice(2,10).toUpperCase()}` : null };
      }

      setResult({ order, payment, items: cart, total: cartTotal });
      if (payment.status === 'success') { clearCart(); addToast('🎉 Đặt hàng thành công!'); }
      else addToast('❌ Thanh toán thất bại', 'error');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>{result ? '📦 Kết quả đặt hàng' : '🛒 Xác nhận đơn hàng'}</h3>
          <button className="close-btn" id="checkout-close" onClick={onClose} disabled={loading}>✕</button>
        </div>
        <div className="modal-body">
          {!result ? (
            <>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Chi tiết đơn hàng</div>
                {cart.map(i => (
                  <div className="order-item" key={i.productId}>
                    <span>{i.name} × {i.qty}</span>
                    <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{(i.price * i.qty).toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
                <div className="order-total">
                  <span>Tổng cộng</span>
                  <span>{cartTotal.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Phương thức thanh toán</div>
                <div className="payment-grid">
                  {PAYMENT_METHODS.map(m => (
                    <div key={m.id} id={`pm-${m.id}`} className={`pm-card ${pm === m.id ? 'active' : ''}`} onClick={() => setPm(m.id)}>
                      <span className="pm-icon">{m.icon}</span>{m.label}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '8px 12px', borderRadius: '4px' }}>
                📡 Order Service <span className="micro-badge">:8084</span> → Payment Service <span className="micro-badge">:8085</span>
              </div>

              <button id="confirm-order-btn" className="btn btn-orange btn-full" onClick={handleCheckout} disabled={loading || cart.length === 0}>
                {loading ? '⏳ Đang xử lý...' : `⚡ Đặt hàng – ${cartTotal.toLocaleString('vi-VN')}₫`}
              </button>
            </>
          ) : (
            <>
              <div className="order-result">
                <div className="result-icon">{result.payment.status === 'success' ? '🎉' : '❌'}</div>
                <div className={`result-title ${result.payment.status === 'success' ? 'ok' : 'fail'}`}>
                  {result.payment.status === 'success' ? 'Đặt hàng thành công!' : 'Thanh toán thất bại'}
                </div>
              </div>
              <div className="result-detail">
                <div><span style={{ color: 'var(--text-muted)' }}>Mã đơn hàng</span><strong style={{ color: 'var(--orange)' }}>{result.order.id}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Mã giao dịch</span><span>{result.payment.transactionId || 'N/A'}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Tổng tiền</span><span>{result.total.toLocaleString('vi-VN')}₫</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Thanh toán</span><span>{PAYMENT_METHODS.find(m => m.id === result.payment.method)?.label}</span></div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>← Đóng</button>
                {result.payment.status !== 'success' && (
                  <button id="retry-pay-btn" className="btn btn-orange" style={{ flex: 1 }} onClick={() => setResult(null)}>🔄 Thử lại</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, updateQty, removeItem, cartTotal, setPage } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);

  if (cart.length === 0) return (
    <div className="page">
      <div className="section-title">🛒 Giỏ hàng</div>
      <div className="cart-empty">
        <div className="icon">🛒</div>
        <p>Giỏ hàng trống</p>
        <button className="btn btn-orange" style={{ marginTop: '1rem' }} onClick={() => setPage('products')}>Tiếp tục mua sắm</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="section-title">
        🛒 Giỏ hàng ({cart.length} sản phẩm)
        <span className="micro-badge">Cart Service :8083</span>
      </div>
      <div className="cart-layout">
        <div className="cart-table-wrap">
          <table className="cart-table">
            <thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.productId} id={`cart-row-${item.productId}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img className="cart-img" src={item.image} alt={item.name} onError={e => { e.target.src = 'https://placehold.co/56x56/f5f5f5/ee4d2d?text=?'; }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--orange)', fontWeight: 600 }}>{item.price.toLocaleString('vi-VN')}₫</td>
                  <td>
                    <div className="qty-ctrl">
                      <button className="qty-btn" id={`qty-dec-${item.productId}`} onClick={() => updateQty(item.productId, -1)}>−</button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                      <button className="qty-btn" id={`qty-inc-${item.productId}`} onClick={() => updateQty(item.productId, 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{(item.price * item.qty).toLocaleString('vi-VN')}₫</td>
                  <td><button className="del-btn" id={`del-${item.productId}`} onClick={() => removeItem(item.productId)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary-box">
          <div style={{ fontWeight: 700, marginBottom: '1rem' }}>Tóm tắt đơn hàng</div>
          {cart.map(i => (
            <div className="summary-row" key={i.productId}>
              <span style={{ fontSize: '0.82rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</span>
              <span>{(i.price * i.qty).toLocaleString('vi-VN')}₫</span>
            </div>
          ))}
          <div className="summary-row" style={{ paddingTop: '8px' }}>
            <span>Tổng cộng</span>
            <span>{cartTotal.toLocaleString('vi-VN')}₫</span>
          </div>
          <button id="checkout-btn" className="btn btn-orange btn-full" style={{ marginTop: '1rem' }} onClick={() => setShowCheckout(true)}>
            ⚡ Thanh toán
          </button>
          <button className="btn btn-ghost btn-full" style={{ marginTop: '8px' }} onClick={() => setPage('products')}>← Tiếp tục mua</button>
        </div>
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
}
