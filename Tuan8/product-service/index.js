require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// ── Sample data (also seeded into Redis if available) ──
const SEED_PRODUCTS = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 28990000, originalPrice: 34990000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    category: 'Điện thoại', stock: 50, rating: 4.9, sold: 1200,
    description: 'iPhone 15 Pro Max 256GB – Chip A17 Pro, Camera 48MP, màn hình Super Retina XDR 6.7 inch.' },
  { id: '2', name: 'Samsung Galaxy S24 Ultra', price: 26990000, originalPrice: 31990000,
    image: 'https://images.unsplash.com/photo-1706525715238-53db4b3de921?w=400',
    category: 'Điện thoại', stock: 35, rating: 4.8, sold: 980,
    description: 'Samsung Galaxy S24 Ultra 256GB – Snapdragon 8 Gen 3, S-Pen, Camera 200MP.' },
  { id: '3', name: 'MacBook Air M3', price: 27490000, originalPrice: 32490000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'Laptop', stock: 20, rating: 4.9, sold: 540,
    description: 'MacBook Air M3 8GB RAM 256GB SSD – Mỏng nhẹ, hiệu năng vượt trội, pin 18 giờ.' },
  { id: '4', name: 'Sony WH-1000XM5', price: 7490000, originalPrice: 9490000,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    category: 'Tai nghe', stock: 80, rating: 4.8, sold: 2300,
    description: 'Tai nghe chống ồn Sony WH-1000XM5 – ANC hàng đầu, pin 30 giờ.' },
  { id: '5', name: 'iPad Pro M4 11"', price: 21990000, originalPrice: 25990000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    category: 'Máy tính bảng', stock: 25, rating: 4.9, sold: 670,
    description: 'iPad Pro M4 11 inch 256GB Wi-Fi – Chip M4, màn hình OLED ProMotion 120Hz.' },
  { id: '6', name: 'Apple Watch Series 10', price: 11490000, originalPrice: 13990000,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    category: 'Đồng hồ', stock: 60, rating: 4.7, sold: 890,
    description: 'Apple Watch Series 10 GPS 46mm – Màn hình lớn hơn, mỏng hơn.' },
  { id: '7', name: 'ASUS ROG Zephyrus G14', price: 35990000, originalPrice: 42990000,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    category: 'Laptop', stock: 15, rating: 4.8, sold: 320,
    description: 'ASUS ROG Zephyrus G14 – AMD Ryzen 9, RTX 4060, màn hình QHD 165Hz.' },
  { id: '8', name: 'AirPods Pro 2', price: 5990000, originalPrice: 7490000,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    category: 'Tai nghe', stock: 100, rating: 4.8, sold: 3100,
    description: 'AirPods Pro thế hệ 2 – ANC nâng cao, chip H2, âm thanh Spatial Audio.' },
];

// ── In-memory Data Grid (fallback when Redis not available) ──
// This simulates the Redis Data Grid behavior in memory
const memoryGrid = new Map();
let redisClient = null;
let usingRedis = false;

function initMemoryGrid() {
  for (const p of SEED_PRODUCTS) {
    memoryGrid.set(`product:${p.id}`, JSON.stringify(p));
    memoryGrid.set(`stock:${p.id}`, String(p.stock));
  }
  memoryGrid.set('products:list', JSON.stringify(SEED_PRODUCTS.map((p) => p.id)));
  console.log('[PU1] In-Memory Data Grid initialized with', SEED_PRODUCTS.length, 'products');
}

async function tryConnectRedis() {
  try {
    const { createClient } = require('redis');
    const client = createClient({ url: REDIS_URL, socket: { connectTimeout: 3000 } });
    client.on('error', () => {}); // suppress
    await client.connect();
    redisClient = client;
    usingRedis = true;

    // Seed into Redis
    const exists = await redisClient.exists('products:list');
    if (!exists) {
      const pipeline = redisClient.multi();
      for (const p of SEED_PRODUCTS) {
        pipeline.set(`product:${p.id}`, JSON.stringify(p));
        pipeline.set(`stock:${p.id}`, String(p.stock));
      }
      pipeline.set('products:list', JSON.stringify(SEED_PRODUCTS.map((p) => p.id)));
      await pipeline.exec();
    }
    console.log('[PU1] Connected to Redis Data Grid at', REDIS_URL);
  } catch {
    usingRedis = false;
    console.log('[PU1] Redis not available → using In-Memory Data Grid (fallback)');
    initMemoryGrid();
  }
}

// ── Grid helpers (Redis or Memory) ──
async function gridGet(key) {
  if (usingRedis) return redisClient.get(key);
  return memoryGrid.get(key) || null;
}
async function gridSet(key, value) {
  if (usingRedis) return redisClient.set(key, value);
  memoryGrid.set(key, value);
}

// ── Routes ──────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PU1-Product', dataGrid: usingRedis ? 'redis' : 'memory', port: PORT });
});

// GET /products – Load danh sách sản phẩm từ Data Grid (KHÔNG đọc DB)
app.get('/products', async (req, res) => {
  try {
    const t0 = Date.now();
    const idsJson = await gridGet('products:list');
    if (!idsJson) return res.status(404).json({ error: 'No products in Data Grid' });

    const ids = JSON.parse(idsJson);
    const products = [];
    for (const id of ids) {
      const [pJson, stockStr] = await Promise.all([
        gridGet(`product:${id}`),
        gridGet(`stock:${id}`),
      ]);
      if (pJson) {
        const p = JSON.parse(pJson);
        p.stock = parseInt(stockStr || '0', 10);
        products.push(p);
      }
    }

    const latency = Date.now() - t0;
    console.log(`[PU1] GET /products → ${products.length} items, ${latency}ms (${usingRedis ? 'Redis' : 'Memory Grid'})`);
    res.json({ success: true, source: usingRedis ? 'redis-data-grid' : 'memory-data-grid', latency_ms: latency, count: products.length, products });
  } catch (err) {
    console.error('[PU1]', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id – Xem chi tiết
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const t0 = Date.now();
    const [pJson, stockStr] = await Promise.all([
      gridGet(`product:${id}`),
      gridGet(`stock:${id}`),
    ]);
    if (!pJson) return res.status(404).json({ error: `Product ${id} not found` });

    const product = JSON.parse(pJson);
    product.stock = parseInt(stockStr || '0', 10);

    const latency = Date.now() - t0;
    console.log(`[PU1] GET /products/${id} → ${latency}ms`);
    res.json({ success: true, source: usingRedis ? 'redis-data-grid' : 'memory-data-grid', latency_ms: latency, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /products/seed – Re-seed
app.post('/products/seed', async (req, res) => {
  initMemoryGrid();
  if (usingRedis) {
    await redisClient.del('products:list');
    const pipeline = redisClient.multi();
    for (const p of SEED_PRODUCTS) {
      pipeline.set(`product:${p.id}`, JSON.stringify(p));
      pipeline.set(`stock:${p.id}`, String(p.stock));
    }
    pipeline.set('products:list', JSON.stringify(SEED_PRODUCTS.map((p) => p.id)));
    await pipeline.exec();
  }
  res.json({ success: true, message: 'Data Grid re-seeded', count: SEED_PRODUCTS.length });
});

// ── Start ────────────────────────────────────────
tryConnectRedis().then(() => {
  app.listen(PORT, () => {
    console.log(`[PU1] Product Processing Unit running on http://localhost:${PORT}`);
    console.log(`[PU1] Data Grid mode: ${usingRedis ? 'Redis @ ' + REDIS_URL : 'In-Memory'}`);
  });
});
