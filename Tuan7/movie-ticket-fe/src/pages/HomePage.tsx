import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { token } = useAuth();
  return (
    <div className="hero card wide">
      <h1>Hệ thống đặt vé xem phim</h1>
      <p className="lead">
        Luồng demo: Đăng ký → <strong>USER_REGISTERED</strong> · Chọn phim đặt vé →{" "}
        <strong>BOOKING_CREATED</strong> · Payment ngẫu nhiên →{" "}
        <strong>PAYMENT_COMPLETED</strong> / <strong>BOOKING_FAILED</strong> ·
        Notification khi thành công.
      </p>
      <div className="row gap">
        <Link className="btn primary" to="/movies">
          Xem phim
        </Link>
        {!token ? (
          <Link className="btn secondary" to="/login">
            Đăng nhập
          </Link>
        ) : (
          <Link className="btn secondary" to="/book">
            Đặt vé
          </Link>
        )}
      </div>
    </div>
  );
}
