// ============================================
// MONGODB INITIALIZATION SCRIPT
// ============================================
// This script creates all collections and indexes
// Run this ONCE to set up the database structure

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TechZoneMongo';

// Collection Schemas
const schemas = {
    // Sales Logs Collection
    sales_logs: new mongoose.Schema({
        timestamp: { type: Date, default: Date.now, index: true },
        sale_id: { type: Number, required: true, index: true },
        transaction_type: { type: String, default: 'SALE' },
        customer: {
            customer_id: Number,
            name: String,
            phone: { type: String, index: true },
            email: String,
            city: String
        },
        items: [{
            item_id: Number,
            item_name: String,
            quantity: Number,
            unit_price: Number,
            line_total: Number,
            cost: Number,
            profit: Number
        }],
        total_amount: { type: Number, required: true },
        total_profit: { type: Number, required: true },
        payment_method: { type: String, default: 'Cash' },
        processed_by: String
    }, { timestamps: true }),

    // Inventory Logs Collection
    inventory_logs: new mongoose.Schema({
        timestamp: { type: Date, default: Date.now, index: true },
        action: { type: String, required: true, index: true },
        item_id: { type: Number, required: true, index: true },
        item_name: String,
        quantity_change: Number,
        previous_stock: Number,
        new_stock: Number,
        performed_by: String,
        reference: String,
        notes: String
    }, { timestamps: true }),

    // Return Logs Collection
    return_logs: new mongoose.Schema({
        timestamp: { type: Date, default: Date.now, index: true },
        return_id: { type: Number, required: true, index: true },
        original_sale_id: { type: Number, required: true, index: true },
        item_id: Number,
        item_name: String,
        quantity_returned: Number,
        reason: String,
        disposition: String,
        refund_amount: Number,
        restocked: Boolean,
        approved_by: String,
        customer_name: String,
        notes: String
    }, { timestamps: true }),

    // System Activity Logs Collection
    system_activity_logs: new mongoose.Schema({
        user_id: Number,
        username: String,
        role: String,
        action: { type: String, index: true },
        reference_id: Number,
        created_at: { type: Date, default: Date.now, index: true },
        details: String
    }, { timestamps: true }),

    // Customer Analytics Collection
    customer_analytics: new mongoose.Schema({
        customer_id: Number,
        name: String,
        phone: { type: String, unique: true, index: true },
        email: String,
        city: String,
        total_spent: { type: Number, default: 0 },
        total_orders: { type: Number, default: 0 },
        average_order_value: { type: Number, default: 0 },
        last_purchase_date: Date,
        customer_segment: String,
        loyalty_score: Number,
        lifetime_value: Number
    }, { timestamps: true }),

    // Item Performance Analytics Collection
    item_performance_analytics: new mongoose.Schema({
        item_id: { type: Number, unique: true, index: true },
        item_name: String,
        total_quantity_sold: { type: Number, default: 0 },
        total_revenue: { type: Number, default: 0 },
        total_profit: { type: Number, default: 0 },
        profit_margin: Number,
        inventory_turnover: Number,
        last_sold_date: Date,
        performance_rating: String
    }, { timestamps: true }),

    // Daily Sales Summary Collection
    daily_sales_summary: new mongoose.Schema({
        date: { type: Date, unique: true, index: true },
        total_sales: { type: Number, default: 0 },
        total_profit: { type: Number, default: 0 },
        transactions_count: { type: Number, default: 0 },
        average_transaction_value: { type: Number, default: 0 },
        top_selling_items: [String],
        total_items_sold: { type: Number, default: 0 }
    }, { timestamps: true }),

    // City Sales Analytics Collection
    city_sales_analytics: new mongoose.Schema({
        city: { type: String, unique: true, index: true },
        total_sales_amount: { type: Number, default: 0 },
        total_customers: { type: Number, default: 0 },
        total_transactions: { type: Number, default: 0 },
        average_transaction_value: { type: Number, default: 0 },
        most_purchased_item: String,
        last_transaction_date: Date
    }, { timestamps: true })
};

async function initializeDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        // Get existing collections
        const existingCollections = await db.listCollections().toArray();
        const existingNames = existingCollections.map(c => c.name);

        console.log('\n📋 Existing collections:', existingNames.join(', ') || 'None');

        // Create collections with schemas
        console.log('\n🔧 Creating/Updating collections...\n');

        for (const [collectionName, schema] of Object.entries(schemas)) {
            try {
                if (existingNames.includes(collectionName)) {
                    console.log(`✓ ${collectionName} - Already exists`);
                    
                    // Update indexes for existing collection
                    const Model = mongoose.model(collectionName, schema, collectionName);
                    await Model.syncIndexes();
                    console.log(`  └─ Indexes updated`);
                } else {
                    // Create new collection
                    const Model = mongoose.model(collectionName, schema, collectionName);
                    await Model.createCollection();
                    await Model.syncIndexes();
                    console.log(`✓ ${collectionName} - Created with indexes`);
                }
            } catch (error) {
                console.error(`✗ ${collectionName} - Error:`, error.message);
            }
        }

        // Show final collection list
        console.log('\n📊 Final Database Structure:\n');
        const finalCollections = await db.listCollections().toArray();
        
        for (const collection of finalCollections) {
            const stats = await db.collection(collection.name).stats();
            console.log(`   ${collection.name}`);
            console.log(`   └─ Documents: ${stats.count}`);
            console.log(`   └─ Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
        }

        console.log('✅ Database initialization complete!\n');
        console.log('================================================');
        console.log('Database: TechZoneMongo');
        console.log('Collections: ' + finalCollections.length);
        console.log('Status: Ready for use');
        console.log('================================================\n');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
        process.exit(0);
    }
}

// Run initialization
initializeDatabase();
