import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(username, password);
      nav("/movies");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card narrow">
      <h1>Đăng nhập</h1>
      <p className="muted">Sau khi User Service (8081) hoặc Gateway route xong, form này gọi một base URL duy nhất.</p>
      <form onSubmit={onSubmit} className="form">
        <label>
          Tên đăng nhập
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {err && <p className="error">{err}</p>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Đang xử lý…" : "Đăng nhập"}
        </button>
      </form>
      <p className="muted small">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}
