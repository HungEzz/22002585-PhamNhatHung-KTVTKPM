import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      await register(username, password, email || undefined);
      setOk("Đăng ký thành công. Backend sẽ publish USER_REGISTERED. Bạn có thể đăng nhập.");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card narrow">
      <h1>Đăng ký</h1>
      <form onSubmit={onSubmit} className="form">
        <label>
          Tên đăng nhập
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            minLength={2}
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
            minLength={4}
          />
        </label>
        {err && <p className="error">{err}</p>}
        {ok && <p className="success">{ok}</p>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Đang xử lý…" : "Đăng ký"}
        </button>
      </form>
      <p className="muted small">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        {ok && (
          <>
            {" · "}
            <Link to="/login">Đi tới đăng nhập</Link>
          </>
        )}
      </p>
    </div>
  );
}
