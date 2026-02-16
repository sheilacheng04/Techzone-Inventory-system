// ============================================================================
// TechZone Inventory System - Express.js Backend Server
// ============================================================================
// Main server file that initializes MongoDB connection and starts API server
// 
// Usage:
//   npm install              # Install dependencies
//   npm run dev              # Start in development mode (with nodemon)
//   npm start                # Start in production mode
// ============================================================================

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import TechZoneDatabase from './mongodb-db.js';
import setupRoutes from './api-routes.js';

const app = express();
const db = new TechZoneDatabase();

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:8000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request Logging Middleware (Development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================================================
// STATIC FILE SERVING (Frontend)
// ============================================================================

// Serve frontend files from public directory
app.use(express.static('public'));

// Serve index.html for frontend route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// ============================================================================
// API ROUTES
// ============================================================================

console.log('Initializing API routes...');
setupRoutes(app, db);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

async function startServer() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await db.connect();
    console.log('✓ MongoDB connected successfully');

    // Start listening on port
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║           TechZone Inventory System Server                  ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log(`✓ Server running on   : http://localhost:${PORT}`);
      console.log(`✓ Environment         : ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Database            : MongoDB (TechZoneMongo)`);
      console.log(`✓ API Base URL        : http://localhost:${PORT}/api`);
      console.log(`✓ Health Check        : http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('Available endpoints:');
      console.log('  POST   /api/sales');
      console.log('  GET    /api/sales');
      console.log('  GET    /api/customers/analytics');
      console.log('  GET    /api/items/analytics');
      console.log('  GET    /api/cities/analytics');
      console.log('  GET    /api/activity-logs/feed');
      console.log('  GET    /api/reports/dashboard-kpis');
      console.log('  GET    /api/health');
      console.log('');
    });
  } catch (error) {
    console.error('');
    console.error('╔════════════════════════════════════════════════════════════╗');
    console.error('║           ✗ Server Startup Failed                          ║');
    console.error('╚════════════════════════════════════════════════════════════╝');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.message.includes('connection')) {
      console.error('MongoDB Connection Issues:');
      console.error('1. Verify MONGODB_URI in .env file');
      console.error('2. Check MongoDB Atlas cluster is running');
      console.error('3. Verify database user credentials');
      console.error('4. Check IP whitelist in MongoDB Atlas');
    }
    
    process.exit(1);
  }
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGINT', async () => {
  console.log('');
  console.log('Shutting down gracefully...');
  await db.disconnect();
  console.log('✓ Database connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('');
  console.log('Service interrupted, shutting down...');
  await db.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;
