// ============================================
// DATA LOADER — MySQL + MongoDB
// ============================================
// Loads core business data (products, categories, suppliers, staff, customers) from MySQL
// Loads analytics/logs from MongoDB
// ============================================

// ============================================
// LOAD CORE DATA FROM MySQL
// ============================================
async function loadDataFromMySQL() {
    console.log('🔄 Loading core data from MySQL...');

    try {
        const [catRes, supRes, staffRes, custRes, prodRes] = await Promise.all([
            API.getCategories(),
            API.getSuppliers(),
            API.getStaff(),
            API.getCustomers(),
            API.getProducts()
        ]);

        if (catRes.success) {
            ITEM_TYPES = catRes.data.map(c => ({ id: c.id, name: c.name, warranty: c.warranty }));
            console.log(`✅ Loaded ${ITEM_TYPES.length} categories from MySQL`);
        }
        if (supRes.success) {
            SUPPLIERS = supRes.data.map(s => ({ id: s.id, name: s.name, contact: s.contact }));
            console.log(`✅ Loaded ${SUPPLIERS.length} suppliers from MySQL`);
        }
        if (staffRes.success) {
            STAFF_USERS = staffRes.data.map(s => ({ user_id: s.user_id, username: s.username, role: s.role }));
            console.log(`✅ Loaded ${STAFF_USERS.length} staff from MySQL`);
        }
        if (custRes.success) {
            CUSTOMERS.length = 0;
            custRes.data.forEach(c => CUSTOMERS.push({ id: c.id, name: c.name, phone: c.phone, email: c.email, city: c.city }));
            console.log(`✅ Loaded ${CUSTOMERS.length} customers from MySQL`);
        }
        if (prodRes.success) {
            ITEMS = prodRes.data.map(p => ({
                id: p.id, name: p.name, price: parseFloat(p.price), cost: parseFloat(p.cost),
                qty: p.qty, supplierId: p.supplier_id, typeId: p.type_id
            }));
            console.log(`✅ Loaded ${ITEMS.length} products from MySQL`);
        }

        // Re-populate staff dropdowns with loaded data
        if (typeof populateStaffDropdowns === 'function') {
            populateStaffDropdowns();
        }

        console.log('✅ MySQL core data loading complete!');
    } catch (error) {
        console.warn('⚠️ Could not load data from MySQL — make sure MySQL is running:', error.message);
    }
}

// ============================================
// SAVE STOCK CHANGE TO MySQL (backward compat endpoint)
// ============================================
async function saveStockToMongoDB(itemId, newQty) {
    try {
        await fetch(`http://localhost:5000/api/items/${itemId}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qty: newQty })
        });
        console.log(`✅ Stock saved: item ${itemId} → qty ${newQty}`);
    } catch (error) {
        console.warn(`⚠️ Could not save stock for item ${itemId}:`, error.message);
    }
}

// ============================================
// LOAD ANALYTICS/LOGS FROM MongoDB
// ============================================
async function loadLogsFromMongoDB() {
    console.log('🔄 Loading analytics/logs from MongoDB...');

    try {
        const salesResponse = await API.getAllSales(1, 1000);
        if (salesResponse.success && salesResponse.data) {
            SALES_LOGS = salesResponse.data;
            console.log(`✅ Loaded ${SALES_LOGS.length} sales from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load sales:', error.message);
    }

    try {
        const inventoryResponse = await fetch('http://localhost:5000/api/inventory-logs');
        const inventoryData = await inventoryResponse.json();
        if (inventoryData.success && inventoryData.data) {
            INVENTORY_LOGS = inventoryData.data;
            console.log(`✅ Loaded ${INVENTORY_LOGS.length} inventory logs from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load inventory logs:', error.message);
    }

    try {
        const returnsResponse = await API.getAllReturns();
        if (returnsResponse.success && returnsResponse.data) {
            RETURN_LOGS = returnsResponse.data;
            console.log(`✅ Loaded ${RETURN_LOGS.length} returns from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load returns:', error.message);
    }

    try {
        const activityResponse = await API.getActivityFeed(500);
        if (activityResponse.success && activityResponse.data) {
            SYSTEM_ACTIVITY_FEED = activityResponse.data;
            console.log(`✅ Loaded ${SYSTEM_ACTIVITY_FEED.length} activities from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load activity logs:', error.message);
    }

    console.log('✅ MongoDB analytics loading complete!');
}

// ============================================
// MASTER LOAD — MySQL first, then MongoDB, then refresh UI
// ============================================
async function loadAllData() {
    // 1. Load core business data from MySQL
    await loadDataFromMySQL();

    // 2. Load analytics/logs from MongoDB
    await loadLogsFromMongoDB();

    // 3. Refresh all displays with loaded data
    if (typeof Inventory !== 'undefined' && Inventory.init) Inventory.init();
    if (typeof POS !== 'undefined' && POS.init) POS.init();
    if (typeof Dashboard !== 'undefined' && Dashboard.init) Dashboard.init();
    if (typeof Ledger !== 'undefined' && Ledger.init) Ledger.init();
    if (typeof ActivityLog !== 'undefined' && ActivityLog.init) ActivityLog.init();
    if (typeof DataMgmt !== 'undefined' && DataMgmt.render) DataMgmt.render();
}

// ============================================
// INIT ON PAGE LOAD
// ============================================
window.addEventListener('DOMContentLoaded', async () => {
    setTimeout(async () => {
        await loadAllData();
    }, 500);
});

// Refresh dashboard data on tab click
document.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (navItem && navItem.dataset.view === 'dashboard') {
        setTimeout(() => {
            if (typeof Dashboard !== 'undefined' && Dashboard.init) {
                Dashboard.init();
            }
        }, 100);
    }
});

console.log('📂 Data loader initialized — MySQL for core data, MongoDB for analytics');
