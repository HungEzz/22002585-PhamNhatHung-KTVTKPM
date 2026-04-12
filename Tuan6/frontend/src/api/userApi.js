import { createApiClient, setStoredToken } from './createClient'
import { env } from '../config/env'

const client = createApiClient(env.userService)

function pickToken(data) {
  if (!data || typeof data !== 'object') return null
  return data.token || data.accessToken || data.jwt || data.access_token || null
}

function tryDecodeJwtSubject(token) {
  if (!token || typeof token !== 'string' || token.split('.').length < 2) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.sub ?? payload.userId ?? payload.id ?? null
  } catch {
    return null
  }
}

function normalizeUser(data, token) {
  if (!data || typeof data !== 'object') return null
  const u = data.user ?? data
  const id = u.id ?? u.userId ?? (token ? tryDecodeJwtSubject(token) : null)
  const username = u.username ?? u.name
  const role = (u.role || u.authority || 'USER').toString().toUpperCase()
  if (id == null && !username) return null
  return { id, username, role: role.includes('ADMIN') ? 'ADMIN' : 'USER' }
}

export async function register(payload) {
  const body = {
    username: payload.username,
    password: payload.password,
  }
  if (payload.role) body.role = payload.role
  const { data } = await client.post('users/register', body)
  return data
}

export async function login(username, password) {
  const { data } = await client.post('users/login', { username, password })
  const token = pickToken(data)
  if (token) setStoredToken(token)
  const user = normalizeUser(data, token)
  return { token, user, raw: data }
}

export async function fetchUsers() {
  const { data } = await client.get('users')
  return Array.isArray(data) ? data : data?.content ?? data?.users ?? []
}

export function logout() {
  setStoredToken(null)
}
