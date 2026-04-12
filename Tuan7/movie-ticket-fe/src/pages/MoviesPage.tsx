import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/client";
import type { Movie } from "../types";

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await api.fetchMovies();
        if (alive) setMovies(list);
      } catch (e) {
        if (alive)
          setErr(
            e instanceof Error ? e.message : "Không tải được danh sách phim"
          );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="card wide">
      <div className="row between">
        <h1>Danh sách phim</h1>
        <Link to="/book" className="btn secondary">
          Đặt vé
        </Link>
      </div>
      <p className="muted">
        GET <code>/v1/movies</code> qua Gateway. Movie Service thường chạy cổng 8082.
      </p>
      {loading && <p>Đang tải…</p>}
      {err && <p className="error">{err}</p>}
      {!loading && !err && movies.length === 0 && (
        <p className="muted">Chưa có phim. Nhờ thành viên Movie Service thêm dữ liệu mẫu.</p>
      )}
      <ul className="movie-grid">
        {movies.map((m) => (
          <li key={m.id} className="movie-tile">
            <h3>{m.title}</h3>
            {m.durationMinutes != null && (
              <p className="muted small">{m.durationMinutes} phút</p>
            )}
            {m.description && (
              <p className="small desc">{m.description}</p>
            )}
            <p className="mono small">id: {m.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
