// ============================================================================
// MongoDB Connection and Database Operations Module
// ============================================================================
// This module provides a bridge between the frontend and MongoDB backend
// 
// Installation:
//   npm install mongodb dotenv
// 
// Environment variables (.env):
//   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/TechZoneMongo
//   ============================================================================

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

class TechZoneDatabase {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {};
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db('TechZoneMongo');
      
      // Cache collection references
      this.collections = {
        // Analytics
        dailySalesSummary: this.db.collection('daily_sales_summary'),
        citySalesAnalytics: this.db.collection('city_sales_analytics'),
        cityCustomerDistribution: this.db.collection('city_customer_distribution'),
        customerAnalytics: this.db.collection('customer_analytics'),
        itemPerformanceAnalytics: this.db.collection('item_performance_analytics'),
        inventoryHealthAnalytics: this.db.collection('inventory_health_analytics'),
        financialSnapshots: this.db.collection('financial_snapshots'),
        supplierAnalytics: this.db.collection('supplier_analytics'),
        
        // Logs
        salesLogs: this.db.collection('sales_logs'),
        inventoryLogs: this.db.collection('inventory_logs'),
        returnLogs: this.db.collection('return_logs'),
        systemActivityLogs: this.db.collection('system_activity_logs')
      };
      
      console.log('✓ Connected to MongoDB successfully');
      return true;
    } catch (error) {
      console.error('✗ MongoDB connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('✓ Disconnected from MongoDB');
    }
  }

  // =========================================================================
  // SALES OPERATIONS
  // =========================================================================

  /**
   * Create a new sale record
   */
  async createSale(saleData) {
    try {
      const result = await this.collections.salesLogs.insertOne({
        ...saleData,
        created_at: new Date(),
        updated_at: new Date()
      });
      return result.insertedId;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  /**
   * Get sales by date range
   */
  async getSalesByDateRange(startDate, endDate) {
    try {
      return await this.collections.salesLogs
        .find({
          sale_date: { $gte: startDate, $lte: endDate }
        })
        .sort({ sale_date: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  /**
   * Get sales by customer
   */
  async getSalesByCustomer(phoneNumber) {
    try {
      return await this.collections.salesLogs
        .find({ 'customer.phone': phoneNumber })
        .sort({ sale_date: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching customer sales:', error);
      throw error;
    }
  }

  // =========================================================================
  // INVENTORY OPERATIONS
  // =========================================================================

  /**
   * Log an inventory action
   */
  async createInventoryLog(logData) {
    try {
      const result = await this.collections.inventoryLogs.insertOne({
        ...logData,
        created_at: new Date()
      });
      return result.insertedId;
    } catch (error) {
      console.error('Error creating inventory log:', error);
      throw error;
    }
  }

  /**
   * Get inventory logs for an item
   */
  async getInventoryLogsForItem(itemId) {
    try {
      return await this.collections.inventoryLogs
        .find({ item_id: itemId })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching inventory logs:', error);
      throw error;
    }
  }

  /**
   * Get inventory actions by date range
   */
  async getInventoryLogsByAction(action, startDate, endDate) {
    try {
      return await this.collections.inventoryLogs
        .find({
          action: action,
          created_at: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching inventory logs by action:', error);
      throw error;
    }
  }

  // =========================================================================
  // CUSTOMER ANALYTICS OPERATIONS
  // =========================================================================

  /**
   * Create or update customer analytics
   */
  async upsertCustomerAnalytics(phoneNumber, customerData) {
    try {
      const result = await this.collections.customerAnalytics.updateOne(
        { phone: phoneNumber },
        { $set: { ...customerData, updated_at: new Date() } },
        { upsert: true }
      );
      return result.upsertedId || result.modifiedCount;
    } catch (error) {
      console.error('Error upserting customer analytics:', error);
      throw error;
    }
  }

  /**
   * Get top customers by spending
   */
  async getTopCustomers(limit = 10) {
    try {
      return await this.collections.customerAnalytics
        .find({})
        .sort({ total_spent: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching top customers:', error);
      throw error;
    }
  }

  /**
   * Get customers by city
   */
  async getCustomersByCity(city) {
    try {
      return await this.collections.customerAnalytics
        .find({ city: city })
        .sort({ total_spent: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching customers by city:', error);
      throw error;
    }
  }

  /**
   * Get VIP customers
   */
  async getVIPCustomers() {
    try {
      return await this.collections.customerAnalytics
        .find({ customer_segment: 'VIP' })
        .toArray();
    } catch (error) {
      console.error('Error fetching VIP customers:', error);
      throw error;
    }
  }

  // =========================================================================
  // ITEM PERFORMANCE OPERATIONS
  // =========================================================================

  /**
   * Create or update item performance analytics
   */
  async upsertItemPerformance(itemId, performanceData) {
    try {
      const result = await this.collections.itemPerformanceAnalytics.updateOne(
        { item_id: itemId },
        { $set: { ...performanceData, updated_at: new Date() } },
        { upsert: true }
      );
      return result.upsertedId || result.modifiedCount;
    } catch (error) {
      console.error('Error upserting item performance:', error);
      throw error;
    }
  }

  /**
   * Get top selling items
   */
  async getTopSellingItems(limit = 10) {
    try {
      return await this.collections.itemPerformanceAnalytics
        .find({})
        .sort({ total_quantity_sold: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching top selling items:', error);
      throw error;
    }
  }

  /**
   * Get low stock items
   */
  async getLowStockItems() {
    try {
      return await this.collections.itemPerformanceAnalytics
        .find({
          $expr: { $lte: ['$current_stock', '$reorder_point'] }
        })
        .toArray();
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }

  /**
   * Get poor performing items
   */
  async getPoorPerformingItems() {
    try {
      return await this.collections.itemPerformanceAnalytics
        .find({ performance_rating: { $in: ['Fair', 'Poor'] } })
        .toArray();
    } catch (error) {
      console.error('Error fetching poor performing items:', error);
      throw error;
    }
  }

  // =========================================================================
  // CITY ANALYTICS OPERATIONS
  // =========================================================================

  /**
   * Create or update city sales analytics
   */
  async upsertCitySalesAnalytics(city, analyticsData) {
    try {
      const result = await this.collections.citySalesAnalytics.updateOne(
        { city: city },
        { $set: { ...analyticsData, updated_at: new Date() } },
        { upsert: true }
      );
      return result.upsertedId || result.modifiedCount;
    } catch (error) {
      console.error('Error upserting city sales analytics:', error);
      throw error;
    }
  }

  /**
   * Get all cities with analytics
   */
  async getAllCityAnalytics() {
    try {
      return await this.collections.citySalesAnalytics
        .find({})
        .sort({ total_sales_amount: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching city analytics:', error);
      throw error;
    }
  }

  /**
   * Get top selling cities
   */
  async getTopCities(limit = 5) {
    try {
      return await this.collections.citySalesAnalytics
        .find({})
        .sort({ total_sales_amount: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching top cities:', error);
      throw error;
    }
  }

  // =========================================================================
  // SYSTEM ACTIVITY OPERATIONS
  // =========================================================================

  /**
   * Log system activity
   */
  async createActivityLog(activityData) {
    try {
      const result = await this.collections.systemActivityLogs.insertOne({
        ...activityData,
        created_at: new Date(),
        timestamp: Date.now()
      });
      return result.insertedId;
    } catch (error) {
      console.error('Error creating activity log:', error);
      throw error;
    }
  }

  /**
   * Get activity logs by user
   */
  async getActivityLogsByUser(username, limit = 100) {
    try {
      return await this.collections.systemActivityLogs
        .find({ username: username })
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  }

  /**
   * Get activity logs by action
   */
  async getActivityLogsByAction(action, limit = 100) {
    try {
      return await this.collections.systemActivityLogs
        .find({ action: action })
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching activity logs by action:', error);
      throw error;
    }
  }

  /**
   * Get activity feed (all actions)
   */
  async getActivityFeed(limit = 100) {
    try {
      return await this.collections.systemActivityLogs
        .find({})
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      throw error;
    }
  }

  // =========================================================================
  // FINANCIAL SNAPSHOT OPERATIONS
  // =========================================================================

  /**
   * Create financial snapshot
   */
  async createFinancialSnapshot(snapshotData) {
    try {
      const result = await this.collections.financialSnapshots.insertOne({
        ...snapshotData,
        created_at: new Date()
      });
      return result.insertedId;
    } catch (error) {
      console.error('Error creating financial snapshot:', error);
      throw error;
    }
  }

  /**
   * Get latest financial snapshot
   */
  async getLatestFinancialSnapshot() {
    try {
      const snapshot = await this.collections.financialSnapshots
        .findOne({}, { sort: { snapshot_date: -1 } });
      return snapshot;
    } catch (error) {
      console.error('Error fetching latest financial snapshot:', error);
      throw error;
    }
  }

  /**
   * Get financial snapshots by period
   */
  async getFinancialSnapshotsByPeriod(period) {
    try {
      return await this.collections.financialSnapshots
        .find({ snapshot_period: period })
        .sort({ snapshot_date: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching financial snapshots:', error);
      throw error;
    }
  }

  // =========================================================================
  // AGGREGATION QUERIES
  // =========================================================================

  /**
   * Get daily sales summary
   */
  async getDailySalesSummary(startDate, endDate) {
    try {
      return await this.collections.dailySalesSummary
        .find({
          date: { $gte: startDate, $lte: endDate }
        })
        .sort({ date: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching daily sales summary:', error);
      throw error;
    }
  }

  /**
   * Calculate dashboard KPIs
   */
  async calculateDashboardKPIs(startDate, endDate) {
    try {
      const [sales, returns, inventory] = await Promise.all([
        this.collections.salesLogs.aggregate([
          {
            $match: {
              sale_date: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: null,
              total_sales: { $sum: '$total_amount' },
              total_profit: { $sum: '$total_profit' },
              transaction_count: { $sum: 1 },
              avg_transaction: { $avg: '$total_amount' }
            }
          }
        ]).toArray(),
        
        this.collections.returnLogs.countDocuments({
          return_date: { $gte: startDate, $lte: endDate }
        }),
        
        this.collections.itemPerformanceAnalytics.aggregate([
          {
            $group: {
              _id: null,
              total_inventory_value: { $sum: { $multiply: ['$current_stock', '$cost_per_unit'] } },
              total_items: { $sum: 1 },
              low_stock_count: {
                $sum: {
                  $cond: [{ $lte: ['$current_stock', '$reorder_point'] }, 1, 0]
                }
              }
            }
          }
        ]).toArray()
      ]);

      return {
        sales: sales[0] || {},
        returns: returns,
        inventory: inventory[0] || {}
      };
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      throw error;
    }
  }

  /**
   * Generate monthly performance report
   */
  async getMonthlyPerformanceReport(month, year) {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      return await this.collections.salesLogs.aggregate([
        {
          $match: {
            sale_date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $facet: {
            sales_summary: [
              {
                $group: {
                  _id: null,
                  total_sales: { $sum: '$total_amount' },
                  total_profit: { $sum: '$total_profit' },
                  transaction_count: { $sum: 1 },
                  avg_transaction: { $avg: '$total_amount' }
                }
              }
            ],
            top_items: [
              { $unwind: '$items' },
              {
                $group: {
                  _id: '$items.item_name',
                  quantity_sold: { $sum: '$items.quantity' },
                  revenue: { $sum: '$items.line_total' }
                }
              },
              { $sort: { quantity_sold: -1 } },
              { $limit: 10 }
            ],
            top_customers: [
              {
                $group: {
                  _id: '$customer.name',
                  total_spent: { $sum: '$total_amount' },
                  purchase_count: { $sum: 1 }
                }
              },
              { $sort: { total_spent: -1 } },
              { $limit: 10 }
            ],
            city_performance: [
              {
                $group: {
                  _id: '$items.city',
                  total_sales: { $sum: '$total_amount' },
                  transaction_count: { $sum: 1 }
                }
              },
              { $sort: { total_sales: -1 } }
            ]
          }
        }
      ]).toArray();
    } catch (error) {
      console.error('Error generating monthly report:', error);
      throw error;
    }
  }
}

// Export for use in Node.js applications
module.exports = TechZoneDatabase;

// Example usage:
/*
const TechZoneDB = require('./mongodb-db');

async function example() {
  const db = new TechZoneDatabase();
  
  try {
    // Connect to database
    await db.connect();
    
    // Get top customers
    const topCustomers = await db.getTopCustomers(5);
    console.log('Top Customers:', topCustomers);
    
    // Get low stock items
    const lowStock = await db.getLowStockItems();
    console.log('Low Stock Items:', lowStock);
    
    // Get top cities
    const topCities = await db.getTopCities(5);
    console.log('Top Cities:', topCities);
    
    // Calculate KPIs
    const kpis = await db.calculateDashboardKPIs('2024-01-01', '2024-01-31');
    console.log('Dashboard KPIs:', kpis);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from database
    await db.disconnect();
  }
}

// Uncomment to run example
// example();
*/
