require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const bookingsRouter      = require('./routes/bookings');
const servicesRouter      = require('./routes/services');
const addonsRouter        = require('./routes/addons');
const zonesRouter         = require('./routes/zones');
const authRouter          = require('./routes/auth');
const adminBookingsRouter = require('./routes/adminBookings');
const settingsRouter      = require('./routes/settings');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ── CORS ─────────────────────────────────────────────────────────────────────
// In production the frontend is served by this same Express process,
// so CORS is only needed for external origins (dev, Postman, etc.)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',           authRouter);
app.use('/api/bookings',       bookingsRouter);
app.use('/api/services',       servicesRouter);
app.use('/api/addons',         addonsRouter);
app.use('/api/zones',          zonesRouter);
app.use('/api/admin/bookings', adminBookingsRouter);
app.use('/api/settings',       settingsRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Serve React frontend in production ────────────────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, '..', 'public');
  app.use(express.static(distPath, { maxAge: '7d' }));
  // SPA fallback — all non-API routes serve index.html
  app.get('*path', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
}

module.exports = app;
