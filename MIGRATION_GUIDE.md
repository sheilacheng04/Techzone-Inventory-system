MongoDB Migration Guide - TechZone Inventory System
======================================================================

This guide provides step-by-step instructions to migrate from the current 
client-side mock MongoDB system to a real MongoDB backend.

Table of Contents:
1. Prerequisites
2. Environment Setup
3. MongoDB Atlas Setup
4. Database Initialization
5. Backend API Setup
6. Frontend Migration
7. Testing & Validation
8. Production Deployment
9. Troubleshooting

======================================================================
1. PREREQUISITES
======================================================================

Required Software:
- Node.js 16+ (https://nodejs.org/)
- MongoDB Account (https://www.mongodb.com/cloud/atlas)
- npm (comes with Node.js)
- Git (for version control)

Required Knowledge:
- Basic understanding of MongoDB
- REST API concepts
- JavaScript/Node.js fundamentals
- Frontend-backend integration

======================================================================
2. ENVIRONMENT SETUP
======================================================================

Step 2.1: Install Node.js Dependencies
---------------------------------------

1. Navigate to your project directory:
   cd c:\Users\Sheila\Downloads\Techzone-Inventory-system

2. Create package.json file with required dependencies:
   ```json
   {
     "name": "techzone-inventory-system",
     "version": "1.0.0",
     "description": "TechZone POS System with MongoDB Backend",
     "main": "server.js",
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js",
       "init-db": "mongosh < mongodb_init.js"
     },
     "dependencies": {
       "express": "^4.18.2",
       "mongodb": "^5.7.0",
       "cors": "^2.8.5",
       "dotenv": "^16.3.1"
     },
     "devDependencies": {
       "nodemon": "^3.0.1"
     }
   }
   ```

3. Install dependencies:
   npm install

4. Install development dependencies:
   npm install -D nodemon


Step 2.2: Create Environment Configuration File
-----------------------------------------------

Create a .env file in your project root:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/TechZoneMongo

# API Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:8000

# JWT Configuration (for authentication)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# Database Configuration
DB_NAME=TechZoneMongo
```

IMPORTANT: Never commit .env to version control!
Add to .gitignore:
```
.env
node_modules/
.DS_Store
```

======================================================================
3. MONGODB ATLAS SETUP
======================================================================

Step 3.1: Create MongoDB Atlas Account
--------------------------------------

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a free account (M0 cluster - suitable for development/small deployments)

Step 3.2: Create a Cluster
--------------------------

1. Navigate to "Clusters" in the dashboard
2. Click "Create" → Select Shared (Free)
3. Choose your preferred cloud provider and region (closest to your location)
4. Choose cluster name: "TechZone" or similar
5. Click "Create Cluster" (may take 1-2 minutes)

Step 3.3: Create Database User
------------------------------

1. In left sidebar, go to "Security" → "Quick Start"
2. Create a database user:
   - Username: techzone_user
   - Password: (generate secure password - SAVE THIS!)
   - User Privileges: Atlas Admin (for development)
3. Click "Create User"

Step 3.4: Add IP Whitelist
--------------------------

1. In "Security" → "Network Access"
2. Click "Add IP Address"
3. For development: Add "0.0.0.0/0" (allows all IPs)
   For production: Add your specific IP addresses only
4. Click "Confirm"

Step 3.5: Get Connection String
------------------------------

1. Go back to "Clusters"
2. Click "Connect" button next to your cluster
3. Select "Drivers" → "Node.js" 
4. Copy the full connection string:
   ```
   mongodb+srv://techzone_user:<password>@cluster.mongodb.net/TechZoneMongo?retryWrites=true&w=majority
   ```
5. Replace <password> with your actual password
6. Add this to your .env file

======================================================================
4. DATABASE INITIALIZATION
======================================================================

Step 4.1: Initialize Collections and Indexes
-------------------------------------------

1. Ensure .env file contains your MongoDB connection string

2. Open mongosh (MongoDB Shell):
   
   Option A - Using MongoDB Shell directly:
   mongosh "mongodb+srv://techzone_user:password@cluster.mongodb.net/TechZoneMongo"
   
   Option B - Using Node.js script:
   node -e "require('./mongodb-db').then(db => db.connect().then(() => console.log('Connected')))"

3. Run the initialization script:
   mongosh < mongodb_init.js
   
   Or copy-paste the contents of mongodb_init.js in mongosh CLI

4. Verify database was created:
   ```
   show databases;
   use TechZoneMongo;
   show collections;
   ```

Step 4.2: Verify Collections
----------------------------

All 12 collections should be created:

Analytics (8):
- daily_sales_summary
- city_sales_analytics
- city_customer_distribution
- customer_analytics
- item_performance_analytics
- inventory_health_analytics
- financial_snapshots
- supplier_analytics

Logs (4):
- sales_logs
- inventory_logs
- return_logs
- system_activity_logs

======================================================================
5. BACKEND API SETUP
======================================================================

Step 5.1: Create Server File
---------------------------

Create server.js in project root:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const TechZoneDatabase = require('./mongodb-db');
const setupRoutes = require('./api-routes');

const app = express();
const db = new TechZoneDatabase();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Setup API routes
setupRoutes(app, db);

// Connect to MongoDB and start server
db.connect().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ MongoDB connected to TechZoneMongo`);
  });
}).catch(error => {
  console.error('✗ Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await db.disconnect();
  process.exit(0);
});
```

Step 5.2: Start the Backend Service
-----------------------------------

Option 1 - Development (with auto-reload):
npm run dev

Option 2 - Production:
npm start

Output should show:
```
✓ Connected to MongoDB successfully
✓ Server running on http://localhost:3000
✓ MongoDB connected to TechZoneMongo
```

Step 5.3: Test API Health
-------------------------

Open browser or Postman and test:
GET http://localhost:3000/api/health

Expected response:
```json
{
  "success": true,
  "message": "TechZone API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

======================================================================
6. FRONTEND MIGRATION
======================================================================

Step 6.1: Create API Client Module
----------------------------------

Create api-client.js in your frontend directory:

```javascript
const API_BASE = 'http://localhost:3000/api';

class TechZoneAPI {
  static async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Sales
  static createSale(saleData) {
    return this.request('POST', '/sales', saleData);
  }

  static getSalesByDate(startDate, endDate) {
    return this.request('GET', `/sales?startDate=${startDate}&endDate=${endDate}`);
  }

  // Customers
  static getTopCustomers(limit = 10) {
    return this.request('GET', `/customers/analytics?limit=${limit}`);
  }

  static getCustomersByCity(city) {
    return this.request('GET', `/customers/city/${city}`);
  }

  // Items
  static getTopItems(limit = 10) {
    return this.request('GET', `/items/analytics?limit=${limit}`);
  }

  static getLowStockItems() {
    return this.request('GET', '/items/low-stock');
  }

  // Cities
  static getAllCities() {
    return this.request('GET', '/cities/analytics');
  }

  static getTopCities(limit = 5) {
    return this.request('GET', `/cities/top?limit=${limit}`);
  }

  // Reports
  static getDashboardKPIs(startDate, endDate) {
    return this.request('GET', `/reports/dashboard-kpis?startDate=${startDate}&endDate=${endDate}`);
  }

  static getMonthlyReport(month, year) {
    return this.request('GET', `/reports/monthly?month=${month}&year=${year}`);
  }
}
```

Step 6.2: Update Script.js to Use API
-------------------------------------

Modify key functions to call the API instead of using mock data:

Example (Dashboard.init):
```javascript
Dashboard.init = async function() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
    
    // Get data from API
    const kpis = await TechZoneAPI.getDashboardKPIs(startDate, today);
    const topItems = await TechZoneAPI.getTopItems(5);
    const topCities = await TechZoneAPI.getTopCities(5);
    
    // Update UI with fetched data
    Dashboard.renderDashboard(kpis, topItems, topCities);
  } catch (error) {
    console.error('Dashboard error:', error);
  }
};
```

Step 6.3: Update HTML to Use API Module
--------------------------------------

Add to index.html (before script.js):
```html
<script src="api-client.js"></script>
<script src="script.js"></script>
```

And modify initialization:
```javascript
// At the end of script.js
(async function() {
  try {
    await Dashboard.init();
    await POS.init();
    await Inventory.init();
    await Ledger.init();
    await ActivityLog.init();
  } catch (error) {
    console.error('App initialization error:', error);
  }
})();
```

======================================================================
7. TESTING & VALIDATION
======================================================================

Step 7.1: Unit Testing
---------------------

Create test-api.js:

```javascript
const TechZoneAPI = require('./mongodb-db');

async function testAPI() {
  const db = new TechZoneAPI();
  
  try {
    await db.connect();
    console.log('✓ Connection successful');

    // Test creating a sale
    const saleId = await db.createSale({
      sale_id: 1,
      sale_date: new Date().toISOString().split('T')[0],
      customer: { name: 'Test Customer', phone: '1234567890', city: 'Test City' },
      items: [],
      total_amount: 1000,
      total_profit: 200,
      payment_method: 'Cash',
      payment_status: 'Completed'
    });
    console.log('✓ Sale created:', saleId);

    // Test retrieving data
    const sales = await db.getSalesByDateRange('2024-01-01', '2024-12-31');
    console.log('✓ Retrieved sales:', sales.length);

    // Test analytics
    const topCustomers = await db.getTopCustomers(5);
    console.log('✓ Top customers:', topCustomers.length);

  } catch (error) {
    console.error('✗ Test failed:', error);
  } finally {
    await db.disconnect();
  }
}

testAPI();
```

Run test:
node test-api.js

Step 7.2: Manual Testing with Postman
-------------------------------------

1. Import API collection in Postman
2. Test each endpoint:
   - GET /api/health
   - POST /api/sales
   - GET /api/sales?startDate=2024-01-01&endDate=2024-12-31
   - GET /api/customers/analytics
   - GET /api/items/analytics
   - GET /api/cities/top
   - GET /api/reports/dashboard-kpis

3. Verify all tests pass

Step 7.3: Frontend Validation
----------------------------

1. Open index.html in browser
2. Check browser console for errors
3. Test key features:
   - Create a sale through POS
   - Verify it appears in dashboard
   - Check that inventory updates
   - Confirm activity log entries created

======================================================================
8. PRODUCTION DEPLOYMENT
======================================================================

Step 8.1: Prepare for Production
-------------------------------

1. Review environment variables (.env):
   - Ensure strong JWT_SECRET
   - Use production MongoDB URI
   - Set NODE_ENV=production

2. Security checklist:
   - [ ] No sensitive data in code
   - [ ] Error messages don't expose system details
   - [ ] CORS configured for specific domains
   - [ ] MongoDB user has minimal required privileges
   - [ ] Environment variables secured

3. Performance optimization:
   - Add caching layer (Redis optional)
   - Implement rate limiting
   - Set up database indexes (already done in init script)
   - Enable gzip compression

Step 8.2: Deploy to Hosting
---------------------------

Option A - Deploy to Heroku:
```bash
heroku create techzone-inventory
git push heroku main
heroku config:set MONGODB_URI="your_production_uri"
```

Option B - Deploy to AWS EC2:
```bash
# Install Node.js on instance
sudo apt update
sudo apt install nodejs npm

# Clone repository
git clone your-repo-url
cd techzone-inventory-system

# Install dependencies
npm install

# Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "techzone"
pm2 startup
pm2 save
```

Option C - Deploy to Azure App Service:
```bash
az appservice plan create --name techzone-plan --resource-group mygroup
az webapp create --resource-group mygroup --plan techzone-plan --name techzone-app
cd ..
az webapp deployment source config-zip --resource-group mygroup --name techzone-app --src app.zip
```

Step 8.3: Setup SSL/HTTPS
------------------------

1. Use Let's Encrypt for free SSL:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d yourdomain.com
   ```

2. Update server.js to use HTTPS:
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('/etc/letsencrypt/live/yourdomain/privkey.pem'),
     cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain/fullchain.pem')
   };
   
   https.createServer(options, app).listen(443);
   ```

======================================================================
9. TROUBLESHOOTING
======================================================================

Problem: MongoDB Connection Fails
Solution:
1. Verify connection string in .env
2. Check MongoDB Atlas IP whitelist
3. Ensure credentials are correct
4. Check network connectivity

Problem: CORS Errors in Browser
Solution:
1. Verify CORS_ORIGIN in .env matches frontend URL
2. Update api-client.js with correct API_BASE URL
3. Test API directly with curl:
   curl -X GET http://localhost:3000/api/health

Problem: Slow Queries
Solution:
1. Check MongoDB indexes (already created in init script)
2. Monitor query performance in MongoDB Atlas
3. Implement pagination for large datasets
4. Use aggregation pipelines for complex queries

Problem: Data Not Persisting
Solution:
1. Verify INSERT operations are returning success
2. Check database user has correct permissions
3. Monitor MongoDB Atlas for errors
4. Review application error logs

Problem: Out of Memory
Solution:
1. Implement connection pooling
2. Use pagination for data retrieval
3. Clean up old logs (implement retention policies)
4. Monitor memory usage in production

======================================================================
MIGRATION CHECKLIST
======================================================================

Pre-Migration:
[ ] MongoDB Atlas account created
[ ] Connection string obtained
[ ] .env file configured
[ ] Node.js environment setup complete

Database:
[ ] Collections created
[ ] Indexes created and verified
[ ] Validation rules set
[ ] Sample data inserted

Backend:
[ ] server.js created
[ ] api-routes.js in place
[ ] mongodb-db.js connected
[ ] API endpoints tested
[ ] Error handling implemented

Frontend:
[ ] api-client.js created
[ ] script.js updated to use API
[ ] CORS properly configured
[ ] All modules functional

Testing:
[ ] Unit tests passing
[ ] API endpoints working
[ ] Frontend features working
[ ] No console errors

Production:
[ ] Security reviewed
[ ] Environment variables set
[ ] Application deployed
[ ] Monitoring enabled
[ ] Backups configured

======================================================================
SUPPORT & RESOURCES
======================================================================

MongoDB Documentation:
- https://docs.mongodb.com/
- https://docs.mongodb.com/drivers/node/

Express.js Documentation:
- https://expressjs.com/

MongoDB Atlas:
- https://www.mongodb.com/cloud/atlas
- https://docs.atlas.mongodb.com/

REST API Best Practices:
- https://restfulapi.net/

Node.js Best Practices:
- https://nodejs.org/en/docs/guides/

======================================================================
End of Migration Guide
======================================================================
