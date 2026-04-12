import { useEffect, useState } from 'react'
import * as foodApi from '../api/foodApi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function normalizeFood(raw) {
  const id = raw.id ?? raw.foodId
  const name = raw.name ?? raw.title ?? `Món #${id}`
  const price = Number(raw.price ?? 0)
  const description = raw.description ?? raw.desc ?? ''
  return { ...raw, id, name, price, description }
}

export default function MenuPage() {
  const { addToCart } = useCart()
  const { isAdmin } = useAuth()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [adminOpen, setAdminOpen] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', description: '' })
  const [adminError, setAdminError] = useState('')

  async function load() {
    setError('')
    setLoading(true)
    try {
      const list = await foodApi.fetchFoods()
      setFoods((Array.isArray(list) ? list : []).map(normalizeFood))
    } catch (err) {
      setError(err.message || 'Không tải được thực đơn')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreateFood(e) {
    e.preventDefault()
    setAdminError('')
    try {
      await foodApi.createFood({
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim() || undefined,
      })
      setForm({ name: '', price: '', description: '' })
      await load()
    } catch (err) {
      setAdminError(err.response?.data?.message || err.message || 'Thêm món thất bại')
    }
  }

  return (
    <div>
      <div className="page-head">
        <h1>Thực đơn</h1>
        <p className="muted">Hôm nay có gì ăn?</p>
      </div>

      {isAdmin ? (
        <div className="card admin-card">
          <button type="button" className="btn ghost" onClick={() => setAdminOpen((v) => !v)}>
            {adminOpen ? 'Thu gọn' : 'Thêm món mới'}
          </button>
          {adminOpen ? (
            <div className="admin-reveal">
            <form onSubmit={handleCreateFood} className="form inline-form">
              <input
                placeholder="Tên món"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                placeholder="Giá"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
              <input
                placeholder="Mô tả"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <button type="submit" className="btn secondary">
                Lưu
              </button>
            </form>
            </div>
          ) : null}
          {adminError ? <p className="error">{adminError}</p> : null}
        </div>
      ) : null}

      {loading ? (
        <div className="load-block">
          <div className="load-spinner" aria-hidden />
          <p>Đang tải thực đơn…</p>
        </div>
      ) : null}
      {error ? <p className="error">{error}</p> : null}

      <ul className="food-grid">
        {foods.map((f, index) => (
          <li key={f.id} className="food-card" style={{ '--stagger': index }}>
            <div className="food-card-thumb" aria-hidden>
              {f.name.trim().charAt(0) || '?'}
            </div>
            <div className="food-body">
              <h2>{f.name}</h2>
              {f.description ? <p className="muted small">{f.description}</p> : null}
              <p className="price">{f.price.toLocaleString('vi-VN')} đ</p>
            </div>
            <button type="button" className="btn primary" onClick={() => addToCart(f, 1)}>
              Thêm vào giỏ
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
