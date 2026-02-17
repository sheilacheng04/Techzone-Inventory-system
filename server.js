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
// MIDDLEWARE CONFIGURATION
// ============================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for now
}));

// CORS - Allow frontend to access API
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname)));

// ============================================
// DATABASE CONNECTIONS
// ============================================

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI not found in .env file');
    process.exit(1);
}

console.log('🔌 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('   📊 Database:', mongoose.connection.db.databaseName);
    console.log('   🔗 Host:', mongoose.connection.host);
})
.catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.error('   💡 Make sure MongoDB is running locally or check Atlas connection');
});

// MySQL Connection (optional - uncomment when ready)
/*
const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

mysqlPool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Connected');
        console.log('   📊 Database:', process.env.MYSQL_DATABASE);
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL Connection Failed:', err.message);
    });
*/

// ============================================
// MONGODB SCHEMAS (Based on your README)
// ============================================

// Sales Log Schema
const SalesLogSchema = new mongoose.Schema({
    sale_id: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
    customer: {
        name: String,
        phone: String,
        city: String
    },
    items: [{
        item_id: String,
        item_name: String,
        quantity: Number,
        unit_price: Number,
        total_price: Number,
        profit: Number
    }],
    total_amount: { type: Number, required: true },
    total_profit: Number,
    payment_method: String,
    cashier_id: String
}, { timestamps: true });

const SalesLog = mongoose.model('sales_logs', SalesLogSchema);

// Inventory Log Schema
const InventoryLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true }, // 'restock', 'sale', 'return', 'adjustment'
    item_id: { type: String, required: true },
    item_name: String,
    quantity_change: Number,
    previous_stock: Number,
    new_stock: Number,
    user_id: String,
    notes: String
}, { timestamps: true });

const InventoryLog = mongoose.model('inventory_logs', InventoryLogSchema);

// Return Log Schema
const ReturnLogSchema = new mongoose.Schema({
    return_id: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
    original_sale_id: String,
    customer: {
        name: String,
        phone: String
    },
    items: [{
        item_id: String,
        item_name: String,
        quantity: Number,
        refund_amount: Number
    }],
    total_refund: Number,
    reason: String,
    refund_status: { type: String, default: 'pending' },
    processed_by: String
}, { timestamps: true });

const ReturnLog = mongoose.model('return_logs', ReturnLogSchema);

// Activity Log Schema
const ActivityLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    user_id: String,
    username: String,
    action: { type: String, required: true },
    module: String, // 'POS', 'Inventory', 'Returns', etc.
    reference_id: String,
    details: mongoose.Schema.Types.Mixed,
    status: String,
    ip_address: String
}, { timestamps: true });

const ActivityLog = mongoose.model('system_activity_logs', ActivityLogSchema);

// Customer Analytics Schema
const CustomerAnalyticsSchema = new mongoose.Schema({
    customer_name: String,
    phone_number: { type: String, required: true, unique: true },
    city: String,
    total_spent: { type: Number, default: 0 },
    total_orders: { type: Number, default: 0 },
    customer_segment: String, // 'VIP', 'Regular', 'At Risk'
    loyalty_score: Number,
    last_purchase_date: Date,
    avg_order_value: Number
}, { timestamps: true });

const CustomerAnalytics = mongoose.model('customer_analytics', CustomerAnalyticsSchema);

// Item Performance Analytics Schema
const ItemPerformanceSchema = new mongoose.Schema({
    item_id: { type: String, required: true, unique: true },
    item_name: String,
    category: String,
    total_quantity_sold: { type: Number, default: 0 },
    total_revenue: { type: Number, default: 0 },
    total_profit: { type: Number, default: 0 },
    profit_margin: Number,
    inventory_turnover: Number,
    performance_rating: String, // 'Hot', 'Steady', 'Slow', 'Dead'
    last_sale_date: Date
}, { timestamps: true });

const ItemPerformance = mongoose.model('item_performance_analytics', ItemPerformanceSchema);

// Daily Sales Summary Schema
const DailySalesSummarySchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    total_sales: { type: Number, default: 0 },
    total_profit: { type: Number, default: 0 },
    transactions_count: { type: Number, default: 0 },
    items_sold: { type: Number, default: 0 },
    avg_transaction_value: Number,
    top_selling_items: [{ item_id: String, item_name: String, quantity: Number }],
    top_cities: [{ city: String, sales: Number }]
}, { timestamps: true });

const DailySalesSummary = mongoose.model('daily_sales_summary', DailySalesSummarySchema);

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    res.json({
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        databases: {
            mongodb: mongoStatus
        },
        version: '1.0.0'
    });
});

// === SALES ENDPOINTS ===

// Create new sale
app.post('/api/sales', async (req, res) => {
    try {
        const sale = await SalesLog.create(req.body);
        
        // Log activity
        await ActivityLog.create({
            user_id: req.body.cashier_id || 'system',
            action: 'sale_created',
            module: 'POS',
            reference_id: sale.sale_id,
            details: { total: sale.total_amount }
        });
        
        res.status(201).json({ success: true, data: sale });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all sales (with pagination)
app.get('/api/sales', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        
        const sales = await SalesLog.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await SalesLog.countDocuments();
        
        res.json({
            success: true,
            data: sales,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get sales by date range
app.get('/api/sales/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const sales = await SalesLog.find({
            timestamp: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ timestamp: -1 });
        
        res.json({ success: true, data: sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// === INVENTORY ENDPOINTS ===

// Log inventory action
app.post('/api/inventory-logs', async (req, res) => {
    try {
        const log = await InventoryLog.create(req.body);
        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get inventory logs by item
app.get('/api/inventory-logs/:itemId', async (req, res) => {
    try {
        const logs = await InventoryLog.find({ item_id: req.params.itemId })
            .sort({ timestamp: -1 })
            .limit(100);
        
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// === RETURN ENDPOINTS ===

// Create return
app.post('/api/returns', async (req, res) => {
    try {
        const returnRecord = await ReturnLog.create(req.body);
        
        await ActivityLog.create({
            user_id: req.body.processed_by || 'system',
            action: 'return_processed',
            module: 'Returns',
            reference_id: returnRecord.return_id,
            details: { total_refund: returnRecord.total_refund }
        });
        
        res.status(201).json({ success: true, data: returnRecord });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all returns
app.get('/api/returns', async (req, res) => {
    try {
        const returns = await ReturnLog.find()
            .sort({ timestamp: -1 })
            .limit(100);
        
        res.json({ success: true, data: returns });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// === ANALYTICS ENDPOINTS ===

// Get dashboard KPIs
app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todaySales = await SalesLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    total_sales: { $sum: '$total_amount' },
                    total_profit: { $sum: '$total_profit' },
                    transactions: { $sum: 1 }
                }
            }
        ]);
        
        const topItems = await ItemPerformance.find()
            .sort({ total_quantity_sold: -1 })
            .limit(5);
        
        const topCustomers = await CustomerAnalytics.find()
            .sort({ total_spent: -1 })
            .limit(5);
        
        res.json({
            success: true,
            data: {
                today: todaySales[0] || { total_sales: 0, total_profit: 0, transactions: 0 },
                top_items: topItems,
                top_customers: topCustomers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get customer analytics
app.get('/api/analytics/customers', async (req, res) => {
    try {
        const customers = await CustomerAnalytics.find()
            .sort({ total_spent: -1 })
            .limit(100);
        
        res.json({ success: true, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update customer analytics
app.put('/api/analytics/customers/:phone', async (req, res) => {
    try {
        const customer = await CustomerAnalytics.findOneAndUpdate(
            { phone_number: req.params.phone },
            req.body,
            { new: true, upsert: true }
        );
        
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// === ACTIVITY LOG ENDPOINTS ===

// Get activity feed
app.get('/api/activity', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        
        const activities = await ActivityLog.find()
            .sort({ timestamp: -1 })
            .limit(limit);
        
        res.json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create activity log
app.post('/api/activity', async (req, res) => {
    try {
        const activity = await ActivityLog.create(req.body);
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// SERVE FRONTEND
// ============================================

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('================================================');
    console.log('🚀 TechZone Inventory System Server');
    console.log('================================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('================================================');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

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
