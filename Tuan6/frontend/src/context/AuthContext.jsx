import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as userApi from '../api/userApi'

const USER_KEY = 'food_order_user'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  const setSession = useCallback((nextUser) => {
    setUser(nextUser)
    writeStoredUser(nextUser)
  }, [])

  const login = useCallback(
    async (username, password) => {
      const { user: u, raw } = await userApi.login(username, password)
      const merged =
        u ||
        (raw?.userId != null
          ? {
              id: raw.userId,
              username: raw.username ?? username,
              role: (raw.role || 'USER').toString().toUpperCase(),
            }
          : { id: raw?.id, username: username, role: 'USER' })
      if (merged?.id == null && merged?.username) {
        merged.id = merged.username
      }
      setSession(merged)
      return merged
    },
    [setSession]
  )

  const register = useCallback(async (payload) => {
    await userApi.register(payload)
  }, [])

  const logout = useCallback(() => {
    userApi.logout()
    setSession(null)
  }, [setSession])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
