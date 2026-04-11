const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./src/config/db');
connectDB();

const app = express();

// ── Middlewares ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Static files (resume uploads) ─────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/candidates', require('./src/routes/candidates'));

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🚀 RecruitFlow API is running' });
});

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 RecruitFlow API running on http://localhost:${PORT}`);
  console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
  console.log(`💡 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
