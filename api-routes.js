// ============================================================================
// Express.js API Routes for TechZone Inventory System
// ============================================================================
// These routes handle all REST API calls for the POS system
// 
// Installation:
//   npm install express cors dotenv
// 
// Server setup (app.js):
//   const express = require('express');
//   const cors = require('cors');
//   const TechZoneDatabase = require('./mongodb-db');
//   const setupRoutes = require('./api-routes');
//   
//   const app = express();
//   const db = new TechZoneDatabase();
//   
//   app.use(cors());
//   app.use(express.json());
//   
//   setupRoutes(app, db);
//   
//   // Connect to database before starting server
//   db.connect().then(() => {
//     app.listen(3000, () => console.log('Server running on port 3000'));
//   });
// ============================================================================

module.exports = function setupRoutes(app, db) {

  // =========================================================================
  // SALES ENDPOINTS
  // =========================================================================

  /**
   * POST /api/sales
   * Create a new sale
   */
  app.post('/api/sales', async (req, res) => {
    try {
      const saleId = await db.createSale(req.body);
      res.status(201).json({
        success: true,
        message: 'Sale created successfully',
        saleId: saleId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   * Get sales by date range
   */
  app.get('/api/sales', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate and endDate query parameters are required'
        });
      }

      const sales = await db.getSalesByDateRange(startDate, endDate);
      res.status(200).json({
        success: true,
        count: sales.length,
        data: sales
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/sales/:phoneNumber
   * Get sales by customer phone number
   */
  app.get('/api/sales/:phoneNumber', async (req, res) => {
    try {
      const { phoneNumber } = req.params;
      const sales = await db.getSalesByCustomer(phoneNumber);
      res.status(200).json({
        success: true,
        count: sales.length,
        data: sales
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // INVENTORY ENDPOINTS
  // =========================================================================

  /**
   * POST /api/inventory-logs
   * Create an inventory log entry
   */
  app.post('/api/inventory-logs', async (req, res) => {
    try {
      const logId = await db.createInventoryLog(req.body);
      res.status(201).json({
        success: true,
        message: 'Inventory log created successfully',
        logId: logId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/inventory-logs/:itemId
   * Get inventory logs for a specific item
   */
  app.get('/api/inventory-logs/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const logs = await db.getInventoryLogsForItem(parseInt(itemId));
      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/inventory-logs/action/:action?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   * Get inventory logs by action and date range
   */
  app.get('/api/inventory-logs/action/:action', async (req, res) => {
    try {
      const { action } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate and endDate query parameters are required'
        });
      }

      const logs = await db.getInventoryLogsByAction(action, startDate, endDate);
      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // CUSTOMER ANALYTICS ENDPOINTS
  // =========================================================================

  /**
   * GET /api/customers/analytics
   * Get all customer analytics
   */
  app.get('/api/customers/analytics', async (req, res) => {
    try {
      const { limit = 100 } = req.query;
      const customers = await db.getTopCustomers(parseInt(limit));
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/customers/city/:city
   * Get customers by city
   */
  app.get('/api/customers/city/:city', async (req, res) => {
    try {
      const { city } = req.params;
      const customers = await db.getCustomersByCity(city);
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/customers/vip
   * Get VIP customers
   */
  app.get('/api/customers/vip', async (req, res) => {
    try {
      const vipCustomers = await db.getVIPCustomers();
      res.status(200).json({
        success: true,
        count: vipCustomers.length,
        data: vipCustomers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * PUT /api/customers/analytics/:phoneNumber
   * Create or update customer analytics
   */
  app.put('/api/customers/analytics/:phoneNumber', async (req, res) => {
    try {
      const { phoneNumber } = req.params;
      const result = await db.upsertCustomerAnalytics(phoneNumber, req.body);
      res.status(200).json({
        success: true,
        message: 'Customer analytics updated successfully',
        result: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // ITEM PERFORMANCE ENDPOINTS
  // =========================================================================

  /**
   * GET /api/items/analytics
   * Get top selling items
   */
  app.get('/api/items/analytics', async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const items = await db.getTopSellingItems(parseInt(limit));
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/items/low-stock
   * Get low stock items
   */
  app.get('/api/items/low-stock', async (req, res) => {
    try {
      const items = await db.getLowStockItems();
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/items/poor-performing
   * Get poor performing items
   */
  app.get('/api/items/poor-performing', async (req, res) => {
    try {
      const items = await db.getPoorPerformingItems();
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * PUT /api/items/analytics/:itemId
   * Create or update item performance analytics
   */
  app.put('/api/items/analytics/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const result = await db.upsertItemPerformance(parseInt(itemId), req.body);
      res.status(200).json({
        success: true,
        message: 'Item performance updated successfully',
        result: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // CITY ANALYTICS ENDPOINTS
  // =========================================================================

  /**
   * GET /api/cities/analytics
   * Get all city sales analytics
   */
  app.get('/api/cities/analytics', async (req, res) => {
    try {
      const cities = await db.getAllCityAnalytics();
      res.status(200).json({
        success: true,
        count: cities.length,
        data: cities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/cities/top
   * Get top selling cities
   */
  app.get('/api/cities/top', async (req, res) => {
    try {
      const { limit = 5 } = req.query;
      const cities = await db.getTopCities(parseInt(limit));
      res.status(200).json({
        success: true,
        count: cities.length,
        data: cities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * PUT /api/cities/analytics/:city
   * Create or update city sales analytics
   */
  app.put('/api/cities/analytics/:city', async (req, res) => {
    try {
      const { city } = req.params;
      const result = await db.upsertCitySalesAnalytics(city, req.body);
      res.status(200).json({
        success: true,
        message: 'City analytics updated successfully',
        result: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // ACTIVITY LOG ENDPOINTS
  // =========================================================================

  /**
   * POST /api/activity-logs
   * Create new activity log entry
   */
  app.post('/api/activity-logs', async (req, res) => {
    try {
      const logId = await db.createActivityLog(req.body);
      res.status(201).json({
        success: true,
        message: 'Activity logged successfully',
        logId: logId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/activity-logs/user/:username
   * Get activity logs by user
   */
  app.get('/api/activity-logs/user/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const { limit = 100 } = req.query;
      const logs = await db.getActivityLogsByUser(username, parseInt(limit));
      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/activity-logs/action/:action
   * Get activity logs by action
   */
  app.get('/api/activity-logs/action/:action', async (req, res) => {
    try {
      const { action } = req.params;
      const { limit = 100 } = req.query;
      const logs = await db.getActivityLogsByAction(action, parseInt(limit));
      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/activity-logs/feed
   * Get activity feed (latest activities)
   */
  app.get('/api/activity-logs/feed', async (req, res) => {
    try {
      const { limit = 100 } = req.query;
      const logs = await db.getActivityFeed(parseInt(limit));
      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // FINANCIAL ENDPOINTS
  // =========================================================================

  /**
   * POST /api/financial-snapshots
   * Create new financial snapshot
   */
  app.post('/api/financial-snapshots', async (req, res) => {
    try {
      const snapshotId = await db.createFinancialSnapshot(req.body);
      res.status(201).json({
        success: true,
        message: 'Financial snapshot created successfully',
        snapshotId: snapshotId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/financial-snapshots/latest
   * Get latest financial snapshot
   */
  app.get('/api/financial-snapshots/latest', async (req, res) => {
    try {
      const snapshot = await db.getLatestFinancialSnapshot();
      res.status(200).json({
        success: true,
        data: snapshot
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/financial-snapshots/:period
   * Get financial snapshots by period (daily/weekly/monthly)
   */
  app.get('/api/financial-snapshots/:period', async (req, res) => {
    try {
      const { period } = req.params;
      
      if (!['daily', 'weekly', 'monthly'].includes(period)) {
        return res.status(400).json({
          success: false,
          error: 'Period must be one of: daily, weekly, monthly'
        });
      }

      const snapshots = await db.getFinancialSnapshotsByPeriod(period);
      res.status(200).json({
        success: true,
        count: snapshots.length,
        data: snapshots
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // REPORTS & ANALYTICS ENDPOINTS
  // =========================================================================

  /**
   * GET /api/reports/dashboard-kpis?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   * Get dashboard KPIs for a date range
   */
  app.get('/api/reports/dashboard-kpis', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate and endDate query parameters are required'
        });
      }

      const kpis = await db.calculateDashboardKPIs(startDate, endDate);
      res.status(200).json({
        success: true,
        data: kpis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/reports/monthly?month=MM&year=YYYY
   * Get monthly performance report
   */
  app.get('/api/reports/monthly', async (req, res) => {
    try {
      const { month, year } = req.query;

      if (!month || !year) {
        return res.status(400).json({
          success: false,
          error: 'month and year query parameters are required'
        });
      }

      const report = await db.getMonthlyPerformanceReport(parseInt(month), parseInt(year));
      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/reports/daily-sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   * Get daily sales summary
   */
  app.get('/api/reports/daily-sales', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate and endDate query parameters are required'
        });
      }

      const sales = await db.getDailySalesSummary(startDate, endDate);
      res.status(200).json({
        success: true,
        count: sales.length,
        data: sales
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // =========================================================================
  // HEALTH CHECK
  // =========================================================================

  /**
   * GET /api/health
   * Health check endpoint
   */
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'TechZone API is running',
      timestamp: new Date().toISOString()
    });
  });

};
