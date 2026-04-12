import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { lines, setQuantity, removeLine, total } = useCart()

  if (lines.length === 0) {
    return (
      <div className="narrow-page">
        <div className="card narrow">
          <h1>Giỏ hàng</h1>
          <p className="muted">Chưa có món nào.</p>
          <Link to="/" className="btn primary">
            Xem thực đơn
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Giỏ hàng</h1>
      <p className="muted">Kiểm tra lại số lượng trước khi đặt.</p>
      <ul className="cart-list">
        {lines.map((l, i) => (
          <li key={l.id} className="cart-row" style={{ animationDelay: `${i * 0.06}s` }}>
            <div>
              <strong>{l.name}</strong>
              <div className="muted small">{l.price.toLocaleString('vi-VN')} đ / phần</div>
            </div>
            <div className="cart-actions">
              <input
                type="number"
                min="1"
                value={l.quantity}
                onChange={(e) => setQuantity(l.id, e.target.value)}
              />
              <button type="button" className="btn ghost" onClick={() => removeLine(l.id)}>
                Xóa
              </button>
            </div>
            <div className="line-total">{(l.price * l.quantity).toLocaleString('vi-VN')} đ</div>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <p className="total">
          Tạm tính: <strong>{total.toLocaleString('vi-VN')} đ</strong>
        </p>
        <Link to="/checkout" className="btn primary">
          Đặt hàng
        </Link>
      </div>
    </div>
  )
}
