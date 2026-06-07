require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sensorRoutes = require('./routes/sensorRoutes');
const batchRoutes = require('./routes/batchRoutes');
const factoryRoutes = require('./routes/factoryRoutes');
const generalRoutes = require('./routes/generalRoutes');

const app = express();
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (corsOrigins.length === 0 || corsOrigins.includes('*')) return true;
  if (corsOrigins.includes(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    || /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/.test(origin)
    || /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}:\d+$/.test(origin)
    || /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/.test(origin);
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'SpectraLeaf backend is running at root URL',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'SpectraLeaf backend is running',
    data: {
      table: process.env.DYNAMODB_TABLE_NAME || 'FermentationData',
      region: process.env.AWS_REGION || 'us-east-1',
    },
  });
});


// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/sensor', sensorRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/factories', factoryRoutes);
app.use('/api/general', generalRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Unhandled error]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;

// Force deployment update to ap-south-1
