import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { bookTour } from '../api';

const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Thẻ tín dụng', icon: '💳' },
  { id: 'momo',        label: 'MoMo',         icon: '📱' },
  { id: 'bank',        label: 'Chuyển khoản', icon: '🏦' },
];

const STEP_ICONS = { success: '✅', fallback: '⚠️', fail: '❌', pending: '⏳' };

export default function BookingModal({ tour, onClose }) {
  const { user, addToast } = useApp();
  const [passengers, setPassengers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const total = tour.price * passengers;

  const handleBook = async () => {
    setLoading(true);
    try {
      const data = await bookTour({
        userId: user.id,
        tourId: tour.id,
        passengers,
        paymentMethod,
        token: `token-${user.id}`,
      });
      setResult(data);
      if (data.success) addToast(`🎉 Đặt tour ${tour.name} thành công!`);
      else addToast('❌ Thanh toán thất bại, vui lòng thử lại', 'error');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>📋 {result ? 'Kết quả đặt tour' : 'Xác nhận đặt tour'}</h3>
          <button className="modal-close" id="booking-modal-close" onClick={onClose} disabled={loading}>✕</button>
        </div>

        <div className="modal-body">
          {/* Tour summary */}
          <div className="tour-summary">
            <img
              src={tour.image}
              alt={tour.name}
              onError={(e) => { e.target.src = `https://placehold.co/72x72/0d1526/2563eb?text=Tour`; }}
            />
            <div className="summary-info">
              <h4>{tour.name}</h4>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>📍 {tour.destination} · ⏱️ {tour.duration}</div>
              <div style={{ color: 'var(--primary-light)', fontWeight: 700, marginTop: '4px' }}>{tour.price?.toLocaleString('vi-VN')}₫/người</div>
            </div>
          </div>

          {!result ? (
            <>
              {/* Booking form */}
              <div className="form-group">
                <label className="form-label">Số hành khách</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button className="btn btn-secondary" style={{ padding: '8px 16px' }}
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}>−</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{passengers}</span>
                  <button className="btn btn-secondary" style={{ padding: '8px 16px' }}
                    onClick={() => setPassengers(Math.min(tour.slots, passengers + 1))}>+</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phương thức thanh toán</label>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map((pm) => (
                    <div
                      key={pm.id}
                      id={`pm-${pm.id}`}
                      className={`pm-option ${paymentMethod === pm.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(pm.id)}
                    >
                      <span className="pm-icon">{pm.icon}</span>
                      {pm.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="result-detail">
                <div className="info-row"><span>Tour</span><span>{tour.name}</span></div>
                <div className="info-row"><span>Khách</span><span>{user?.name}</span></div>
                <div className="info-row"><span>Hành khách</span><span>{passengers} người</span></div>
                <div className="info-row"><span>Đơn giá</span><span>{tour.price?.toLocaleString('vi-VN')}₫</span></div>
                <div className="info-row"><span>Tổng cộng</span><span>{total.toLocaleString('vi-VN')}₫</span></div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-card2)', padding: '8px 12px', borderRadius: '8px' }}>
                📡 Frontend → <strong style={{ color: 'var(--accent)' }}>Orchestrator</strong> → User → Tour → Booking → Payment
              </div>

              <button
                id="confirm-book-btn"
                className="btn btn-primary"
                style={{ padding: '13px' }}
                onClick={handleBook}
                disabled={loading}
              >
                {loading ? '⏳ Orchestrator đang xử lý...' : `⚡ Xác nhận đặt – ${total.toLocaleString('vi-VN')}₫`}
              </button>

              {/* Live flow during loading */}
              {loading && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>🎛️ Orchestrator đang điều phối...</div>
                  {['1. Xác thực User', '2. Lấy thông tin Tour', '3. Tạo Booking', '4. Xử lý Payment'].map((s, i) => (
                    <div key={i} style={{ animation: `fadeIn ${0.3 + i * 0.3}s ease` }}>{s}</div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Result */}
              <div className={`result-box ${result.success ? 'success' : 'fail'}`}>
                <div className="result-icon">{result.success ? '🎉' : '❌'}</div>
                <h3>{result.success ? 'Đặt tour thành công!' : 'Thanh toán thất bại'}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{result.message}</p>
              </div>

              {result.success && (
                <div className="result-detail">
                  <div className="info-row"><span style={{ color: 'var(--text-muted)' }}>Mã đặt chỗ</span><strong style={{ color: 'var(--accent)' }}>{result.booking?.id}</strong></div>
                  <div className="info-row"><span style={{ color: 'var(--text-muted)' }}>Mã giao dịch</span><span>{result.payment?.transactionId || 'N/A'}</span></div>
                  <div className="info-row"><span style={{ color: 'var(--text-muted)' }}>Tour</span><span>{result.tour?.name}</span></div>
                  <div className="info-row"><span style={{ color: 'var(--text-muted)' }}>Tổng tiền</span><span>{result.booking?.totalPrice?.toLocaleString('vi-VN')}₫</span></div>
                </div>
              )}

              {/* Orchestration flow log */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  🎛️ Orchestration Flow Log (ID: {result.orchestrationId})
                </div>
                <div className="flow-log">
                  {(result.flowLog || []).map((step) => (
                    <div key={step.step} className={`flow-step ${step.status}`}>
                      <span className="step-icon">{STEP_ICONS[step.status] || '⚙️'}</span>
                      <div className="step-info">
                        <div className="step-name">Step {step.step}: {step.name}</div>
                        <div className="step-meta">
                          {step.note || step.service} · {step.method} {step.url}
                        </div>
                      </div>
                      <span className="step-latency">{step.latency_ms}ms</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>← Quay lại</button>
                {!result.success && (
                  <button id="retry-book-btn" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setResult(null)}>
                    🔄 Thử lại
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
