require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const SERVICES = {
  user:    process.env.USER_SERVICE_URL    || 'http://localhost:8081',
  tour:    process.env.TOUR_SERVICE_URL    || 'http://localhost:8082',
  booking: process.env.BOOKING_SERVICE_URL || 'http://localhost:8083',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:8084',
};

// ─────────────────────────────────────────────────────────
// MOCK DATA – fallback when downstream services are offline
// ─────────────────────────────────────────────────────────
const MOCK_USERS = {
  'user1': { id: 'user1', name: 'Nguyễn Văn An', email: 'an@example.com', phone: '0901234567' },
  'user2': { id: 'user2', name: 'Trần Thị Bình', email: 'binh@example.com', phone: '0912345678' },
  'demo':  { id: 'demo',  name: 'Demo User', email: 'demo@travelsoa.vn', phone: '0987654321' },
};

const MOCK_TOURS = {
  't1': { id: 't1', name: 'Đà Nẵng – Hội An 3N2Đ', price: 2990000, duration: '3 ngày 2 đêm',
          destination: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1559592413-7cbb4e0e9c4e?w=600',
          slots: 20, rating: 4.8, description: 'Khám phá Hội An cổ kính, tắm biển Mỹ Khê.' },
  't2': { id: 't2', name: 'Phú Quốc Thiên Đường 4N3Đ', price: 4990000, duration: '4 ngày 3 đêm',
          destination: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
          slots: 15, rating: 4.9, description: 'Biển xanh cát trắng, lặn ngắm san hô.' },
  't3': { id: 't3', name: 'Sapa Trekking 2N1Đ', price: 1890000, duration: '2 ngày 1 đêm',
          destination: 'Sapa', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600',
          slots: 25, rating: 4.7, description: 'Chinh phục ruộng bậc thang, trekking rừng nguyên sinh.' },
  't4': { id: 't4', name: 'Hạ Long Bay Cruise 3N2Đ', price: 5490000, duration: '3 ngày 2 đêm',
          destination: 'Quảng Ninh', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600',
          slots: 12, rating: 4.9, description: 'Du thuyền 5 sao khám phá vịnh di sản thế giới.' },
  't5': { id: 't5', name: 'Mũi Né Cồn Cát 2N1Đ', price: 1490000, duration: '2 ngày 1 đêm',
          destination: 'Bình Thuận', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
          slots: 30, rating: 4.6, description: 'Trượt cát đỏ, xem bình minh trên đồi cát.' },
  't6': { id: 't6', name: 'TP.HCM – Mekong 1N', price: 990000, duration: '1 ngày',
          destination: 'Tiền Giang', image: 'https://images.unsplash.com/photo-1582564286939-400a311013a2?w=600',
          slots: 40, rating: 4.5, description: 'Chèo thuyền kênh rạch, thưởng thức ẩm thực Nam Bộ.' },
};

// ─────────────────────────────────────────────────────────
// Helper: call a downstream service with fallback
// ─────────────────────────────────────────────────────────
async function callService(name, method, url, data = null) {
  const step = { service: name, url, method: method.toUpperCase(), status: 'pending', latency_ms: 0 };
  const t0 = Date.now();
  try {
    const cfg = { method, url, timeout: 3000, ...(data ? { data } : {}) };
    const res = await axios(cfg);
    step.status = 'success';
    step.latency_ms = Date.now() - t0;
    step.response = res.data;
    return { ok: true, data: res.data, step };
  } catch {
    step.status = 'fallback';
    step.latency_ms = Date.now() - t0;
    step.note = `${name} offline – using mock data`;
    return { ok: false, step };
  }
}

// ─────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Orchestrator', port: PORT, services: SERVICES });
});

// ─────────────────────────────────────────────────────────
// GET /tours  – Proxy to Tour Service (or mock)
// ─────────────────────────────────────────────────────────
app.get('/tours', async (req, res) => {
  const result = await callService('Tour Service', 'get', `${SERVICES.tour}/tours`);
  if (result.ok) return res.json(result.data);
  // fallback
  res.json({ success: true, source: 'orchestrator-mock', tours: Object.values(MOCK_TOURS) });
});

app.get('/tours/:id', async (req, res) => {
  const { id } = req.params;
  const result = await callService('Tour Service', 'get', `${SERVICES.tour}/tours/${id}`);
  if (result.ok) return res.json(result.data);
  const tour = MOCK_TOURS[id];
  if (!tour) return res.status(404).json({ error: 'Tour not found' });
  res.json({ success: true, source: 'orchestrator-mock', tour });
});

// ─────────────────────────────────────────────────────────
// POST /login – Proxy to User Service (or mock)
// ─────────────────────────────────────────────────────────
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.status(400).json({ error: 'Thiếu username' });

  const result = await callService('User Service', 'post', `${SERVICES.user}/login`, { username, password });
  if (result.ok) return res.json(result.data);

  // Mock login: accept any username, password = "demo" or matches username
  const user = MOCK_USERS[username] || {
    id: username,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    email: `${username}@travelsoa.vn`,
    phone: '0900000000',
  };
  res.json({ success: true, source: 'orchestrator-mock', token: `mock-token-${username}-${Date.now()}`, user });
});

// ─────────────────────────────────────────────────────────
// POST /book-tour  – ORCHESTRATION MAIN FLOW
// ─────────────────────────────────────────────────────────
/*
  Flow (Orchestration-Driven SOA):
  1. Validate user  → User Service
  2. Get tour info  → Tour Service
  3. Create booking → Booking Service
  4. Process payment → Payment Service
  5. Return result to Frontend
  NOTE: Services NEVER call each other. Only Orchestrator calls them.
*/
app.post('/book-tour', async (req, res) => {
  const { userId, tourId, passengers, paymentMethod, token } = req.body;
  const flowLog = [];
  const orchestrationId = `ORC-${Date.now()}`;

  console.log(`\n[Orchestrator] ▶ New booking flow ${orchestrationId}`);
  console.log(`  userId=${userId}, tourId=${tourId}, passengers=${passengers}`);

  // ── Step 1: Validate user ────────────────────────────
  console.log('[Orchestrator] Step 1 → User Service: validate user');
  const userResult = await callService(
    'User Service', 'get', `${SERVICES.user}/users/${userId}`
  );
  flowLog.push({ step: 1, name: 'Validate User', ...userResult.step });

  let user;
  if (userResult.ok) {
    user = userResult.data.user || userResult.data;
  } else {
    user = MOCK_USERS[userId] || { id: userId, name: 'Guest User', email: `${userId}@travelsoa.vn` };
    console.log('[Orchestrator] User Service offline → mock user');
  }

  // ── Step 2: Get tour info ────────────────────────────
  console.log('[Orchestrator] Step 2 → Tour Service: get tour details');
  const tourResult = await callService(
    'Tour Service', 'get', `${SERVICES.tour}/tours/${tourId}`
  );
  flowLog.push({ step: 2, name: 'Get Tour Info', ...tourResult.step });

  let tour;
  if (tourResult.ok) {
    tour = tourResult.data.tour || tourResult.data;
  } else {
    tour = MOCK_TOURS[tourId];
    if (!tour) {
      return res.status(404).json({ success: false, error: 'Tour không tồn tại', flowLog });
    }
    console.log('[Orchestrator] Tour Service offline → mock tour');
  }

  // ── Step 3: Create booking ───────────────────────────
  console.log('[Orchestrator] Step 3 → Booking Service: create booking');
  const bookingPayload = {
    userId: user.id,
    tourId: tour.id,
    tourName: tour.name,
    passengers: passengers || 1,
    totalPrice: tour.price * (passengers || 1),
    status: 'pending',
  };
  const bookingResult = await callService(
    'Booking Service', 'post', `${SERVICES.booking}/bookings`, bookingPayload
  );
  flowLog.push({ step: 3, name: 'Create Booking', ...bookingResult.step });

  let booking;
  if (bookingResult.ok) {
    booking = bookingResult.data.booking || bookingResult.data;
  } else {
    booking = {
      id: `BK-${Date.now()}`,
      ...bookingPayload,
      createdAt: new Date().toISOString(),
      source: 'orchestrator-mock',
    };
    console.log('[Orchestrator] Booking Service offline → mock booking');
  }

  // ── Step 4: Process payment ──────────────────────────
  console.log('[Orchestrator] Step 4 → Payment Service: process payment');
  const paymentPayload = {
    bookingId: booking.id,
    userId: user.id,
    amount: booking.totalPrice,
    method: paymentMethod || 'credit_card',
  };
  const paymentResult = await callService(
    'Payment Service', 'post', `${SERVICES.payment}/payments`, paymentPayload
  );
  flowLog.push({ step: 4, name: 'Process Payment', ...paymentResult.step });

  let payment;
  if (paymentResult.ok) {
    payment = paymentResult.data.payment || paymentResult.data;
  } else {
    // Simulate random success/fail (as per spec)
    const success = Math.random() > 0.2; // 80% success
    payment = {
      id: `PAY-${Date.now()}`,
      bookingId: booking.id,
      amount: booking.totalPrice,
      method: paymentMethod || 'credit_card',
      status: success ? 'success' : 'failed',
      source: 'orchestrator-mock',
      transactionId: success ? `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
    };
    console.log(`[Orchestrator] Payment Service offline → mock payment: ${payment.status}`);
  }

  // ── Step 5: Build final response ─────────────────────
  const finalStatus = payment.status === 'success' ? 'confirmed' : 'payment_failed';
  const response = {
    success: finalStatus === 'confirmed',
    orchestrationId,
    status: finalStatus,
    message: finalStatus === 'confirmed'
      ? '🎉 Đặt tour thành công! Cảm ơn bạn đã tin tưởng TravelSOA.'
      : '❌ Thanh toán thất bại. Vui lòng thử lại.',
    booking: { ...booking, status: finalStatus },
    payment,
    user: { id: user.id, name: user.name, email: user.email },
    tour: { id: tour.id, name: tour.name, destination: tour.destination },
    flowLog,
    timestamp: new Date().toISOString(),
  };

  console.log(`[Orchestrator] ✓ Flow complete: ${finalStatus}`);
  res.json(response);
});

// ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  Orchestrator Service  –  Port ${PORT}      ║`);
  console.log(`║  Orchestration-Driven SOA               ║`);
  console.log(`╚══════════════════════════════════════════╝`);
  console.log(`\nDownstream services:`);
  Object.entries(SERVICES).forEach(([k, v]) => console.log(`  ${k.padEnd(8)} → ${v}`));
  console.log(`\n[Note] Fallback mock data active for offline services.\n`);
});
