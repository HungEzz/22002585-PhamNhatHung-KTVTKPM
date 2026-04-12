const trimSlash = (url) => (url || '').replace(/\/+$/, '')

const useProxy =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_PROXY === '1' || import.meta.env.VITE_USE_PROXY === 'true')

function baseUrl(viteKey, fallback, proxyPrefix) {
  if (useProxy) return proxyPrefix
  return trimSlash(import.meta.env[viteKey] || fallback)
}

export const env = {
  userService: baseUrl('VITE_USER_SERVICE_URL', 'http://localhost:8081', '/api/user'),
  foodService: baseUrl('VITE_FOOD_SERVICE_URL', 'http://localhost:8082', '/api/food'),
  orderService: baseUrl('VITE_ORDER_SERVICE_URL', 'http://localhost:8083', '/api/order'),
  paymentService: baseUrl('VITE_PAYMENT_SERVICE_URL', 'http://localhost:8084', '/api/payment'),
}
