import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/users':    { target: 'http://localhost:8081', changeOrigin: true, rewrite: p => p.replace(/^\/api\/users/, '') },
      '/api/products': { target: 'http://localhost:8082', changeOrigin: true, rewrite: p => p.replace(/^\/api\/products/, '') },
      '/api/cart':     { target: 'http://localhost:8083', changeOrigin: true, rewrite: p => p.replace(/^\/api\/cart/, '') },
      '/api/orders':   { target: 'http://localhost:8084', changeOrigin: true, rewrite: p => p.replace(/^\/api\/orders/, '') },
      '/api/payments': { target: 'http://localhost:8085', changeOrigin: true, rewrite: p => p.replace(/^\/api\/payments/, '') },
    },
  },
})
