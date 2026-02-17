// ============================================
// DATA LOADER - FETCH REAL DATA FROM MONGODB
// ============================================
// Add this code at the TOP of your script.js file
// AFTER the mock data arrays are declared

// This will load real data from MongoDB when page loads

async function loadDataFromMongoDB() {
    console.log('🔄 Loading data from MongoDB...');
    
    try {
        // Load sales from MongoDB
        const salesResponse = await API.getAllSales(1, 1000); // Get first 1000 sales
        if (salesResponse.success && salesResponse.data) {
            SALES_LOGS = salesResponse.data;
            console.log(`✅ Loaded ${SALES_LOGS.length} sales from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load sales from MongoDB:', error);
    }
    
    try {
        // Load inventory logs from MongoDB
        const inventoryResponse = await fetch('http://localhost:5000/api/inventory-logs', {
            headers: { 'Content-Type': 'application/json' }
        });
        const inventoryData = await inventoryResponse.json();
        if (inventoryData.success && inventoryData.data) {
            INVENTORY_LOGS = inventoryData.data;
            console.log(`✅ Loaded ${INVENTORY_LOGS.length} inventory logs from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load inventory logs from MongoDB:', error);
    }
    
    try {
        // Load returns from MongoDB
        const returnsResponse = await API.getAllReturns();
        if (returnsResponse.success && returnsResponse.data) {
            RETURN_LOGS = returnsResponse.data;
            console.log(`✅ Loaded ${RETURN_LOGS.length} returns from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load returns from MongoDB:', error);
    }
    
    try {
        // Load activity logs from MongoDB
        const activityResponse = await API.getActivityFeed(500); // Get last 500 activities
        if (activityResponse.success && activityResponse.data) {
            SYSTEM_ACTIVITY_FEED = activityResponse.data;
            console.log(`✅ Loaded ${SYSTEM_ACTIVITY_FEED.length} activities from MongoDB`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load activity logs from MongoDB:', error);
    }
    
    console.log('✅ MongoDB data loading complete!');
    
    // Refresh all displays with real data
    if (typeof Dashboard !== 'undefined' && Dashboard.init) {
        Dashboard.init();
    }
    if (typeof Ledger !== 'undefined' && Ledger.init) {
        Ledger.init();
    }
    if (typeof ActivityLog !== 'undefined' && ActivityLog.init) {
        ActivityLog.init();
    }
}

// Load data when page loads
window.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for API to be ready
    setTimeout(async () => {
        await loadDataFromMongoDB();
    }, 500);
});

console.log('📂 Data loader initialized - will load from MongoDB on page load');

// Force dashboard refresh with real data
async function refreshDashboardWithRealData() {
    await loadDataFromMongoDB();
    
    // Extra: manually trigger Dashboard refresh
    setTimeout(() => {
        if (typeof Dashboard !== 'undefined' && Dashboard.init) {
            console.log('🔄 Forcing dashboard refresh...');
            Dashboard.init();
        }
    }, 500);
}

// Also refresh when clicking Dashboard tab
document.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (navItem && navItem.dataset.view === 'dashboard') {
        setTimeout(() => {
            if (typeof Dashboard !== 'undefined' && Dashboard.init) {
                console.log('🔄 Dashboard tab clicked - refreshing...');
                Dashboard.init();
            }
        }, 100);
    }
});