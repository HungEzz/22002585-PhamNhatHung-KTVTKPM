import { useApp } from '../context/AppContext';

export default function OrderPage() {
  const { orderResult, setPage, cart } = useApp();

  if (!orderResult) {
    setPage('products');
    return null;
  }

  const items = orderResult.items || cart;
  const total = orderResult.total || 0;

  return (
    <div className="page">
      <div className="order-success">
        <div className="icon">🎉</div>
        <h2>Đặt hàng thành công!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Đơn hàng đã được xử lý qua <strong style={{ color: 'var(--primary)' }}>Space-Based Architecture</strong>
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          📡 Cart lấy từ Redis → PU3 Order → PU4 giảm stock → Trả kết quả ngay (không chờ DB)
        </p>

        <div className="order-card">
          <div className="order-row">
            <span style={{ color: 'var(--text-muted)' }}>Mã đơn hàng</span>
            <strong style={{ color: 'var(--secondary)' }}>{orderResult.orderId || 'ORD-' + Date.now()}</strong>
          </div>
          <div className="order-row">
            <span style={{ color: 'var(--text-muted)' }}>Thời gian</span>
            <span>{new Date(orderResult.timestamp || Date.now()).toLocaleString('vi-VN')}</span>
          </div>
          <div className="order-row">
            <span style={{ color: 'var(--text-muted)' }}>Nguồn xử lý</span>
            <span className="tag">{orderResult.source || 'redis-data-grid'}</span>
          </div>
          {items.map(({ product, quantity }) => (
            <div className="order-row" key={product.id}>
              <span>{product.name} × {quantity}</span>
              <span>{(product.price * quantity).toLocaleString('vi-VN')}₫</span>
            </div>
          ))}
          <div className="order-row">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString('vi-VN')}₫</span>
          </div>
        </div>

        <button
          id="back-shopping-btn"
          onClick={() => setPage('products')}
          style={{ padding: '12px 32px', borderRadius: '10px', background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
        >
          ← Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}
