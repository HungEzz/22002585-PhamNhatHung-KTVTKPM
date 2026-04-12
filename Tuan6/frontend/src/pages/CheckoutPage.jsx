import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import * as orderApi from '../api/orderApi'
import * as paymentApi from '../api/paymentApi'
import ProtectedRoute from '../components/ProtectedRoute'

function CheckoutInner() {
  const { user } = useAuth()
  const { lines, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [method, setMethod] = useState('COD')
  const [step, setStep] = useState('order')
  const [orderId, setOrderId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const userId = user?.id

  async function createOrder() {
    setError('')
    setLoading(true)
    try {
      const items = lines.map((l) => ({
        foodId: l.id,
        quantity: l.quantity,
      }))
      const payload = {
        userId,
        items,
      }
      const data = await orderApi.createOrder(payload)
      const oid = data?.id ?? data?.orderId ?? data?.order?.id
      if (oid == null) {
        console.warn('Không lấy được mã đơn:', data)
      }
      setOrderId(oid)
      setStep('pay')
      setMessage('Đã tạo đơn. Chọn thanh toán.')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Tạo đơn thất bại'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  async function pay() {
    setError('')
    setLoading(true)
    try {
      const payMethod = method === 'BANKING' ? 'BANKING' : 'COD'
      const data = await paymentApi.pay({ orderId, method: payMethod })
      if (data?.status && data.status !== 'SUCCESS') {
        setError(data.message || 'Thanh toán không thành công')
        return
      }
      const name = user?.username || 'User'
      const notif = `${name} — đơn #${orderId} đã thanh toán xong (${payMethod}).`
      console.log(notif)
      setMessage(notif)
      clearCart()
      setStep('done')
    } catch (err) {
      const body = err.response?.data
      const msg =
        (body && typeof body === 'object' && body.message) ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Thanh toán thất bại'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  if (lines.length === 0 && step !== 'done') {
    return (
      <div className="narrow-page">
        <div className="card narrow">
          <h1>Đặt hàng</h1>
          <p className="muted">Giỏ đang trống.</p>
          <button type="button" className="btn primary" onClick={() => navigate('/cart')}>
            Về giỏ hàng
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h1>Đặt hàng & thanh toán</h1>
      <p className="muted">Xác nhận đơn rồi chọn cách thanh toán.</p>

      <ul className="summary">
        {lines.map((l) => (
          <li key={l.id}>
            {l.name} × {l.quantity} — {(l.price * l.quantity).toLocaleString('vi-VN')} đ
          </li>
        ))}
      </ul>
      <p className="total">Tổng: {total.toLocaleString('vi-VN')} đ</p>

      {step === 'order' ? (
        <div className="stack">
          <button type="button" className="btn primary" disabled={loading} onClick={createOrder}>
            {loading ? 'Đang tạo đơn…' : 'Xác nhận đơn'}
          </button>
        </div>
      ) : null}

      {step === 'pay' ? (
        <div className="stack">
          <fieldset>
            <legend>Phương thức thanh toán</legend>
            <label className="radio">
              <input
                type="radio"
                name="pay"
                checked={method === 'COD'}
                onChange={() => setMethod('COD')}
              />
              COD
            </label>
            <label className="radio">
              <input
                type="radio"
                name="pay"
                checked={method === 'BANKING'}
                onChange={() => setMethod('BANKING')}
              />
              Banking
            </label>
          </fieldset>
          <button type="button" className="btn primary" disabled={loading || orderId == null} onClick={pay}>
            {loading ? 'Đang thanh toán…' : `Thanh toán đơn #${orderId}`}
          </button>
        </div>
      ) : null}

      {step === 'done' ? (
        <div className="success-box pop-in">
          <p>{message}</p>
          <p className="muted small">Cảm ơn bạn.</p>
          <button type="button" className="btn secondary" onClick={() => navigate('/')}>
            Về thực đơn
          </button>
        </div>
      ) : null}

      {error ? <p className="error">{error}</p> : null}
      {message && step !== 'done' ? <p className="ok">{message}</p> : null}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutInner />
    </ProtectedRoute>
  )
}
