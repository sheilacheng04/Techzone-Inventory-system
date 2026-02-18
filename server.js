// ============================================
// TECHZONE INVENTORY SYSTEM - MAIN SERVER
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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
// DATABASE CONNECTION
// ============================================

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI not found in .env file');
    process.exit(1);
}

// ============================================
// AUTO-SEED ITEMS ON STARTUP
// ============================================

const DEFAULT_ITEMS = [
    { id: 1,  name: 'Ryzen 5 5600',     price: 8500,  cost: 6500,  qty: 50,  supplierId: 1,  typeId: 1 },
    { id: 2,  name: 'RTX 4060',          price: 18500, cost: 16000, qty: 20,  supplierId: 2,  typeId: 2 },
    { id: 3,  name: '8GB DDR4 RAM',      price: 1500,  cost: 900,   qty: 100, supplierId: 3,  typeId: 3 },
    { id: 4,  name: 'Logitech G102',     price: 995,   cost: 700,   qty: 45,  supplierId: 4,  typeId: 4 },
    { id: 5,  name: '24 IPS Monitor',    price: 7500,  cost: 5500,  qty: 30,  supplierId: 5,  typeId: 5 },
    { id: 6,  name: 'Mech Keyboard',     price: 2500,  cost: 1800,  qty: 60,  supplierId: 6,  typeId: 4 },
    { id: 7,  name: '1TB NVMe SSD',      price: 3500,  cost: 2500,  qty: 40,  supplierId: 3,  typeId: 6 },
    { id: 8,  name: 'Ryzen 7 5700X',     price: 12000, cost: 9500,  qty: 15,  supplierId: 1,  typeId: 1 },
    { id: 9,  name: 'B550m Motherboard', price: 6500,  cost: 5000,  qty: 25,  supplierId: 2,  typeId: 7 },
    { id: 10, name: 'RTX 4070',          price: 38000, cost: 34000, qty: 10,  supplierId: 7,  typeId: 2 },
    { id: 11, name: '650W PSU',          price: 3000,  cost: 2200,  qty: 35,  supplierId: 8,  typeId: 8 },
    { id: 12, name: 'Webcam 1080p',      price: 1200,  cost: 800,   qty: 50,  supplierId: 4,  typeId: 4 },
    { id: 13, name: 'Gaming Chair',      price: 8000,  cost: 5000,  qty: 12,  supplierId: 9,  typeId: 9 },
    { id: 14, name: 'Ring Light',        price: 500,   cost: 200,   qty: 80,  supplierId: 10, typeId: 10 },
    { id: 15, name: 'Microphone USB',    price: 2500,  cost: 1500,  qty: 40,  supplierId: 11, typeId: 11 },
    { id: 16, name: 'Sound Card',        price: 1500,  cost: 900,   qty: 20,  supplierId: 12, typeId: 11 },
    { id: 17, name: 'RTX 3060',          price: 18000, cost: 14000, qty: 0,   supplierId: 2,  typeId: 2 },
];

async function autoSeedMySQL() {
    try {
        // Seed users if empty
        const [userCount] = await mysqlPool.query("SELECT COUNT(*) as count FROM users");
        if (userCount[0].count === 0) {
            console.log("🌱 Seeding MySQL users...");
            await mysqlPool.query(`INSERT INTO users (Username, Role) VALUES
                ('admin', 'Admin'), ('cashier_01', 'Staff'), ('cashier_02', 'Staff'),
                ('manager_01', 'Manager'), ('staff', 'Staff')`);
            console.log("✅ MySQL users seeded");
        }

        // Seed item_type if empty
        const [typeCount] = await mysqlPool.query("SELECT COUNT(*) as count FROM item_type");
        if (typeCount[0].count === 0) {
            console.log("🌱 Seeding MySQL item types...");
            await mysqlPool.query(`INSERT INTO item_type (TYPE_Name, Warranty_Days) VALUES
                ('Processor', 365), ('Graphics Card', 365), ('Memory', 365),
                ('Peripherals', 365), ('Monitor', 365), ('Storage', 365),
                ('Motherboard', 365), ('Power Supply', 365), ('Furniture', 30),
                ('Accessories', 30), ('Audio', 365)`);
            console.log("✅ MySQL item types seeded");
        }

        // Seed supplier if empty
        const [supCount] = await mysqlPool.query("SELECT COUNT(*) as count FROM supplier");
        if (supCount[0].count === 0) {
            console.log("🌱 Seeding MySQL suppliers...");
            await mysqlPool.query(`INSERT INTO supplier (SUPPLIER_Name, SUPPLIER_Contact) VALUES
                ('AMD Phil', '02-8888-1111'), ('Asus Ph', '02-8888-2222'),
                ('Kingston D.', '02-8888-3333'), ('Logi Dist', '02-8888-4444'),
                ('Nvision', '0917-000-1111'), ('Rakk Gears', '0918-000-2222'),
                ('Gigabyte Ph', '02-8888-5555'), ('Corsair D.', '02-8888-6666'),
                ('SecretLab', '02-8888-7777'), ('Generic', 'N/A'),
                ('Maono', '0919-000-3333'), ('Creative', '02-8888-8888')`);
            console.log("✅ MySQL suppliers seeded");
        }

        // Seed items if empty
        const [itemCount] = await mysqlPool.query("SELECT COUNT(*) as count FROM item");
        if (itemCount[0].count === 0) {
            console.log("🌱 Seeding MySQL items...");
            await mysqlPool.query(`INSERT INTO item (ITEM_Name, ITEM_SellingPrice, ITEM_WholesaleCost, ITEM_Quantity, SUPPLIER_ID, ITEM_TYPE_ID) VALUES
                ('Ryzen 5 5600', 8500, 6500, 50, 1, 1),
                ('RTX 4060', 18500, 16000, 20, 2, 2),
                ('8GB DDR4 RAM', 1500, 900, 100, 3, 3),
                ('Logitech G102', 995, 700, 45, 4, 4),
                ('24 IPS Monitor', 7500, 5500, 30, 5, 5),
                ('Mech Keyboard', 2500, 1800, 60, 6, 4),
                ('1TB NVMe SSD', 3500, 2500, 40, 3, 6),
                ('Ryzen 7 5700X', 12000, 9500, 15, 1, 1),
                ('B550m Motherboard', 6500, 5000, 25, 2, 7),
                ('RTX 4070', 38000, 34000, 10, 7, 2),
                ('650W PSU', 3000, 2200, 35, 8, 8),
                ('Webcam 1080p', 1200, 800, 50, 4, 4),
                ('Gaming Chair', 8000, 5000, 12, 9, 9),
                ('Ring Light', 500, 200, 80, 10, 10),
                ('Microphone USB', 2500, 1500, 40, 11, 11),
                ('Sound Card', 1500, 900, 20, 12, 11),
                ('RTX 3060', 18000, 14000, 0, 2, 2)`);
            console.log("✅ MySQL items seeded — 17 products ready");
        }
    } catch (err) {
        console.error("⚠️ MySQL auto-seed failed:", err.message);
    }
}

async function autoSeedItems() {
    try {
        // Dynamically get the Item model (defined later in schemas)
        const ItemModel = mongoose.model('items');
        const count = await ItemModel.countDocuments();
        if (count === 0) {
            console.log('🌱 Items collection empty — auto-seeding 17 items...');
            for (const item of DEFAULT_ITEMS) {
                await ItemModel.findOneAndUpdate(
                    { id: item.id },
                    { $setOnInsert: item },
                    { upsert: true, new: true }
                );
            }
            console.log('✅ Items seeded successfully — 17 products ready');
        } else {
            console.log(`✅ Items collection already has ${count} products — skipping seed`);
        }
    } catch (err) {
        console.error('⚠️ Auto-seed failed:', err.message);
    }
}

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
    await autoSeedItems();
})
.catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
});


// ============================================
// MYSQL CONNECTION
// ============================================

const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host:     process.env.MYSQL_HOST     || 'localhost',
    port:     process.env.MYSQL_PORT     || 3306,
    user:     process.env.MYSQL_USER     || 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE || 'TechZoneSQL',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

mysqlPool.getConnection()
    .then(async connection => {
        console.log('✅ MySQL Connected Successfully');
        console.log('   📊 Database:', process.env.MYSQL_DATABASE || 'TechZoneSQL');
        connection.release();
        await autoSeedMySQL(); // ★ auto-seed MySQL tables if empty
    })
    .catch(err => {
        console.error('❌ MySQL Connection Failed:', err.message);
        console.error('   💡 Make sure MySQL is running and credentials are correct in .env');
    });

// ============================================
// SCHEMAS
// ============================================

const ItemSchema = new mongoose.Schema({
    id:         { type: Number, required: true, unique: true },
    name:       { type: String, required: true },
    price:      { type: Number, required: true },
    cost:       { type: Number, required: true },
    qty:        { type: Number, required: true, default: 0 },
    supplierId: Number,
    typeId:     Number
}, { timestamps: true });
const Item = mongoose.model('items', ItemSchema);

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
        await mysqlPool.query('SELECT 1');
        mysqlStatus = 'Connected';
    } catch (e) { mysqlStatus = 'Disconnected'; }
    res.json({ status: 'Server is running', timestamp: new Date().toISOString(), databases: { mongodb: mongoStatus, mysql: mysqlStatus }, version: '1.0.0' });
});

// ============================================
// ROUTES — ITEMS
// ============================================

app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ id: 1 });
        res.json({ success: true, data: items, count: items.length });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findOne({ id: Number(req.params.id) });
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/items/seed', async (req, res) => {
    try {
        const items = req.body;
        if (!Array.isArray(items)) return res.status(400).json({ success: false, error: 'Expected array' });
        const results = [];
        for (const item of items) {
            const r = await Item.findOneAndUpdate({ id: item.id }, { $setOnInsert: item }, { upsert: true, new: true });
            results.push(r);
        }
        res.json({ success: true, data: results, count: results.length });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.patch('/api/items/:id/stock', async (req, res) => {
    try {
        const { qty } = req.body;
        if (qty === undefined) return res.status(400).json({ success: false, error: 'qty required' });
        const item = await Item.findOneAndUpdate({ id: Number(req.params.id) }, { $set: { qty: Number(qty) } }, { new: true });
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findOneAndUpdate({ id: Number(req.params.id) }, { $set: req.body }, { new: true });
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
        res.json({ success: true, data: item });
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
// MYSQL API ROUTES — using exact table names from DDL
// Tables: customer, item, item_type, supplier, users,
//         sale, sale_item, return_transaction, inventory_movement
// ============================================

// === CATEGORIES (item_type table) ===
app.get('/api/mysql/categories', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT ITEM_TYPE_ID as id, TYPE_Name as name, Warranty_Days as warranty FROM item_type ORDER BY ITEM_TYPE_ID');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/categories', async (req, res) => {
    try {
        const { name, warranty } = req.body;
        const [result] = await mysqlPool.query('INSERT INTO item_type (TYPE_Name, Warranty_Days) VALUES (?, ?)', [name, warranty || 365]);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/categories/:id', async (req, res) => {
    try {
        const { name, warranty } = req.body;
        await mysqlPool.query('UPDATE item_type SET TYPE_Name=?, Warranty_Days=? WHERE ITEM_TYPE_ID=?', [name, warranty, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/categories/:id', async (req, res) => {
    try {
        await mysqlPool.query('DELETE FROM item_type WHERE ITEM_TYPE_ID=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// === SUPPLIERS ===
app.get('/api/mysql/suppliers', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT SUPPLIER_ID as id, SUPPLIER_Name as name, SUPPLIER_Contact as contact FROM supplier WHERE Is_Active=1 ORDER BY SUPPLIER_ID');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/suppliers', async (req, res) => {
    try {
        const { name, contact } = req.body;
        const [result] = await mysqlPool.query('INSERT INTO supplier (SUPPLIER_Name, SUPPLIER_Contact) VALUES (?, ?)', [name, contact]);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/suppliers/:id', async (req, res) => {
    try {
        const { name, contact } = req.body;
        await mysqlPool.query('UPDATE supplier SET SUPPLIER_Name=?, SUPPLIER_Contact=? WHERE SUPPLIER_ID=?', [name, contact, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/suppliers/:id', async (req, res) => {
    try {
        await mysqlPool.query('UPDATE supplier SET Is_Active=0 WHERE SUPPLIER_ID=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// === STAFF (users table) ===
app.get('/api/mysql/staff', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT USER_ID as user_id, Username as username, Role as role FROM users WHERE Is_Active=1 ORDER BY USER_ID');
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/staff', async (req, res) => {
    try {
        const { username, role } = req.body;
        const [result] = await mysqlPool.query('INSERT INTO users (Username, Role) VALUES (?, ?)', [username, role || 'Staff']);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/staff/:id', async (req, res) => {
    try {
        const { username, role } = req.body;
        await mysqlPool.query('UPDATE users SET Username=?, Role=? WHERE USER_ID=?', [username, role, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/staff/:id', async (req, res) => {
    try {
        await mysqlPool.query('UPDATE users SET Is_Active=0 WHERE USER_ID=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// === PRODUCTS (item table) ===
app.get('/api/mysql/products', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT i.ITEM_ID as id, i.ITEM_Name as name,
                   i.ITEM_SellingPrice as price, i.ITEM_WholesaleCost as cost,
                   i.ITEM_Quantity as qty, i.Reorder_Level as reorder_level,
                   i.SUPPLIER_ID as supplier_id, i.ITEM_TYPE_ID as type_id,
                   it.TYPE_Name as type_name, it.Warranty_Days as warranty,
                   s.SUPPLIER_Name as supplier_name
            FROM item i
            JOIN item_type it ON i.ITEM_TYPE_ID = it.ITEM_TYPE_ID
            JOIN supplier s ON i.SUPPLIER_ID = s.SUPPLIER_ID
            WHERE i.Is_Active = 1
            ORDER BY i.ITEM_ID
        `);
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/mysql/products', async (req, res) => {
    try {
        const { name, price, cost, qty, supplier_id, type_id, reorder_level } = req.body;
        const [result] = await mysqlPool.query(
            'INSERT INTO item (ITEM_Name, ITEM_SellingPrice, ITEM_WholesaleCost, ITEM_Quantity, SUPPLIER_ID, ITEM_TYPE_ID, Reorder_Level) VALUES (?,?,?,?,?,?,?)',
            [name, price, cost, qty || 0, supplier_id, type_id, reorder_level || 5]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/mysql/products/:id', async (req, res) => {
    try {
        const { name, price, cost, qty, supplier_id, type_id, reorder_level } = req.body;
        await mysqlPool.query(
            'UPDATE item SET ITEM_Name=?, ITEM_SellingPrice=?, ITEM_WholesaleCost=?, ITEM_Quantity=?, SUPPLIER_ID=?, ITEM_TYPE_ID=?, Reorder_Level=? WHERE ITEM_ID=?',
            [name, price, cost, qty, supplier_id, type_id, reorder_level || 5, req.params.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.patch('/api/mysql/products/:id/stock', async (req, res) => {
    try {
        const { qty } = req.body;
        await mysqlPool.query('UPDATE item SET ITEM_Quantity=? WHERE ITEM_ID=?', [qty, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/mysql/products/:id', async (req, res) => {
    try {
        await mysqlPool.query('UPDATE item SET Is_Active=0 WHERE ITEM_ID=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET all customers from MySQL
app.get('/api/mysql/customers', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM CUSTOMER WHERE Is_Active = 1 ORDER BY Created_On DESC');
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// POST new customer to MySQL
app.post('/api/mysql/customers', async (req, res) => {
    try {
        const { name, phone, email, city, province, address } = req.body;
        const [result] = await mysqlPool.query(
            'INSERT INTO CUSTOMER (CUSTOMER_Name, CUSTOMER_Phone, CUSTOMER_Email, City, Province, Full_Address) VALUES (?, ?, ?, ?, ?, ?)',
            [name, phone, email || null, city, province || null, address || null]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// GET all items from MySQL
app.get('/api/mysql/items', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT i.*, it.TYPE_Name, it.Warranty_Days, s.SUPPLIER_Name
            FROM ITEM i
            JOIN ITEM_TYPE it ON i.ITEM_TYPE_ID = it.ITEM_TYPE_ID
            JOIN SUPPLIER s ON i.SUPPLIER_ID = s.SUPPLIER_ID
            WHERE i.Is_Active = 1
            ORDER BY i.ITEM_ID
        `);
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// PATCH item stock in MySQL
app.patch('/api/mysql/items/:id/stock', async (req, res) => {
    try {
        const { qty } = req.body;
        await mysqlPool.query(
            'UPDATE ITEM SET ITEM_Quantity = ? WHERE ITEM_ID = ?',
            [qty, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// POST new sale to MySQL
app.post('/api/mysql/sales', async (req, res) => {
    const conn = await mysqlPool.getConnection();
    try {
        await conn.beginTransaction();

        const { customer_id, created_by, items, subtotal, total_amount, profit_amount, payment_method } = req.body;

        // Insert sale
        const [saleResult] = await conn.query(
            `INSERT INTO SALE (CUSTOMER_ID, Created_By, Subtotal, Total_Amount, Profit_Amount, Payment_Method)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [customer_id, created_by || 1, subtotal, total_amount, profit_amount, payment_method || 'Cash']
        );
        const saleId = saleResult.insertId;

        // Insert sale items + update stock + log movement
        for (const item of items) {
            await conn.query(
                `INSERT INTO SALE_ITEM (SALE_ID, ITEM_ID, Quantity_Sold, Sold_Price, Cost_At_Sale)
                 VALUES (?, ?, ?, ?, ?)`,
                [saleId, item.item_id, item.quantity, item.unit_price, item.cost]
            );

            // Get current stock
            const [stockRows] = await conn.query('SELECT ITEM_Quantity FROM ITEM WHERE ITEM_ID = ?', [item.item_id]);
            const stockBefore = stockRows[0]?.ITEM_Quantity || 0;
            const stockAfter  = stockBefore - item.quantity;

            // Deduct stock
            await conn.query('UPDATE ITEM SET ITEM_Quantity = ? WHERE ITEM_ID = ?', [stockAfter, item.item_id]);

            // Log inventory movement
            await conn.query(
                `INSERT INTO INVENTORY_MOVEMENT (ITEM_ID, Reference_Type, Reference_ID, Quantity_Change, Stock_Before, Stock_After, Performed_By)
                 VALUES (?, 'SALE', ?, ?, ?, ?, ?)`,
                [item.item_id, saleId, -item.quantity, stockBefore, stockAfter, created_by || 1]
            );
        }

        await conn.commit();
        res.status(201).json({ success: true, sale_id: saleId });
    } catch (e) {
        await conn.rollback();
        res.status(500).json({ success: false, error: e.message });
    } finally {
        conn.release();
    }
});

// GET all sales from MySQL
app.get('/api/mysql/sales', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT s.*, c.CUSTOMER_Name, c.City, u.Username
            FROM SALE s
            JOIN CUSTOMER c ON s.CUSTOMER_ID = c.CUSTOMER_ID
            JOIN USERS u ON s.Created_By = u.USER_ID
            ORDER BY s.SALE_Date DESC
            LIMIT 100
        `);
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// POST return to MySQL
app.post('/api/mysql/returns', async (req, res) => {
    const conn = await mysqlPool.getConnection();
    try {
        await conn.beginTransaction();
        const { sale_id, processed_by, refund_amount, loss_amount, items } = req.body;

        const [result] = await conn.query(
            `INSERT INTO RETURN_TRANSACTION (SALE_ID, Processed_By, Refund_Amount, Loss_Amount, RETURN_Status)
             VALUES (?, ?, ?, ?, 'Approved')`,
            [sale_id, processed_by || 1, refund_amount, loss_amount || 0]
        );
        const returnId = result.insertId;

        // Restock items and log movement
        for (const item of (items || [])) {
            if (item.restock) {
                const [stockRows] = await conn.query('SELECT ITEM_Quantity FROM ITEM WHERE ITEM_ID = ?', [item.item_id]);
                const stockBefore = stockRows[0]?.ITEM_Quantity || 0;
                const stockAfter  = stockBefore + item.quantity;

                await conn.query('UPDATE ITEM SET ITEM_Quantity = ? WHERE ITEM_ID = ?', [stockAfter, item.item_id]);

                await conn.query(
                    `INSERT INTO INVENTORY_MOVEMENT (ITEM_ID, Reference_Type, Reference_ID, Quantity_Change, Stock_Before, Stock_After, Performed_By)
                     VALUES (?, 'RETURN', ?, ?, ?, ?, ?)`,
                    [item.item_id, returnId, item.quantity, stockBefore, stockAfter, processed_by || 1]
                );
            }
        }

        await conn.commit();
        res.status(201).json({ success: true, return_id: returnId });
    } catch (e) {
        await conn.rollback();
        res.status(500).json({ success: false, error: e.message });
    } finally {
        conn.release();
    }
});

// GET inventory movements from MySQL
app.get('/api/mysql/inventory', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query(`
            SELECT im.*, i.ITEM_Name, u.Username
            FROM INVENTORY_MOVEMENT im
            JOIN ITEM i ON im.ITEM_ID = i.ITEM_ID
            LEFT JOIN USERS u ON im.Performed_By = u.USER_ID
            ORDER BY im.Movement_Date DESC
            LIMIT 200
        `);
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
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
    console.log(`📦 Items:     http://localhost:${PORT}/api/items`);
    console.log(`📊 Analytics: http://localhost:${PORT}/api/analytics/dashboard`);
    console.log('================================================');
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});