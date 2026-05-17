// API client – Frontend ONLY calls Orchestrator (port 8080 via proxy)
const BASE = '/api';

export async function login(username, password) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Đăng nhập thất bại');
  return res.json();
}

export async function getTours() {
  const res = await fetch(`${BASE}/tours`);
  if (!res.ok) throw new Error('Không thể tải danh sách tour');
  return res.json();
}

export async function getTour(id) {
  const res = await fetch(`${BASE}/tours/${id}`);
  if (!res.ok) throw new Error('Tour không tồn tại');
  return res.json();
}

export async function bookTour(payload) {
  const res = await fetch(`${BASE}/book-tour`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Đặt tour thất bại');
  return res.json();
}
