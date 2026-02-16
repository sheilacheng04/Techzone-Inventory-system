// ============================================================================
// TechZone Inventory System - Quick API Reference
// ============================================================================
// Copy-paste examples for common operations
// ============================================================================

// ============================================================================
// SETUP & INITIALIZATION
// ============================================================================

// 1. Initialize Node.js project
/*
npm install
cp .env.example .env
// Edit .env with your MongoDB connection string
npm run dev
*/

// 2. Test API health
/*
curl -X GET http://localhost:3000/api/health
*/

// ============================================================================
// SALES API EXAMPLES
// ============================================================================

// Create a new sale
async function createSale() {
  const response = await fetch('http://localhost:3000/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sale_id: 1,
      sale_date: '2024-01-15',
      customer: {
        customer_id: 101,
        name: 'John Doe',
        phone: '555-1234',
        email: 'john@example.com',
        city: 'New York'
      },
      items: [
        {
          item_id: 1,
          item_name: 'Product A',
          quantity: 2,
          unit_price: 50.00,
          line_total: 100.00,
          cost: 60.00,
          profit: 40.00
        }
      ],
      total_amount: 100.00,
      total_cost: 60.00,
      total_profit: 40.00,
      payment_method: 'Cash',
      payment_status: 'Completed',
      processed_by: 'Admin'
    })
  });
  return await response.json();
}

// Get sales by date range
async function getSalesByDate(startDate, endDate) {
  const response = await fetch(
    `http://localhost:3000/api/sales?startDate=${startDate}&endDate=${endDate}`
  );
  return await response.json();
}

// Get customer's sales history
async function getCustomerSales(phoneNumber) {
  const response = await fetch(`http://localhost:3000/api/sales/${phoneNumber}`);
  return await response.json();
}

// ============================================================================
// CUSTOMER ANALYTICS EXAMPLES
// ============================================================================

// Get top customers (by spending)
async function getTopCustomers(limit = 10) {
  const response = await fetch(
    `http://localhost:3000/api/customers/analytics?limit=${limit}`
  );
  return await response.json();
}

// Get customers in specific city
async function getCustomersInCity(city) {
  const response = await fetch(`http://localhost:3000/api/customers/city/${city}`);
  return await response.json();
}

// Get VIP customers
async function getVIPCustomers() {
  const response = await fetch('http://localhost:3000/api/customers/vip');
  return await response.json();
}

// Update customer analytics
async function updateCustomerAnalytics(phone, data) {
  const response = await fetch(
    `http://localhost:3000/api/customers/analytics/${phone}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  );
  return await response.json();
}

// ============================================================================
// INVENTORY EXAMPLES
// ============================================================================

// Log inventory action
async function logInventoryAction(action, itemId, quantityChange) {
  const response = await fetch('http://localhost:3000/api/inventory-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: action, // 'SALE', 'RESTOCK', 'PRODUCT_ADDED', etc.
      item_id: itemId,
      item_name: 'Product Name',
      quantity_change: quantityChange,
      previous_stock: 100,
      new_stock: 95,
      performed_by: 'Admin',
      reference: 'SALE-001',
      reference_type: 'sale',
      notes: 'Sold 5 units'
    })
  });
  return await response.json();
}

// Get inventory history for item
async function getItemInventoryHistory(itemId) {
  const response = await fetch(
    `http://localhost:3000/api/inventory-logs/${itemId}`
  );
  return await response.json();
}

// Get inventory logs by action type
async function getInventoryLogsByAction(action, startDate, endDate) {
  const response = await fetch(
    `http://localhost:3000/api/inventory-logs/action/${action}?startDate=${startDate}&endDate=${endDate}`
  );
  return await response.json();
}

// ============================================================================
// PRODUCT PERFORMANCE EXAMPLES
// ============================================================================

// Get top selling items
async function getTopSellingItems(limit = 10) {
  const response = await fetch(
    `http://localhost:3000/api/items/analytics?limit=${limit}`
  );
  return await response.json();
}

// Get low stock items (alert list)
async function getLowStockItems() {
  const response = await fetch('http://localhost:3000/api/items/low-stock');
  return await response.json();
}

// Get poor performing items
async function getPoorPerformingItems() {
  const response = await fetch('http://localhost:3000/api/items/poor-performing');
  return await response.json();
}

// ============================================================================
// CITY ANALYTICS EXAMPLES
// ============================================================================

// Get all cities with analytics
async function getAllCityAnalytics() {
  const response = await fetch('http://localhost:3000/api/cities/analytics');
  return await response.json();
}

// Get top selling cities
async function getTopCities(limit = 5) {
  const response = await fetch(
    `http://localhost:3000/api/cities/top?limit=${limit}`
  );
  return await response.json();
}

// ============================================================================
// ACTIVITY LOG EXAMPLES
// ============================================================================

// Create activity log entry
async function createActivityLog(username, action, details) {
  const response = await fetch('http://localhost:3000/api/activity-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: 1,
      username: username,
      role: 'admin',
      action: action, // 'PROCESS_SALE', 'ADD_PRODUCT', etc.
      reference_id: 123,
      reference_type: 'sale',
      details: details,
      ip_address: '192.168.1.1',
      status: 'Success'
    })
  });
  return await response.json();
}

// Get activity logs by user
async function getUserActivityLogs(username, limit = 100) {
  const response = await fetch(
    `http://localhost:3000/api/activity-logs/user/${username}?limit=${limit}`
  );
  return await response.json();
}

// Get activity logs by action type
async function getActivityLogsByAction(action, limit = 100) {
  const response = await fetch(
    `http://localhost:3000/api/activity-logs/action/${action}?limit=${limit}`
  );
  return await response.json();
}

// Get activity feed (recent activity)
async function getActivityFeed(limit = 100) {
  const response = await fetch(
    `http://localhost:3000/api/activity-logs/feed?limit=${limit}`
  );
  return await response.json();
}

// ============================================================================
// REPORTING & KPI EXAMPLES
// ============================================================================

// Get dashboard KPIs for date range
async function getDashboardKPIs(startDate, endDate) {
  const response = await fetch(
    `http://localhost:3000/api/reports/dashboard-kpis?startDate=${startDate}&endDate=${endDate}`
  );
  return await response.json();
}

// Get monthly performance report
async function getMonthlyReport(month, year) {
  const response = await fetch(
    `http://localhost:3000/api/reports/monthly?month=${month}&year=${year}`
  );
  return await response.json();
}

// Get daily sales summary
async function getDailySalesSummary(startDate, endDate) {
  const response = await fetch(
    `http://localhost:3000/api/reports/daily-sales?startDate=${startDate}&endDate=${endDate}`
  );
  return await response.json();
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

// Create multiple sales
async function batchCreateSales(salesArray) {
  const promises = salesArray.map(sale => {
    return fetch('http://localhost:3000/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale)
    });
  });
  
  const results = await Promise.all(promises);
  return Promise.all(results.map(r => r.json()));
}

// Get data for dashboard initialization
async function initializeDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000)
    .toISOString().split('T')[0];
  
  const [kpis, topItems, topCities, topCustomers] = await Promise.all([
    getDashboardKPIs(thirtyDaysAgo, today),
    getTopSellingItems(5),
    getTopCities(5),
    getTopCustomers(10)
  ]);
  
  return {
    kpis: kpis.data,
    topItems: topItems.data,
    topCities: topCities.data,
    topCustomers: topCustomers.data
  };
}

// ============================================================================
// DATABASE COLLECTIONS QUICK REFERENCE
// ============================================================================

/*
ANALYTICS COLLECTIONS (Real-time aggregated data)
=====================================================

1. daily_sales_summary
   {
     date: "2024-01-15",
     total_sales: 5000,
     total_profit: 1200,
     transactions_count: 45,
     total_items_sold: 120,
     average_transaction_value: 111.11
   }

2. city_sales_analytics
   {
     city: "New York",
     total_customers: 150,
     total_sales_amount: 25000,
     total_transactions: 250,
     most_purchased_item: { name: "Product A", quantity: 500 },
     penetration_rate: 25.5
   }

3. customer_analytics
   {
     name: "John Doe",
     phone: "555-1234",
     city: "New York",
     total_orders: 15,
     total_spent: 2500,
     customer_segment: "VIP",
     loyalty_score: 850,
     favorite_products: [
       { item_id: 1, item_name: "Product A", purchases: 5 }
     ]
   }

4. item_performance_analytics
   {
     item_id: 1,
     name: "Product A",
     total_quantity_sold: 500,
     total_profit: 5000,
     profit_margin: 40,
     current_stock: 150,
     performance_rating: "Excellent",
     inventory_turnover: 3.5
   }

5. city_customer_distribution
   {
     city: "New York",
     total_customers: 150,
     customer_segments: {
       retail: 100,
       wholesale: 40,
       corporate: 10
     },
     repeat_customer_rate: 65.5
   }

6. inventory_health_analytics
   {
     analysis_date: "2024-01-15",
     total_items: 50,
     stock_status: {
       in_stock: 45,
       low_stock: 4,
       out_of_stock: 1
     },
     total_inventory_value: 50000
   }

7. financial_snapshots
   {
     snapshot_date: "2024-01-15",
     snapshot_period: "daily",
     gross_sales: 5000,
     net_profit: 1200,
     profit_margin: 24,
     roi: 25
   }

8. supplier_analytics
   {
     supplier_id: 1,
     supplier_name: "ABC Supplies",
     total_orders: 10,
     on_time_delivery_rate: 98,
     quality_rating: 4.5,
     reliability_score: 95
   }

LOG COLLECTIONS (Audit trails)
================================

1. sales_logs
   {
     sale_id: 1,
     customer: { name, phone, city },
     items: [{ item_id, quantity, price, profit }],
     total_amount: 100,
     total_profit: 25,
     payment_method: "Cash",
     processed_by: "Admin"
   }

2. inventory_logs
   {
     action: "SALE",
     item_id: 1,
     quantity_change: -5,
     previous_stock: 100,
     new_stock: 95,
     reference: "SALE-001"
   }

3. return_logs
   {
     return_id: 1,
     original_sale_id: 1,
     items: [{ item_id, quantity_returned, reason }],
     refund_status: "Completed"
   }

4. system_activity_logs
   {
     username: "Admin",
     action: "PROCESS_SALE",
     status: "Success",
     timestamp: 1705329900000
   }
*/

// ============================================================================
// COMMON QUERIES & PATTERNS
// ============================================================================

// Pattern: Get recent transactions
async function getRecentTransactions(lastNDays = 7) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - lastNDays*24*60*60*1000)
    .toISOString().split('T')[0];
  
  return getDashboardKPIs(startDate, endDate);
}

// Pattern: Find best performing items
async function analyzeTopProducts(limit = 10) {
  const topItems = await getTopSellingItems(limit);
  return topItems.data
    .sort((a, b) => b.total_profit - a.total_profit)
    .map(item => ({
      name: item.name,
      profit: item.total_profit,
      margin: `${item.profit_margin}%`,
      rating: item.performance_rating
    }));
}

// Pattern: Monitor inventory alerts
async function getInventoryAlerts() {
  const lowStock = await getLowStockItems();
  const poorPerforming = await getPoorPerformingItems();
  
  return {
    lowStockCount: lowStock.data.length,
    poorPerformingCount: poorPerforming.data.length,
    lowStockItems: lowStock.data,
    poorPerformingItems: poorPerforming.data
  };
}

// Pattern: Geographic analysis
async function analyzeByGeography() {
  const cityAnalytics = await getAllCityAnalytics();
  return cityAnalytics.data
    .sort((a, b) => b.total_sales_amount - a.total_sales_amount)
    .map(city => ({
      city: city.city,
      sales: city.total_sales_amount,
      customers: city.total_customers,
      avgPerCustomer: city.total_sales_amount / city.total_customers
    }));
}

// Pattern: Customer segmentation
async function getCustomerSegments() {
  const allCities = await getAllCityAnalytics();
  return allCities.data.map(city => ({
    city: city.city,
    vip: city.customer_segments?.retail || 0,
    regular: city.customer_segments?.wholesale || 0,
    atrisk: city.customer_segments?.corporate || 0
  }));
}

// ============================================================================
// ERROR HANDLING BEST PRACTICES
// ============================================================================

async function safeAPICall(apiFunction, fallbackValue = null) {
  try {
    const result = await apiFunction();
    
    if (!result.success) {
      console.error('API Error:', result.error);
      return fallbackValue;
    }
    
    return result.data || result;
  } catch (error) {
    console.error('Network Error:', error.message);
    return fallbackValue;
  }
}

// Usage:
/*
const topCustomers = await safeAPICall(
  () => getTopCustomers(10),
  [] // fallback to empty array if error
);
*/

// ============================================================================
// MONGODB DATABASE MAINTENANCE
// ============================================================================

/*
BACKUP DATABASE:
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/TechZoneMongo" --out ./backup

RESTORE FROM BACKUP:
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/TechZoneMongo" ./backup

CREATE INDEX:
db.sales_logs.createIndex({ sale_date: -1 })

DROP INDEX:
db.sales_logs.dropIndex("sale_date_-1")

GET COLLECTION SIZE:
db.sales_logs.stats().size

DELETE OLD RECORDS:
db.sales_logs.deleteMany({ 
  sale_date: { $lt: ISODate("2023-01-01") } 
})

EXPORT TO CSV:
mongoexport --uri="mongodb+srv://..." --collection=sales_logs --out sales.csv --csv

IMPORT FROM CSV:
mongoimport --uri="mongodb+srv://..." --collection=sales_logs --file sales.csv --csv
*/

// ============================================================================
// END OF QUICK REFERENCE
// ============================================================================
