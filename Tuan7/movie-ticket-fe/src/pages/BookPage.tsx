import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookingPoll } from "../hooks/useBookingPoll";
import * as api from "../api/client";
import type { Movie } from "../types";
import { isTerminalBookingStatus } from "../types";

export function BookPage() {
  const { token } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieId, setMovieId] = useState("");
  const [seatCount, setSeatCount] = useState(1);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { booking, error: pollErr } = useBookingPoll(activeId);

  useEffect(() => {
    void api.fetchMovies().then(setMovies).catch(() => setMovies([]));
  }, []);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: "/book" }} />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitErr(null);
    setCreating(true);
    setActiveId(null);
    try {
      const b = await api.createBooking({
        movieId,
        seatCount: Math.max(1, Math.floor(seatCount)),
      });
      setActiveId(b.id);
    } catch (ex) {
      setSubmitErr(
        ex instanceof Error ? ex.message : "Không tạo được booking"
      );
    } finally {
      setCreating(false);
    }
  }

  const status = booking?.status;
  const done = booking && isTerminalBookingStatus(booking.status);
  const success =
    done &&
    String(status).toUpperCase() !== "FAILED" &&
    String(status).toUpperCase() !== "BOOKING_FAILED";

  return (
    <div className="card wide">
      <div className="row between">
        <h1>Đặt vé</h1>
        <Link to="/movies" className="btn ghost">
          ← Danh sách phim
        </Link>
      </div>
      <p className="muted">
        POST <code>/v1/bookings</code> — Booking Service publish{" "}
        <strong>BOOKING_CREATED</strong>; Payment/Notification xử lý bất đồng bộ.
        Trang này poll <code>GET /v1/bookings/:id</code> để hiển thị kết quả thanh toán giả lập.
      </p>

      {!activeId && (
        <form onSubmit={onSubmit} className="form grid2">
          <label className="full">
            Phim
            <select
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              required
            >
              <option value="">— Chọn phim —</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Số ghế
            <input
              type="number"
              min={1}
              max={20}
              value={seatCount}
              onChange={(e) => setSeatCount(Number(e.target.value))}
            />
          </label>
          <div className="full">
            {submitErr && <p className="error">{submitErr}</p>}
            <button type="submit" className="btn primary" disabled={creating}>
              {creating ? "Đang tạo booking…" : "Tạo booking"}
            </button>
          </div>
        </form>
      )}

      {activeId && (
        <div className="panel">
          <h2>Booking #{activeId}</h2>
          {pollErr && <p className="error">{pollErr}</p>}
          {!booking && !pollErr && <p>Đang chờ phản hồi từ server…</p>}
          {booking && (
            <>
              <p>
                Trạng thái:{" "}
                <span className="badge">{String(booking.status)}</span>
              </p>
              {booking.message && (
                <p className="muted">{booking.message}</p>
              )}
              {done && (
                <div
                  className={success ? "notify success" : "notify fail"}
                  role="status"
                >
                  {success
                    ? `Đặt vé thành công — Booking #${booking.id}. (Notification service có thể log: User đã đặt đơn #${booking.id} thành công)`
                    : `Thanh toán thất bại — Booking #${booking.id}.`}
                </div>
              )}
            </>
          )}
          <p className="muted small full">
            Nếu backend chưa có GET theo id, nhờ thành viên Booking bổ sung hoặc
            trả về trạng thái cuối ngay trong POST.
          </p>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setActiveId(null);
              setSubmitErr(null);
            }}
          >
            Đặt vé khác
          </button>
        </div>
      )}
    </div>
  );
}
