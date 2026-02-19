// ============================================
// TECHZONE INVENTORY SYSTEM - MAIN SERVER
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
app.use(express.static(path.join(__dirname)));

// ============================================
// DATABASE CONNECTION — MONGODB (Analytics/Logs)
// ============================================

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI not found in .env file');
    process.exit(1);
}

// ============================================
// DATABASE CONNECTION — MYSQL (Core Data)
// ============================================

const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'techzone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify MySQL connection on startup
async function checkMySQL() {
    try {
        const conn = await mysqlPool.getConnection();
        console.log('✅ MySQL Connected Successfully');
        console.log('   📊 Database:', process.env.MYSQL_DATABASE || 'techzone');
        conn.release();
    } catch (err) {
        console.error('❌ MySQL Connection Failed:', err.message);
        console.error('   Run: node scripts/init-mysql.js  to set up the database');
    }
}

// ============================================
// NOTE: Products/Items are now in MySQL.
// MongoDB is used for analytics & logging only.
// ============================================

console.log('🔌 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4
})
.then(async () => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('   📊 Database:', mongoose.connection.db.databaseName);
    console.log('   🔗 Host:', mongoose.connection.host);
})
.catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
});

// Check MySQL
checkMySQL();

// ============================================
// SCHEMAS (MongoDB — Analytics & Logs only)
// ============================================

// Item schema REMOVED — products now live in MySQL

const SalesLogSchema = new mongoose.Schema({
    sale_id:          { type: Number, required: true, unique: true },
    timestamp:        { type: Date, default: Date.now },
    transaction_type: { type: String, default: 'SALE' },
    customer: {
        customer_id: Number,
        name:  String,
        phone: String,
        email: String,
        city:  String
    },
    items: [{
        item_id:    Number,
        item_name:  String,
        quantity:   Number,
        unit_price: Number,
        line_total: Number,
        cost:       Number,
        profit:     Number
    }],
    total_amount:   { type: Number, required: true },
    total_profit:   { type: Number, required: true },
    payment_method: { type: String, default: 'Cash' },
    processed_by:   String
}, { timestamps: true });
const SalesLog = mongoose.model('sales_logs', SalesLogSchema);

const InventoryLogSchema = new mongoose.Schema({
    timestamp:       { type: Date, default: Date.now },
    action:          { type: String, required: true },
    item_id:         { type: Number, required: true },
    item_name:       String,
    quantity_change: Number,
    previous_stock:  Number,
    new_stock:       Number,
    performed_by:    String,
    reference:       String,
    notes:           String
}, { timestamps: true });
const InventoryLog = mongoose.model('inventory_logs', InventoryLogSchema);

const ReturnLogSchema = new mongoose.Schema({
    return_id:         { type: Number, required: true, unique: true },
    timestamp:         { type: Date, default: Date.now },
    original_sale_id:  Number,
    item_id:           Number,
    item_name:         String,
    quantity_returned: Number,
    reason:            String,
    disposition:       String,
    refund_amount:     Number,
    restocked:         Boolean,
    approved_by:       String,
    customer_name:     String,
    notes:             String
}, { timestamps: true });
const ReturnLog = mongoose.model('return_logs', ReturnLogSchema);

const ActivityLogSchema = new mongoose.Schema({
    user_id:      Number,
    username:     String,
    role:         String,
    action:       { type: String, required: true },
    reference_id: Number,
    created_at:   { type: Date, default: Date.now },
    details:      String
}, { timestamps: true });
const ActivityLog = mongoose.model('system_activity_logs', ActivityLogSchema);

// ★ Customer Analytics
const CustomerAnalyticsSchema = new mongoose.Schema({
    phone:              { type: String, required: true, unique: true },
    name:               String,
    email:              String,
    city:               String,
    total_spent:        { type: Number, default: 0 },
    total_orders:       { type: Number, default: 0 },
    avg_order_value:    { type: Number, default: 0 },
    last_purchase_date: Date,
    customer_segment:   { type: String, default: 'Regular' },
    loyalty_score:      { type: Number, default: 0 }
}, { timestamps: true });
const CustomerAnalytics = mongoose.model('customer_analytics', CustomerAnalyticsSchema);

// ★ Item Performance Analytics
const ItemPerformanceSchema = new mongoose.Schema({
    item_id:             { type: Number, required: true, unique: true },
    item_name:           String,
    total_quantity_sold: { type: Number, default: 0 },
    total_revenue:       { type: Number, default: 0 },
    total_profit:        { type: Number, default: 0 },
    profit_margin:       { type: Number, default: 0 },
    last_sold_date:      Date,
    performance_rating:  { type: String, default: 'Steady' }
}, { timestamps: true });
const ItemPerformance = mongoose.model('item_performance_analytics', ItemPerformanceSchema);

// ★ Daily Sales Summary
const DailySalesSummarySchema = new mongoose.Schema({
    date:                  { type: String, required: true, unique: true },
    total_sales:           { type: Number, default: 0 },
    total_profit:          { type: Number, default: 0 },
    transactions_count:    { type: Number, default: 0 },
    total_items_sold:      { type: Number, default: 0 },
    avg_transaction_value: { type: Number, default: 0 },
    top_selling_items:     [String]
}, { timestamps: true });
const DailySalesSummary = mongoose.model('daily_sales_summaries', DailySalesSummarySchema);

// ★ City Sales Analytics
const CitySalesSchema = new mongoose.Schema({
    city:                  { type: String, required: true, unique: true },
    total_sales_amount:    { type: Number, default: 0 },
    total_profit:          { type: Number, default: 0 },
    total_customers:       { type: Number, default: 0 },
    total_transactions:    { type: Number, default: 0 },
    total_items_sold:      { type: Number, default: 0 },
    avg_transaction_value: { type: Number, default: 0 },
    last_transaction_date: Date
}, { timestamps: true });
const CitySales = mongoose.model('city_sales_analytics', CitySalesSchema);

// ============================================
// ANALYTICS UPDATE HELPER
// Called automatically every time a sale is saved
// ============================================

async function updateAnalyticsFromSale(sale) {
    try {
        const saleDate   = new Date(sale.timestamp || Date.now()).toISOString().split('T')[0];
        const totalItems = (sale.items || []).reduce((s, i) => s + (i.quantity || 0), 0);

        // 1. Customer Analytics
        if (sale.customer && sale.customer.phone) {
            const existing      = await CustomerAnalytics.findOne({ phone: sale.customer.phone });
            const newTotalSpent = (existing?.total_spent  || 0) + (sale.total_amount || 0);
            const newOrders     = (existing?.total_orders || 0) + 1;
            const newAvg        = newTotalSpent / newOrders;
            let segment         = 'Regular';
            if (newTotalSpent >= 100000)     segment = 'VIP';
            else if (newTotalSpent >= 50000) segment = 'Loyal';
            else if (newOrders >= 5)         segment = 'Returning';

            await CustomerAnalytics.findOneAndUpdate(
                { phone: sale.customer.phone },
                { $set: {
                    name:               sale.customer.name,
                    email:              sale.customer.email,
                    city:               sale.customer.city,
                    total_spent:        newTotalSpent,
                    total_orders:       newOrders,
                    avg_order_value:    parseFloat(newAvg.toFixed(2)),
                    last_purchase_date: new Date(),
                    customer_segment:   segment,
                    loyalty_score:      Math.min(100, newOrders * 10)
                }},
                { upsert: true }
            );
        }

        // 2. Item Performance Analytics
        for (const item of (sale.items || [])) {
            if (!item.item_id) continue;
            const existing  = await ItemPerformance.findOne({ item_id: item.item_id });
            const newQty    = (existing?.total_quantity_sold || 0) + (item.quantity   || 0);
            const newRev    = (existing?.total_revenue       || 0) + (item.line_total || 0);
            const newProfit = (existing?.total_profit        || 0) + (item.profit     || 0);
            const margin    = newRev > 0 ? (newProfit / newRev) * 100 : 0;
            let rating      = 'Steady';
            if (newQty >= 100)     rating = 'Hot';
            else if (newQty >= 50) rating = 'Good';
            else if (newQty < 10)  rating = 'Slow';

            await ItemPerformance.findOneAndUpdate(
                { item_id: item.item_id },
                { $set: {
                    item_name:           item.item_name,
                    total_quantity_sold: newQty,
                    total_revenue:       newRev,
                    total_profit:        newProfit,
                    profit_margin:       parseFloat(margin.toFixed(2)),
                    last_sold_date:      new Date(),
                    performance_rating:  rating
                }},
                { upsert: true }
            );
        }

        // 3. Daily Sales Summary
        const existingDay  = await DailySalesSummary.findOne({ date: saleDate });
        const newDayTotal  = (existingDay?.total_sales        || 0) + (sale.total_amount || 0);
        const newDayProfit = (existingDay?.total_profit       || 0) + (sale.total_profit || 0);
        const newDayTxns   = (existingDay?.transactions_count || 0) + 1;
        const newDayItems  = (existingDay?.total_items_sold   || 0) + totalItems;

        await DailySalesSummary.findOneAndUpdate(
            { date: saleDate },
            { $set: {
                total_sales:           newDayTotal,
                total_profit:          newDayProfit,
                transactions_count:    newDayTxns,
                total_items_sold:      newDayItems,
                avg_transaction_value: parseFloat((newDayTotal / newDayTxns).toFixed(2))
            }},
            { upsert: true }
        );

        // 4. City Sales Analytics
        const city = sale.customer?.city;
        if (city) {
            const existingCity  = await CitySales.findOne({ city });
            const newCityTotal  = (existingCity?.total_sales_amount || 0) + (sale.total_amount || 0);
            const newCityProfit = (existingCity?.total_profit       || 0) + (sale.total_profit || 0);
            const newCityTxns   = (existingCity?.total_transactions || 0) + 1;
            const newCityItems  = (existingCity?.total_items_sold   || 0) + totalItems;

            // Only count as new customer if first time this phone appears in this city
            let custIncrement = 0;
            if (sale.customer?.phone) {
                const prevCount = await SalesLog.countDocuments({
                    'customer.city':  city,
                    'customer.phone': sale.customer.phone,
                    sale_id: { $ne: sale.sale_id }
                });
                if (prevCount === 0) custIncrement = 1;
            }

            await CitySales.findOneAndUpdate(
                { city },
                { $set: {
                    total_sales_amount:    newCityTotal,
                    total_profit:          newCityProfit,
                    total_transactions:    newCityTxns,
                    total_items_sold:      newCityItems,
                    avg_transaction_value: parseFloat((newCityTotal / newCityTxns).toFixed(2)),
                    last_transaction_date: new Date(),
                    total_customers:       (existingCity?.total_customers || 0) + custIncrement
                }},
                { upsert: true }
            );
        }

        console.log(`✅ Analytics updated for sale #${sale.sale_id} (${saleDate})`);
    } catch (err) {
        console.error('⚠️ Analytics update failed:', err.message);
    }
}

// ============================================
// ROUTES — HEALTH
// ============================================

app.get('/api/health', async (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    let mysqlStatus = 'Disconnected';
    try {
        const conn = await mysqlPool.getConnection();
        mysqlStatus = 'Connected';
        conn.release();
    } catch (e) { /* ignore */ }
    res.json({ status: 'Server is running', timestamp: new Date().toISOString(), databases: { mongodb: mongoStatus, mysql: mysqlStatus }, version: '2.0.0' });
});

// ============================================
// MYSQL ROUTES — CATEGORIES
// ============================================

app.get('/api/mysql/categories', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM categories ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/categories/:id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Category not found' });
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/categories', async (req, res) => {
    try {
        const { name, warranty } = req.body;
        const [result] = await mysqlPool.query('CALL sp_add_category(?, ?)', [name, warranty || 365]);
        const id = result[0][0].id;
        const [rows] = await mysqlPool.query('SELECT * FROM categories WHERE id = ?', [id]);
        res.status(201).json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/categories/:id', async (req, res) => {
    try {
        const { name, warranty } = req.body;
        await mysqlPool.query('CALL sp_update_category(?, ?, ?)', [req.params.id, name, warranty || 365]);
        const [rows] = await mysqlPool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/categories/:id', async (req, res) => {
    try {
        await mysqlPool.query('CALL sp_delete_category(?)', [req.params.id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// MYSQL ROUTES — SUPPLIERS
// ============================================

app.get('/api/mysql/suppliers', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM suppliers ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/suppliers/:id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Supplier not found' });
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/suppliers', async (req, res) => {
    try {
        const { name, contact } = req.body;
        const [result] = await mysqlPool.query('CALL sp_add_supplier(?, ?)', [name, contact || '']);
        const id = result[0][0].id;
        const [rows] = await mysqlPool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
        res.status(201).json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/suppliers/:id', async (req, res) => {
    try {
        const { name, contact } = req.body;
        await mysqlPool.query('CALL sp_update_supplier(?, ?, ?)', [req.params.id, name, contact || '']);
        const [rows] = await mysqlPool.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/suppliers/:id', async (req, res) => {
    try {
        await mysqlPool.query('CALL sp_delete_supplier(?)', [req.params.id]);
        res.json({ success: true, message: 'Supplier deleted' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// MYSQL ROUTES — STAFF
// ============================================

app.get('/api/mysql/staff', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM staff ORDER BY user_id');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/staff/:id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM staff WHERE user_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Staff not found' });
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/staff', async (req, res) => {
    try {
        const { username, role } = req.body;
        const [result] = await mysqlPool.query('CALL sp_add_staff(?, ?)', [username, role || 'Staff']);
        const uid = result[0][0].user_id;
        const [rows] = await mysqlPool.query('SELECT * FROM staff WHERE user_id = ?', [uid]);
        res.status(201).json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/staff/:id', async (req, res) => {
    try {
        const { username, role } = req.body;
        await mysqlPool.query('CALL sp_update_staff(?, ?, ?)', [req.params.id, username, role || 'Staff']);
        const [rows] = await mysqlPool.query('SELECT * FROM staff WHERE user_id = ?', [req.params.id]);
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/staff/:id', async (req, res) => {
    try {
        await mysqlPool.query('CALL sp_delete_staff(?)', [req.params.id]);
        res.json({ success: true, message: 'Staff deleted' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// MYSQL ROUTES — CUSTOMERS
// ============================================

app.get('/api/mysql/customers', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM customers ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/customers/:id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/customers', async (req, res) => {
    try {
        const { name, phone, email, city } = req.body;
        const [result] = await mysqlPool.query('CALL sp_add_customer(?, ?, ?, ?)', [name, phone || '', email || '', city || '']);
        const id = result[0][0].id;
        const [rows] = await mysqlPool.query('SELECT * FROM customers WHERE id = ?', [id]);
        res.status(201).json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/customers/:id', async (req, res) => {
    try {
        const { name, phone, email, city } = req.body;
        await mysqlPool.query('CALL sp_update_customer(?, ?, ?, ?, ?)', [req.params.id, name, phone || '', email || '', city || '']);
        const [rows] = await mysqlPool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/customers/:id', async (req, res) => {
    try {
        await mysqlPool.query('CALL sp_delete_customer(?)', [req.params.id]);
        res.json({ success: true, message: 'Customer deleted' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// MYSQL ROUTES — PRODUCTS (replaces MongoDB items)
// ============================================

app.get('/api/mysql/products', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT p.*, c.name AS category_name, c.warranty, s.name AS supplier_name,
                   fn_get_product_margin(p.price, p.cost) AS margin,
                   fn_get_stock_status(p.qty, 10) AS stock_status
            FROM products p
            LEFT JOIN categories c ON p.type_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.id
        `);
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/products/:id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT p.*, c.name AS category_name, c.warranty, s.name AS supplier_name,
                   fn_get_product_margin(p.price, p.cost) AS margin,
                   fn_get_stock_status(p.qty, 10) AS stock_status
            FROM products p
            LEFT JOIN categories c ON p.type_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = ?
        `, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/products', async (req, res) => {
    try {
        const { name, price, cost, qty, supplier_id, type_id } = req.body;
        const [result] = await mysqlPool.query('CALL sp_add_product(?, ?, ?, ?, ?, ?)',
            [name, price, cost, qty || 0, supplier_id, type_id]);
        const id = result[0][0].id;
        const [rows] = await mysqlPool.query('SELECT * FROM products WHERE id = ?', [id]);
        res.status(201).json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/products/:id', async (req, res) => {
    try {
        const { name, price, cost, qty, supplier_id, type_id } = req.body;
        await mysqlPool.query('CALL sp_update_product(?, ?, ?, ?, ?, ?, ?)',
            [req.params.id, name, price, cost, qty, supplier_id, type_id]);
        const [rows] = await mysqlPool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/products/:id', async (req, res) => {
    try {
        await mysqlPool.query('CALL sp_delete_product(?)', [req.params.id]);
        res.json({ success: true, message: 'Product deleted' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.patch('/api/mysql/products/:id/stock', async (req, res) => {
    try {
        const { qty, action } = req.body;
        // action = 'ADD' | 'SUBTRACT' | 'SET'
        const [result] = await mysqlPool.query('CALL sp_update_stock(?, ?, ?)',
            [req.params.id, qty, action || 'SET']);
        res.json({ success: true, data: result[0][0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/products/low-stock/:threshold', async (req, res) => {
    try {
        const [result] = await mysqlPool.query('CALL sp_get_low_stock(?)', [req.params.threshold || 10]);
        res.json({ success: true, data: result[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// MYSQL ROUTES — SALES (via stored procedures)
// ============================================

app.post('/api/mysql/sales', async (req, res) => {
    try {
        const { customer_name, customer_phone, customer_email, customer_city,
                items, total_amount, total_profit, payment_method, processed_by } = req.body;

        // Create sale via stored procedure
        const [saleResult] = await mysqlPool.query('CALL sp_process_sale(?, ?, ?, ?, ?, ?, ?, ?)',
            [customer_name, customer_phone, customer_email || '', customer_city || '',
             total_amount, total_profit, payment_method || 'Cash', processed_by]);
        const saleId = saleResult[0][0].sale_id;
        const customerId = saleResult[0][0].customer_id;

        // Add sale items
        const saleItems = [];
        for (const item of (items || [])) {
            const [itemResult] = await mysqlPool.query('CALL sp_add_sale_item(?, ?, ?, ?, ?, ?)',
                [saleId, item.item_id, item.quantity, item.unit_price, item.cost, item.warranty_days || 365]);
            saleItems.push(itemResult[0][0]);
        }

        res.status(201).json({ success: true, data: { sale_id: saleId, customer_id: customerId, items: saleItems } });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/sales', async (req, res) => {
    try {
        const [sales] = await mysqlPool.query(`
            SELECT s.*, 
                   (SELECT JSON_ARRAYAGG(
                       JSON_OBJECT('id', si.id, 'item_id', si.item_id, 'qty', si.qty,
                                   'sold_price', si.sold_price, 'cost', si.cost,
                                   'line_total', si.line_total, 'profit', si.profit,
                                   'warranty_expiration', si.warranty_expiration,
                                   'item_name', (SELECT name FROM products WHERE id = si.item_id))
                   ) FROM sale_item si WHERE si.sale_id = s.id) AS items
            FROM sales s ORDER BY s.id DESC LIMIT 500
        `);
        // Parse items JSON
        sales.forEach(s => {
            try { s.items = JSON.parse(s.items) || []; } catch { s.items = []; }
        });
        res.json({ success: true, data: sales });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/sales/:id', async (req, res) => {
    try {
        const [sales] = await mysqlPool.query('SELECT * FROM sales WHERE id = ?', [req.params.id]);
        if (sales.length === 0) return res.status(404).json({ success: false, error: 'Sale not found' });
        const [items] = await mysqlPool.query(`
            SELECT si.*, p.name AS item_name FROM sale_item si
            LEFT JOIN products p ON si.item_id = p.id
            WHERE si.sale_id = ?
        `, [req.params.id]);
        res.json({ success: true, data: { ...sales[0], items } });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// MYSQL ROUTES — SALE ITEMS
// ============================================

app.get('/api/mysql/sale-items', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT si.*, p.name AS item_name, s.sale_date, s.customer_name, s.customer_phone
            FROM sale_item si
            LEFT JOIN products p ON si.item_id = p.id
            LEFT JOIN sales s ON si.sale_id = s.id
            ORDER BY si.id DESC
        `);
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/sale-items/by-sale/:saleId', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT si.*, p.name AS item_name FROM sale_item si
            LEFT JOIN products p ON si.item_id = p.id
            WHERE si.sale_id = ?
        `, [req.params.saleId]);
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// MYSQL ROUTES — RETURNS
// ============================================

app.post('/api/mysql/returns', async (req, res) => {
    try {
        const { sale_id, sale_item_id, item_id, item_name, qty, sold_price,
                reason, approved_by, customer_name } = req.body;
        const [result] = await mysqlPool.query('CALL sp_process_return(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [sale_id, sale_item_id, item_id, item_name, qty, sold_price, reason, approved_by, customer_name]);
        res.status(201).json({ success: true, data: result[0][0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/mysql/returns', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM returns_tbl ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// BACKWARD COMPAT ROUTES — /api/items → MySQL
// ============================================

app.get('/api/items', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT p.id, p.name, p.price, p.cost, p.qty,
                   p.supplier_id AS supplierId, p.type_id AS typeId
            FROM products p ORDER BY p.id
        `);
        res.json({ success: true, data: rows, count: rows.length });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT id, name, price, cost, qty, supplier_id AS supplierId, type_id AS typeId FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Item not found' });
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.patch('/api/items/:id/stock', async (req, res) => {
    try {
        const { qty } = req.body;
        if (qty === undefined) return res.status(400).json({ success: false, error: 'qty required' });
        await mysqlPool.query('CALL sp_update_stock(?, ?, ?)', [req.params.id, qty, 'SET']);
        const [rows] = await mysqlPool.query('SELECT id, name, price, cost, qty, supplier_id AS supplierId, type_id AS typeId FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/items/:id', async (req, res) => {
    try {
        const { name, price, cost, qty, supplierId, typeId } = req.body;
        await mysqlPool.query('CALL sp_update_product(?, ?, ?, ?, ?, ?, ?)',
            [req.params.id, name, price, cost, qty, supplierId || req.body.supplier_id, typeId || req.body.type_id]);
        const [rows] = await mysqlPool.query('SELECT id, name, price, cost, qty, supplier_id AS supplierId, type_id AS typeId FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/items/seed', async (req, res) => {
    try {
        // Seed from array — used by data-loader backwards compat
        const items = req.body;
        if (!Array.isArray(items)) return res.status(400).json({ success: false, error: 'Expected array' });
        for (const item of items) {
            const [existing] = await mysqlPool.query('SELECT id FROM products WHERE id = ?', [item.id]);
            if (existing.length === 0) {
                await mysqlPool.query(
                    'INSERT INTO products (id, name, price, cost, qty, supplier_id, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [item.id, item.name, item.price, item.cost, item.qty, item.supplierId || item.supplier_id, item.typeId || item.type_id]
                );
            }
        }
        res.json({ success: true, count: items.length });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// ROUTES — SALES
// ============================================

app.post('/api/sales', async (req, res) => {
    try {
        const sale = await SalesLog.create(req.body);
        await updateAnalyticsFromSale(sale); // ★ auto-update all analytics
        await ActivityLog.create({
            user_id: 0, username: req.body.processed_by || 'system', role: 'Cashier',
            action: 'PROCESS_SALE', reference_id: sale.sale_id,
            details: `Sale #${sale.sale_id} - ₱${sale.total_amount} to ${sale.customer?.name || 'customer'}`
        });
        res.status(201).json({ success: true, data: sale });
    } catch (e) {
        console.error('Error creating sale:', e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.get('/api/sales', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const sales = await SalesLog.find().sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit);
        const total = await SalesLog.countDocuments();
        res.json({ success: true, data: sales, total, page, limit });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/sales/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const sales = await SalesLog.find({ timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) } }).sort({ timestamp: -1 });
        res.json({ success: true, data: sales });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// ROUTES — INVENTORY LOGS
// ============================================

app.get('/api/inventory-logs', async (req, res) => {
    try {
        const logs = await InventoryLog.find().sort({ timestamp: -1 }).limit(500);
        res.json({ success: true, data: logs, count: logs.length });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/inventory-logs', async (req, res) => {
    try {
        const log = await InventoryLog.create(req.body);
        res.status(201).json({ success: true, data: log });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/inventory-logs/:itemId', async (req, res) => {
    try {
        const logs = await InventoryLog.find({ item_id: Number(req.params.itemId) }).sort({ timestamp: -1 }).limit(100);
        res.json({ success: true, data: logs });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// ROUTES — RETURNS
// ============================================

app.post('/api/returns', async (req, res) => {
    try {
        const r = await ReturnLog.create(req.body);
        await ActivityLog.create({
            user_id: 0, username: req.body.approved_by || 'system', role: 'Staff',
            action: 'PROCESS_RETURN', reference_id: r.return_id,
            details: `Return #${r.return_id} - ₱${r.refund_amount}`
        });
        res.status(201).json({ success: true, data: r });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/returns', async (req, res) => {
    try {
        const returns = await ReturnLog.find().sort({ timestamp: -1 }).limit(100);
        res.json({ success: true, data: returns });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// ROUTES — ACTIVITY
// ============================================

app.get('/api/activity', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const activities = await ActivityLog.find().sort({ created_at: -1 }).limit(limit);
        res.json({ success: true, data: activities });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/activity', async (req, res) => {
    try {
        const activity = await ActivityLog.create(req.body);
        res.status(201).json({ success: true, data: activity });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// ROUTES — ANALYTICS (READ)
// ============================================

app.get('/api/analytics/customers', async (req, res) => {
    try {
        const data = await CustomerAnalytics.find().sort({ total_spent: -1 }).limit(100);
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/analytics/items', async (req, res) => {
    try {
        const data = await ItemPerformance.find().sort({ total_quantity_sold: -1 }).limit(100);
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/analytics/daily', async (req, res) => {
    try {
        const data = await DailySalesSummary.find().sort({ date: -1 }).limit(90);
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/analytics/cities', async (req, res) => {
    try {
        const data = await CitySales.find().sort({ total_sales_amount: -1 });
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const today        = new Date().toISOString().split('T')[0];
        const todaySummary = await DailySalesSummary.findOne({ date: today });
        const topItems     = await ItemPerformance.find().sort({ total_quantity_sold: -1 }).limit(5);
        const topCustomers = await CustomerAnalytics.find().sort({ total_spent: -1 }).limit(5);
        const topCities    = await CitySales.find().sort({ total_sales_amount: -1 }).limit(5);
        res.json({ success: true, data: {
            today:         todaySummary || { total_sales: 0, total_profit: 0, transactions_count: 0 },
            top_items:     topItems,
            top_customers: topCustomers,
            top_cities:    topCities
        }});
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================
// SERVE FRONTEND
// ============================================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('================================================');
    console.log('🚀 TechZone Inventory System Server');
    console.log('================================================');
    console.log(`📡 Server:    http://localhost:${PORT}`);
    console.log(`🏥 Health:    http://localhost:${PORT}/api/health`);
    console.log(`📦 Products:  http://localhost:${PORT}/api/mysql/products`);
    console.log(`📂 Categories:http://localhost:${PORT}/api/mysql/categories`);
    console.log(`📊 Analytics: http://localhost:${PORT}/api/analytics/dashboard`);
    console.log('================================================');
    console.log('   MySQL → categories, suppliers, staff, customers, products, sales, sale_item, returns_tbl');
    console.log('   MongoDB → sales_logs, inventory_logs, return_logs, activity_logs, analytics');
    console.log('================================================');
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    await mysqlPool.end();
    console.log('✅ MySQL connection pool closed');
    process.exit(0);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});