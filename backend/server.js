/**
 * server.js
 * Express Server (PostgreSQL + Prisma)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const apicache = require('apicache');
const cluster = require('cluster');
const os = require('os');
const { PrismaClient } = require('@prisma/client');
console.log("DB URL:", process.env.DATABASE_URL);
// Init Prisma
const prisma = new PrismaClient();

// Import routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const wellnessRoutes = require('./routes/wellness.routes');
const supportRoutes = require('./routes/support.routes');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Init app
const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(helmet());
app.use(compression());

// Keep-Alive connection header middleware
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=100');
  next();
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// =========================
// ROUTES
// =========================
const cacheMiddleware = process.env.NODE_ENV === 'test' 
  ? (req, res, next) => next() 
  : apicache.middleware('30 seconds');

app.use('/api/auth', authRoutes);
app.use('/api/students', cacheMiddleware, studentRoutes);
app.use('/api/assessments', cacheMiddleware, assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/support', supportRoutes);

// =========================
// HEALTH CHECK
// =========================
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'healthy',
      db: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      db: 'disconnected',
      error: error.message
    });
  }
});

// =========================
// ROOT
// =========================
app.get('/', (req, res) => {
  res.json({
    message: 'Campus Wellness Intelligence API (PostgreSQL + Prisma)',
    version: '3.0'
  });
});

// =========================
// 404 HANDLER
// =========================
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// =========================
// ERROR HANDLER
// =========================
app.use(errorHandler);

// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ PostgreSQL connected via Prisma');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (Worker ${process.pid})`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to DB:', error);
    process.exit(1);
  }
}

// Fixed 1 worker or 80% CPU logic (safe for free tier)
if (process.env.NODE_ENV !== 'test') {
  if (cluster.isMaster) {
    const WORKER_COUNT = Math.max(1, Math.floor(os.cpus().length * 0.8));
    console.log(`Master ${process.pid} is running. Forking ${WORKER_COUNT} workers...`);
    
    // For free tiers like Render, default to 1 if no env var
    const workersToFork = process.env.WORKER_COUNT || 1;
    
    for (let i = 0; i < workersToFork; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
      cluster.fork();
    });
  } else {
    startServer();
  }
}

// =========================
// GRACEFUL SHUTDOWN
// =========================
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// UNHANDLED ERRORS
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

module.exports = {
  app,
  prisma
};