// API base URLs (proxied through Vite dev server)
const API = {
  products: '/api/products',
  cart: '/api/cart',
  checkout: '/api/checkout',
  stock: '/api/stock',
};

export const getProducts = async () => {
  const res = await fetch(API.products);
  if (!res.ok) throw new Error('Không thể tải sản phẩm');
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`${API.products}/${id}`);
  if (!res.ok) throw new Error('Sản phẩm không tồn tại');
  return res.json();
};

export const getCart = async () => {
  const res = await fetch(API.cart);
  if (!res.ok) throw new Error('Không thể tải giỏ hàng');
  return res.json();
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await fetch(`${API.cart}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error('Không thể thêm vào giỏ hàng');
  return res.json();
};

export const removeCartItem = async (productId) => {
  const res = await fetch(`${API.cart}/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error('Lỗi xoá item');
  return res.json();
};

export const checkout = async () => {
  const res = await fetch(API.checkout, { method: 'POST' });
  if (!res.ok) throw new Error('Checkout thất bại');
  return res.json();
};

export const getStock = async (productId) => {
  const res = await fetch(`${API.stock}/${productId}`);
  if (!res.ok) throw new Error('Không thể lấy tồn kho');
  return res.json();
};
