import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import AnimatedOutlet from './AnimatedOutlet'

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth()
  const { itemCount } = useCart()

  return (
    <div className="app-shell">
      <header className="top-bar">
        <Link to="/" className="brand">
          <span className="brand-icon" aria-hidden>
            🥘
          </span>
          Căng tin nội bộ
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Thực đơn
          </NavLink>
          <NavLink to="/cart">
            Giỏ hàng {itemCount > 0 ? <span className="badge">{itemCount}</span> : null}
          </NavLink>
          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Đăng nhập</NavLink>
              <NavLink to="/register">Đăng ký</NavLink>
            </>
          ) : (
            <>
              <span className="user-pill">
                {user?.username}
                {user?.role === 'ADMIN' ? ' · ADMIN' : ''}
              </span>
              <button type="button" className="btn ghost" onClick={logout}>
                Đăng xuất
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        <AnimatedOutlet />
      </main>

      <footer className="footer">
        <small>Căng tin nội bộ</small>
      </footer>
    </div>
  )
}
