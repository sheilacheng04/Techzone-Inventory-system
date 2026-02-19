# TechZone Inventory System — Setup Guide

## Requirements
Before running the project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/downloads/) (v5.7 or higher) — for core business data (products, categories, staff, suppliers, customers)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) — for analytics & logs (sales, inventory, activity)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional, for viewing MongoDB data)

---

## Step 1 — Extract the Project
Extract the zip file to a folder on your computer.

---

## Step 2 — Configure Environment Variables
Create a `.env` file in the project root with:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here # Replace with your MySQL Workbench password
MYSQL_DATABASE=techzone

MONGODB_URI=mongodb://localhost:27017/TechZoneMongo
PORT=5000
NODE_ENV=development
```

---

## Step 3 — Install Dependencies
Open a terminal inside the project folder and run:
```bash
npm install
```

---

## Step 4 — Start MySQL & MongoDB Locally

**MySQL (Windows):**
Open Services and make sure **MySQL** is running, or run:
```bash
mysqld
```

**MongoDB (Windows):**
Search for "MongoDB" in Services and make sure it's running, or run:
```bash
mongod
```

---

## Step 5 — Initialize MySQL Database
Initialize MySQL with all tables, stored procedures, and seed data:
```bash
node scripts/init-mysql.js
```

You should see:
```
✅ MySQL Connection: OK
✅ Created categories table
✅ Created suppliers table
✅ Created staff table
✅ Created customers table
✅ Created products table
✅ Created sales table
...
✅ Created all 20 stored procedures
✅ Seeded 11 categories
✅ Seeded 12 suppliers
✅ Seeded 5 staff members
✅ Seeded 17 products
```

---

## Step 6 — Start the Server
In the project terminal run:
```bash
npm start
```

You should see:
```
✅ MySQL Connected Successfully
✅ MongoDB Connected Successfully
MySQL Tables: categories, suppliers, staff, customers, products, sales, sale_item, returns_tbl
🚀 TechZone Inventory System Server
📡 Server running on: http://localhost:5000
```

---

## Step 7 — Open the App
Open your browser and go to:
```
http://localhost:5000
```

You'll see:
- ✅ Dashboard with sales analytics
- ✅ Point of Sale with MySQL product data
- ✅ Inventory management (editable via Data Management tab)
- ✅ Transaction Ledger with MongoDB sales history
- ✅ Returns management with MongoDB return logs
- ✅ Activity Log with MongoDB system events
- ✅ **Data Management tab** — Create/Edit/Delete: Categories, Suppliers, Staff, Customers

---

## For a Clean Demo (Fresh Start)

### Reset MySQL Data
```bash
node scripts/init-mysql.js --reset
```
Or manually with MySQL CLI:
```sql
TRUNCATE TABLE sale_item;
TRUNCATE TABLE sales;
TRUNCATE TABLE returns_tbl;
DELETE FROM products;
DELETE FROM customers;
DELETE FROM staff;
DELETE FROM suppliers;
DELETE FROM categories;
-- Then run init-mysql.js again
```

### Reset MongoDB Data
1. Open **MongoDB Compass**
2. Connect to `mongodb://localhost:27017`
3. Open the **TechZoneMongo** database
4. Drop these collections:
   - `sales_logs`
   - `inventory_logs`
   - `return_logs`
   - `system_activity_logs`
   - `customer_analytics`
   - `item_performance_analytics`
   - `daily_sales_summaries`
   - `city_sales_analytics`
5. Run `npm start` again — all data will be fresh ✅

---

## Data Architecture

### MySQL (Core Business Data)
| Table | Purpose | Editable from Frontend |
|---|---|---|
| `categories` | Product categories with warranty periods | ✅ Data Management tab |
| `suppliers` | Vendor information | ✅ Data Management tab |
| `staff` | Users & roles (Staff, Cashier, Manager, Admin) | ✅ Data Management tab |
| `customers` | Customer info (auto-created from sales) | ✅ Data Management tab |
| `products` | Products with price, cost, stock | ✅ Inventory tab |
| `sales` | Completed transactions | Read-only via Ledger |
| `sale_item` | Line items per sale | Read-only via Ledger |
| `returns_tbl` | Return requests & processing | ✅ Returns tab |

### MongoDB (Analytics & Logs)
| Collection | Purpose |
|---|---|
| `sales_logs` | Detailed transaction history |
| `inventory_logs` | Stock movement audit trail |
| `return_logs` | Return processing history |
| `system_activity_logs` | All user actions (login, edits, etc.) |
| `customer_analytics` | Customer purchase patterns & statistics |
| `item_performance_analytics` | Product sales performance metrics |
| `daily_sales_summaries` | Daily revenue & transaction summaries |
| `city_sales_analytics` | Sales breakdown by customer city |

---

## Troubleshooting

**MySQL not connecting?**
- Check your `.env` file has correct MySQL credentials
- Verify MySQL service is running: `mysql --version`
- Test connection: `mysql -u root -p -h localhost`

**MongoDB not connecting?**
- Make sure MongoDB service is running
- Check port `27017` is not blocked

**init-mysql.js fails?**
- Verify `.env` file has correct MYSQL_* variables
- Make sure MySQL is running
- Check user has CREATE TABLE permissions

**Port 5000 already in use?**
- Change `PORT=5000` to another port (e.g. `5001`) in `.env`

**Products not showing in POS?**
- Check MySQL connection is active (`npm start` should show ✅ MySQL Connected)
- Verify `init-mysql.js` was run successfully
- Try restarting the server

---

*TechZone Inventory System — Built with Node.js, Express, MongoDB*
