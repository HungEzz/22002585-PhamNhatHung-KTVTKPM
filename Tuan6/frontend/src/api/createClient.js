import axios from 'axios'

const TOKEN_KEY = 'food_order_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function normalizeBaseURL(baseURL) {
  if (!baseURL) return baseURL
  const s = String(baseURL).replace(/\/+$/, '')
  return `${s}/`
}

export function createApiClient(baseURL) {
  const client = axios.create({
    baseURL: normalizeBaseURL(baseURL),
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  })

  client.interceptors.request.use((config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return client
}
