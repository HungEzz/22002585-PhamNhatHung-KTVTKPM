// API client – calls each microservice independently (no shared gateway)
const SVC = {
  users:    '/api/users',
  products: '/api/products',
  cart:     '/api/cart',
  orders:   '/api/orders',
  payments: '/api/payments',
};

function getToken() { return localStorage.getItem('token'); }
function authHeader() { const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {}; }

async function req(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data;
}

// ── User Service (:8081) ──────────────────────
export const register = (body) => req(`${SVC.users}/register`, { method: 'POST', body: JSON.stringify(body) });
export const login    = (body) => req(`${SVC.users}/login`,    { method: 'POST', body: JSON.stringify(body) });
export const getMe    = ()     => req(`${SVC.users}/me`);
export const getUsers = ()     => req(`${SVC.users}/users`);

// ── Product Service (:8082) ───────────────────
export const getProducts  = ()       => req(`${SVC.products}/products`);
export const getProduct   = (id)     => req(`${SVC.products}/products/${id}`);
export const createProduct = (body)  => req(`${SVC.products}/products`, { method: 'POST', body: JSON.stringify(body) });
export const updateProduct = (id, b) => req(`${SVC.products}/products/${id}`, { method: 'PUT', body: JSON.stringify(b) });

// ── Cart Service (:8083) ──────────────────────
export const getCart      = (userId) => req(`${SVC.cart}/cart/${userId}`);
export const addToCart    = (body)   => req(`${SVC.cart}/cart/add`,  { method: 'POST', body: JSON.stringify(body) });
export const removeFromCart = (body) => req(`${SVC.cart}/cart/item`, { method: 'DELETE', body: JSON.stringify(body) });

// ── Order Service (:8084) ─────────────────────
export const createOrder = (body) => req(`${SVC.orders}/orders`, { method: 'POST', body: JSON.stringify(body) });
export const getOrders   = ()     => req(`${SVC.orders}/orders`);

// ── Payment Service (:8085) ───────────────────
export const createPayment = (body) => req(`${SVC.payments}/payments`, { method: 'POST', body: JSON.stringify(body) });
