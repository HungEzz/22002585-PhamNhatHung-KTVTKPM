import type { AuthUser, Booking, Movie } from "../types";

/**
 * Một cổng duy nhất: Gateway (khuyến nghị) hoặc Booking Service nếu nhóm route proxy.
 * Dev: để trống → dùng relative `/api` + proxy Vite (vite.config.ts).
 * LAN: ví dụ `http://192.168.1.10:8080` (không có dấu / cuối).
 */
function apiRoot(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "/api";
  return "";
}

const AUTH_TOKEN_KEY = "movie_ticket_token";

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const url = `${apiRoot()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(init?.json !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
  };
  const token = getToken();
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    ...init,
    headers: { ...headers, ...init?.headers },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : typeof data === "string"
          ? data
          : res.statusText;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data as T;
}

/** Đăng ký — User Service publish USER_REGISTERED */
export async function register(body: {
  username: string;
  password: string;
  email?: string;
}): Promise<{ message?: string }> {
  return request("/v1/auth/register", { method: "POST", json: body });
}

/** Đăng nhập — trả về JWT hoặc token tùy backend */
export async function login(body: {
  username: string;
  password: string;
}): Promise<{ token: string; user?: AuthUser }> {
  return request("/v1/auth/login", { method: "POST", json: body });
}

export async function fetchMovies(): Promise<Movie[]> {
  const raw = await request<Movie[] | { content?: Movie[]; movies?: Movie[] }>(
    "/v1/movies",
    { method: "GET" }
  );
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.content)) return raw.content;
  if (raw && Array.isArray(raw.movies)) return raw.movies;
  return [];
}

export async function createBooking(body: {
  movieId: string;
  seatCount: number;
}): Promise<Booking> {
  return request("/v1/bookings", { method: "POST", json: body });
}

export async function fetchBookings(): Promise<Booking[]> {
  const raw = await request<
    Booking[] | { content?: Booking[]; bookings?: Booking[] }
  >("/v1/bookings", { method: "GET" });
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.content)) return raw.content;
  if (raw && Array.isArray(raw.bookings)) return raw.bookings;
  return [];
}

export async function fetchBookingById(id: string): Promise<Booking> {
  return request(`/v1/bookings/${encodeURIComponent(id)}`, { method: "GET" });
}
