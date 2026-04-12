import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useProxy = env.VITE_USE_PROXY === '1' || env.VITE_USE_PROXY === 'true'

  const userTarget = env.VITE_USER_SERVICE_URL || 'http://localhost:8081'
  const foodTarget = env.VITE_FOOD_SERVICE_URL || 'http://localhost:8082'
  const orderTarget = env.VITE_ORDER_SERVICE_URL || 'http://localhost:8083'
  const paymentTarget = env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      ...(useProxy
        ? {
            proxy: {
              '/api/user': {
                target: userTarget,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/user/, ''),
              },
              '/api/food': {
                target: foodTarget,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/food/, ''),
              },
              '/api/order': {
                target: orderTarget,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/order/, ''),
              },
              '/api/payment': {
                target: paymentTarget,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/payment/, ''),
              },
            },
          }
        : {}),
    },
  }
})
