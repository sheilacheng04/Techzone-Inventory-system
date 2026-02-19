# TechZone Inventory System

A **full-stack inventory & point-of-sale (POS) system** built with Node.js, Express, and MongoDB for analytics. Designed for retail businesses to manage products, sales, inventory, and customer returns with real-time analytics and audit trails.

---

## 🎯 Key Features

✅ **Point of Sale (POS)** — Process sales with cart management & receipt printing  
✅ **Inventory Management** — Real-time stock tracking across MySQL & MongoDB  
✅ **Sales Analytics** — Dashboard with revenue, profit, and trend analysis  
✅ **Transaction Ledger** — Complete sales history with MongoDB persistence  
✅ **Returns Management** — Process returns with refund tracking  
✅ **Activity Logging** — Comprehensive audit trail for compliance  
✅ **Data Management** — CRUD operations for categories, suppliers, staff, customers  
✅ **Multi-Database Architecture** — MySQL for business data, MongoDB for analytics & logs

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Frontend)                    │
│  HTML5 + CSS3 + Vanilla JavaScript                      │
│  (Dashboard, POS, Inventory, Ledger, Returns, Logs)     │
└────────────────────────────┬────────────────────────────┘
                             │  HTTP/REST API
┌────────────────────────────▼────────────────────────────┐
│              Express.js Server (Node.js)                 │
│  Routes: /api/sales, /api/products, /api/logs, etc.    │
│  Middleware: Authentication, Validation, Error Handling │
└────────────────┬──────────────────────┬────────────────┘
                 │                      │
        MySQL connection    MongoDB connection
                 │                      │
    ┌────────────▼──────────┐   ┌──────▼──────────────┐
    │  MySQL Database       │   │ MongoDB Database    │
    │  (Core Business Data) │   │ (Analytics & Logs)  │
    │                       │   │                     │
    │ • categories          │   │ • sales_logs        │
    │ • suppliers           │   │ • inventory_logs    │
    │ • staff               │   │ • return_logs       │
    │ • customers           │   │ • activity_logs     │
    │ • products            │   │ • customer_*        │
    │ • sales               │   │ • item_performance  │
    │ • sale_item           │   │ • daily_summaries   │
    │ • returns_tbl         │   │ • city_analytics    │
    │                       │   │                     │
    │ Stored Procedures:    │   │ Collections auto-   │
    │ • sp_process_sale     │   │ generated from logs │
    │ • sp_add_sale_item    │   │                     │
    │ • sp_process_return   │   │                     │
    │ • (+ 17 more)         │   │                     │
    └───────────────────────┘   └─────────────────────┘
```

### Data Flow

1. **Sales Transaction**
   - Customer → POS Form (Browser)
   - Submit → Express API (`/api/sales`)
   - MySQL: Insert sale header & items via stored procedures
   - Trigger: Auto-deduct stock
   - Log: `LogInterceptors.createSalesLog()` → `SalesLog` model
   - MongoDB: Save sales_logs collection + update analytics

2. **Inventory Movement**
   - Edit/Restock/Sale → `LogInterceptors.createInventoryLog()`
   - MongoDB: inventory_logs collection
   - Dashboard: Real-time updates via frontend refresh

3. **Activity Audit Trail**
   - User action → `LogInterceptors.createActivityLog()`
   - MongoDB: system_activity_logs collection
   - Activity feed displays username, role, action, timestamp

---

## 💻 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JS | Latest |
| **Backend** | Node.js, Express.js | v16+ |
| **Primary Database** | MySQL | v5.7+ |
| **Analytics Database** | MongoDB | Community v4.0+ |
| **ODM** | Mongoose | v5.0+ |
| **Other** | dotenv (config) | Latest |

---

## 📋 Requirements

### System Requirements
- **Windows 10/11, macOS, or Linux**
- **8GB RAM minimum** (for MySQL + MongoDB)
- **2GB free disk space** minimum

### Software Requirements
- [Node.js](https://nodejs.org/) **v16 or higher**
- [MySQL Community Server](https://www.mysql.com/downloads/) **v5.7 or higher**
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) **v4.0 or higher**
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (optional, for database management)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional, for viewing MongoDB data)

### Ports Required
- **5000** (Express server) — configurable in `.env`
- **3306** (MySQL) — default
- **27017** (MongoDB) — default

---

## 📦 Installation & Setup

### Step 1 — Extract & Navigate
```bash
# Extract the zip file
# Open terminal/command prompt in the project folder
cd TeachZone-Inventory-System
```

### Step 2 — Install Dependencies
```bash
npm install
```

This installs:
- `express` — web framework
- `mysql2` — MySQL driver
- `mongoose` — MongoDB ODM
- `dotenv` — environment variable management

### Step 3 — Configure Environment Variables

Create a `.env` file in the **project root**:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=techzone

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/TechZoneMongo

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Replace `your_mysql_password_here`** with your actual MySQL root password (set during MySQL installation).

### Step 4 — Start Database Services

**MySQL (Windows):**
```powershell
# Option 1: Use Windows Services
# Open Services (services.msc) and start "MySQL80" or "MySQL"

# Option 2: Start via command line
mysqld
```

**MySQL (macOS/Linux):**
```bash
brew services start mysql
# or
sudo systemctl start mysql
```

**MongoDB (Windows):**
```powershell
# Option 1: Use Windows Services
# Open Services (services.msc) and start "MongoDB"

# Option 2: Start via command line
mongod
```

**MongoDB (macOS/Linux):**
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 5 — Initialize MySQL Database

```bash
node scripts/init-mysql.js
```

Expected output:
```
✅ MySQL Connection: OK
✅ Created categories table
✅ Created suppliers table
✅ Created staff table
✅ Created customers table
✅ Created products table
✅ Created sales table
✅ Created sale_item table
✅ Created returns_tbl table
✅ Created all 20 stored procedures
✅ Seeded 11 categories
✅ Seeded 12 suppliers
✅ Seeded 5 staff members
✅ Seeded 17 products
```

### Step 6 — Start the Server

```bash
npm start
```

Expected output:
```
✅ MySQL Connected Successfully
✅ MongoDB Connected Successfully
MySQL Tables: categories, suppliers, staff, customers, products, sales, sale_item, returns_tbl
🚀 TechZone Inventory System Server
📡 Server running on: http://localhost:5000
```

### Step 7 — Open in Browser

Navigate to: **http://localhost:5000**

You should see:
- ✅ Dashboard tab with sales analytics
- ✅ Point of Sale tab with products from MySQL
- ✅ Inventory tab with stock management
- ✅ Transaction Ledger with sales history
- ✅ Returns tab for processing returns
- ✅ Activity Log (unified feed)
- ✅ Data Management tab for CRUD operations

---

## 📁 Project Structure

```
TeachZone-Inventory-System/
├── server.js                    # Express server, API routes, DB connections
├── script.js                    # Frontend logic (POS, inventory, dashboards)
├── index.html                   # Main HTML template
├── style.css                    # Styling (CSS variables for theming)
├── api-client.js                # Fetch wrapper for API calls (API object)
├── data-loader.js               # Load initial seed data from server
├── dashboard-loader.js          # Initialize dashboard charts & analytics
├── package.json                 # Dependencies & scripts
├── .env                         # Environment variables (create this file)
├── README.md                    # This file
│
├── scripts/
│   ├── init-mysql.js            # Initialize MySQL tables, procedures, seed data
│   └── init-mongodb.js          # (Optional) Initialize MongoDB indexes
│
└── [Generated by Node]
    └── node_modules/            # Installed npm packages
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `server.js` | Express server with API routes, MySQL/MongoDB models, authentication middleware |
| `script.js` | Frontend logic: POS cart, inventory forms, analytics rendering, log viewers |
| `index.html` | HTML structure: tabs for Dashboard, POS, Inventory, Ledger, Returns, Logs, Data Mgmt |
| `style.css` | CSS with theming variables (`--primary`, `--success`, `--danger`, etc.) |
| `api-client.js` | Wrapper functions for API calls (e.g., `API.createSale()`, `API.getProducts()`) |
| `data-loader.js` | Fetch product/staff/customer data from server on page load |
| `dashboard-loader.js` | Initialize charts for sales trends, profit analysis, etc. |
| `scripts/init-mysql.js` | Setup script: creates tables, stored procedures, seed data |

---

## 🗄️ Database Architecture

### MySQL (Core Business Data)

**Tables:**

| Table | Columns | Purpose |
|-------|---------|---------|
| `categories` | cat_id, cat_name, description, warranty | Product categories with warranty periods |
| `suppliers` | sup_id, sup_name, contact, phone, email, address | Vendor information |
| `staff` | staff_id, username, password, role, email, created_at | Users (Staff, Cashier, Manager, Admin) |
| `customers` | customer_id, name, phone, email, city, created_at | Customer information (auto-created from sales) |
| `products` | product_id, cat_id, sup_id, product_name, description, price, cost, qty, created_at | Product inventory |
| `sales` | sale_id, customer_id, total_amount, total_profit, payment_method, processed_by, created_at | Sale headers |
| `sale_item` | sale_item_id, sale_id, product_id, quantity, unit_price, line_total, cost, profit | Line items per sale |
| `returns_tbl` | return_id, sale_id, product_id, quantity_returned, reason, disposition, refund_amount, restocked, approved_by | Return requests |

**Stored Procedures (20 total):**
- `sp_process_sale` — Insert sale header + customer (upsert)
- `sp_add_sale_item` — Add line item (triggers stock deduction)
- `sp_process_return` — Process return + restock
- `sp_get_inventory_value` — Calculate total inventory value
- `sp_get_profit_margin` — Calculate profit for products
- And 15 more for analytics, reporting, data management

**Triggers:**
- `trg_deduct_stock_after_sale` — Auto-deducts stock when sale_item inserted
- `trg_restock_after_return` — Auto-restocks when return approved

### MongoDB (Analytics & Logs)

**Collections:**

| Collection | Purpose | Created By |
|------------|---------|-----------|
| `sales_logs` | Detailed transaction history with nested customer & items | `LogInterceptors.createSalesLog()` |
| `inventory_logs` | Stock movement audit trail (sales, restocks, adjustments) | `LogInterceptors.createInventoryLog()` |
| `return_logs` | Return processing history & refunds | `LogInterceptors.createReturnLog()` |
| `system_activity_logs` | System events (login, edits, bulk operations) | `LogInterceptors.createSystemActivityLog()` |
| `activity_logs` | Unified activity feed with user actions | `LogInterceptors.createActivityLog()` |
| `customer_analytics` | Customer purchase patterns & repeat rate | Auto-generated from sales_logs |
| `item_performance_analytics` | Product sales count, revenue, profit margins | Auto-generated from sales_logs |
| `daily_sales_summaries` | Daily revenue, transaction count, average order value | Auto-generated from sales_logs |
| `city_sales_analytics` | Sales breakdown by customer city | Auto-generated from sales_logs |

**Data Example (sales_logs):**
```json
{
  "_id": ObjectId("..."),
  "timestamp": ISODate("2026-02-19T10:30:00Z"),
  "sale_id": 101,
  "transaction_type": "SALE",
  "customer": {
    "customer_id": 5,
    "name": "John Doe",
    "phone": "09123456789",
    "email": "john@example.com",
    "city": "Manila"
  },
  "items": [
    {
      "item_id": 12,
      "item_name": "Laptop",
      "quantity": 1,
      "unit_price": 45000,
      "line_total": 45000,
      "cost": 30000,
      "profit": 15000
    }
  ],
  "total_amount": 45000,
  "total_profit": 15000,
  "payment_method": "Cash",
  "processed_by": "cashier_01"
}
```

---

## 🔌 API Routes

### Sales

- `POST /api/sales` — Create a new sale (processes items, updates stock)
- `GET /api/sales` — Get all sales (paginated)
- `GET /api/sales/range` — Get sales by date range

### Products

- `GET /api/products` — Get all products with stock info
- `POST /api/products` — Add new product
- `PUT /api/products/:id` — Update product (price, cost, stock)
- `DELETE /api/products/:id` — Delete product

### Customers

- `GET /api/customers` — Get all customers
- `POST /api/customers` — Create new customer
- `PUT /api/customers/:id` — Update customer info
- `DELETE /api/customers/:id` — Delete customer

### Categories

- `GET /api/categories` — Get all categories
- `POST /api/categories` — Create category
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category

### Staff

- `GET /api/staff` — Get all staff members
- `POST /api/staff` — Create staff member
- `PUT /api/staff/:id` — Update staff
- `DELETE /api/staff/:id` — Delete staff

### Suppliers

- `GET /api/suppliers` — Get all suppliers
- `POST /api/suppliers` — Create supplier
- `PUT /api/suppliers/:id` — Update supplier
- `DELETE /api/suppliers/:id` — Delete supplier

### Inventory Logs

- `GET /api/inventory-logs` — Get inventory movements
- `POST /api/inventory-logs` — Record stock movement

### Analytics

- `GET /api/analytics/dashboard` — Revenue, profit, transaction counts
- `GET /api/analytics/customers` — Customer metrics
- `GET /api/analytics/items` — Product performance
- `GET /api/analytics/daily-summary` — Daily sales summary
- `GET /api/analytics/city-sales` — Sales by city

### Activity Logs

- `GET /api/activity-logs` — Get system activity feed
- `POST /api/activity-logs` — Log user action

---

## 🎮 Usage Guide

### Processing a Sale

1. **Select POS Tab** → "Point of Sale"
2. **Enter Customer Info:** Name, Phone, Email, City
3. **Select Products:** Choose products from dropdown, enter quantity
4. **Add to Cart:** Click "Add Item"
5. **Review Cart:** See total amount & profit
6. **Select Cashier:** Choose staff member processing sale
7. **Process Sale:** Click "Process Sale"
   - Sales header saved to MySQL
   - Stock auto-deducted by trigger
   - Logs created in MongoDB
8. **View Receipt:** Modal shows transaction details
9. **Print Receipt:** Use browser print (Ctrl+P) or print button

### Managing Inventory

1. **Select Inventory Tab**
2. **View Products:** See all products with stock levels
3. **Edit Product:** Click edit button to change price/cost/stock
4. **Restock Product:** Increase quantity
5. **View Inventory Logs:** See stock movements in "Inventory Logs" section

### Viewing Analytics

1. **Select Dashboard Tab**
2. **Revenue Chart:** Line chart of sales over time
3. **Profit Analysis:** Pie chart showing profit breakdown
4. **Transaction Stats:** Total sales, average order value
5. **Top Products:** Best-selling items by revenue
6. **Customer Insights:** Repeat customer rate, city breakdown

### Processing Returns

1. **Select Returns Tab**
2. **Enter Return Info:** Original sale #, product, quantity returned, reason
3. **Set Disposition:** Refund, Restock, Donate
4. **Enter Refund Amount**
5. **Approve Return:** Select approval manager
6. **Process Return:** Click "Process Return"
   - Return logged to MongoDB
   - If "Restock" = stock increases
   - Inventory log created

### Activity Logging

1. **Select Logs Tab** (Activity Log)
2. **View Unified Feed:** All user actions in chronological order
3. **Click Entry:** View details of specific action
4. **Filter by Type:** See sales, restocks, returns, edits

### Data Management

1. **Select Data Management Tab**
2. **Choose Entity:** Categories, Suppliers, Staff, Customers
3. **View Table:** See all records
4. **Add New:** Click "New [Entity]" button
5. **Edit:** Click edit icon on row
6. **Delete:** Click delete icon (with confirmation)

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# MySQL
MYSQL_HOST=localhost              # MySQL server hostname
MYSQL_PORT=3306                   # MySQL port (default 3306)
MYSQL_USER=root                   # MySQL username
MYSQL_PASSWORD=password           # MySQL password
MYSQL_DATABASE=techzone           # Database name

# MongoDB
MONGODB_URI=mongodb://localhost:27017/TechZoneMongo

# Server
PORT=5000                         # Express server port
NODE_ENV=development              # Environment (development/production)
```

### Port Changes

To run on a different port:

1. Edit `.env`:
   ```env
   PORT=5001
   ```
2. Restart server: `npm start`
3. Access: `http://localhost:5001`

### Database Connection Issues

**Test MySQL:**
```bash
mysql -u root -p -h localhost
```

**Test MongoDB:**
```bash
mongosh mongodb://localhost:27017
```

---

## 🔧 Troubleshooting

### MySQL Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solutions:**
1. Check MySQL is running: `mysql --version`
2. Verify credentials in `.env`
3. Ensure port 3306 is not blocked
4. Restart MySQL service:
   ```bash
   # Windows
   net stop MySQL80
   net start MySQL80
   
   # macOS/Linux
   brew services restart mysql
   ```

### MongoDB Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Check MongoDB is running
2. Ensure port 27017 is not blocked
3. Restart MongoDB:
   ```bash
   # Windows
   net stop MongoDB
   net start MongoDB
   
   # macOS/Linux
   brew services restart mongodb-community
   ```

### init-mysql.js Fails

**Error:** `Access Denied for user 'root'@'localhost'`

**Solutions:**
1. Verify MYSQL_PASSWORD in `.env` is correct
2. Reset MySQL password:
   ```bash
   # Windows
   mysqld --skip-grant-tables
   mysql -u root
   mysql> FLUSH PRIVILEGES;
   mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   ```
3. Update `.env` with new password

### Products Not Showing in POS

**Solutions:**
1. Check MySQL is connected: `npm start` should show ✅ MySQL Connected
2. Verify init-mysql.js ran successfully
3. Check products table: `SELECT * FROM products;` in MySQL Workbench
4. Restart server: `npm start`

### Port 5000 Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change PORT in `.env` to `5001` or another available port
2. Or kill process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

### Logs Not Saving to MongoDB

**Solutions:**
1. Check MongoDB connection: `npm start` should show ✅ MongoDB Connected
2. Verify MONGODB_URI in `.env`
3. Check MongoDB Compass for collections at `mongodb://localhost:27017`
4. Restart server

---

## 🔄 Reset & Fresh Start

### Reset MySQL Data

```bash
# Option 1: Full reset with re-initialization
node scripts/init-mysql.js --reset

# Option 2: Manual reset via MySQL Workbench
TRUNCATE TABLE sale_item;
TRUNCATE TABLE sales;
TRUNCATE TABLE returns_tbl;
DELETE FROM products;
DELETE FROM customers;
DELETE FROM staff;
DELETE FROM suppliers;
DELETE FROM categories;
```

Then run initialization:
```bash
node scripts/init-mysql.js
```

### Reset MongoDB Data

**Via MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to `TechZoneMongo` database
4. Delete collections:
   - sales_logs
   - inventory_logs
   - return_logs
   - activity_logs
   - system_activity_logs
   - customer_analytics
   - item_performance_analytics
   - daily_sales_summaries
   - city_sales_analytics

Then restart server:
```bash
npm start
```

---

## 📊 Business Logic & Key Features

### Automatic Stock Deduction

When a sale is processed:
1. Frontend validates stock availability
2. MySQL stored procedure `sp_process_sale` inserts sale header
3. `sp_add_sale_item` inserts each line item
4. **Trigger `trg_deduct_stock_after_sale` automatically deducts stock from products table**
5. Frontend updates in-memory stock
6. MongoDB logs record the sale

### Profit Tracking

- **Unit Profit** = Selling Price - Cost
- **Line Profit** = Unit Profit × Quantity
- **Sale Total Profit** = Sum of line profits
- **Dashboard** shows cumulative profit by category, product, or time period

### Customer Auto-Creation

- When processing a sale, if customer doesn't exist, they're auto-created
- Captured data: name, phone, email, city
- Subsequent sales can select repeat customers
- Useful for walk-in customers

### Activity Audit Trail

Every major action is logged:
- Sale processed
- Inventory edited
- Return processed
- Customer created/updated
- Product added/edited
- **Timestamp, user, role, action, details** recorded
- Accessible via Activity Log tab & MongoDB

---

## 🚀 Performance Tips

1. **Dashboard Loading:**
   - Charts render on-demand when tab selected
   - Limit analytics queries to last 30 days
   - Use pagination (50 items per page) for ledger

2. **Large Inventory:**
   - Product dropdown uses search filter
   - Consider indexing MySQL tables for faster queries

3. **MongoDB Growth:**
   - Archive old logs (>1 year) to separate collection
   - Use indexes on `timestamp`, `sale_id`, `product_id`

4. **Browser Performance:**
   - Use modern browser (Chrome, Firefox, Edge)
   - Clear cache if experiencing stale data
   - Monitor browser console (F12) for errors

---

## 📝 License & Credits

**TechZone Inventory System**  
Built with Node.js, Express.js, MySQL, and MongoDB  
Designed for retail inventory management and analytics

---

## 📞 Support & Troubleshooting

For issues:
1. Check the **Troubleshooting** section above
2. Verify database services are running
3. Check `.env` file configuration
4. Review browser console (F12) for frontend errors
5. Check server terminal for backend errors
6. Review MongoDB Compass for data integrity

---

*Last Updated: February 19, 2026*
