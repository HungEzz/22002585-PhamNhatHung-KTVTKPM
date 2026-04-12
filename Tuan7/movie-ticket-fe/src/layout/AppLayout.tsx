import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AppLayout() {
  const { user, logout, token } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Movie Ticket
        </Link>
        <nav className="nav">
          <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
            Phim
          </NavLink>
          {token && (
            <NavLink to="/book" className={({ isActive }) => (isActive ? "active" : "")}>
              Đặt vé
            </NavLink>
          )}
          {!token ? (
            <>
              <NavLink to="/login">Đăng nhập</NavLink>
              <NavLink to="/register">Đăng ký</NavLink>
            </>
          ) : (
            <span className="user-block">
              <span className="muted small">{user?.username}</span>
              <button type="button" className="btn ghost" onClick={logout}>
                Thoát
              </button>
            </span>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer muted small">
        Buổi 6 — Event-Driven · Frontend chỉ gọi một base URL (Gateway / Booking proxy)
      </footer>
    </div>
  );
}
