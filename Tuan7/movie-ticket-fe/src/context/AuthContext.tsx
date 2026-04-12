import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "../types";
import * as api from "../api/client";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, p: string, email?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("movie_ticket_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => api.getToken());

  const logout = useCallback(() => {
    api.setToken(null);
    localStorage.removeItem("movie_ticket_user");
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.login({ username, password });
    api.setToken(res.token);
    setToken(res.token);
    const u: AuthUser =
      res.user ??
      (() => {
        try {
          const payload = JSON.parse(
            atob(res.token.split(".")[1] ?? "")
          ) as Record<string, unknown>;
          return {
            id: String(payload.sub ?? payload.userId ?? payload.id ?? ""),
            username: String(payload.username ?? payload.name ?? username),
          };
        } catch {
          return { id: "", username };
        }
      })();
    if (u.id || u.username) {
      setUser(u);
      localStorage.setItem("movie_ticket_user", JSON.stringify(u));
    }
  }, []);

  const register = useCallback(
    async (username: string, password: string, email?: string) => {
      await api.register({ username, password, email });
    },
    []
  );

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
