import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/apiErrorMessage'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { username: username.trim(), password }
      if (email.trim()) payload.email = email.trim()
      await register(payload)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Đăng ký thất bại'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="narrow-page">
      <div className="card narrow">
        <h1>Đăng ký</h1>
        <p className="muted">Tạo tài khoản căng tin.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Tên đăng nhập
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              minLength={3}
              maxLength={50}
            />
          </label>
          <label>
            Email (tuỳ chọn)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            required
            minLength={6}
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Đang xử lý…' : 'Tạo tài khoản'}
          </button>
        </form>
        <p className="muted">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
