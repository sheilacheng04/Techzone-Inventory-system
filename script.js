/* ================================================
   TechZone Staff Portal — Core Application Logic
   ================================================
   Mock data sourced from TechZone MySQL DDL / DML.
   No database connection required — all data is
   simulated client-side for the frontend prototype.
   ================================================ */




   
// ========== MOCK DATA (from DDL / DML) ==========

// Staff/User mappings for activity logging
const STAFF_USERS = [
    { user_id: 1, username: 'admin', role: 'Administrator' },
    { user_id: 2, username: 'cashier_01', role: 'Cashier' },
    { user_id: 3, username: 'cashier_02', role: 'Cashier' },
    { user_id: 4, username: 'manager_01', role: 'Manager' },
    { user_id: 5, username: 'staff', role: 'Staff' }
];

function getStaffInfo(username) {
    return STAFF_USERS.find(s => s.username === username) || { user_id: 0, username: username, role: 'Staff' };
}

const ITEM_TYPES = [
    { id: 1, name: 'Processor', warranty: 365 },
    { id: 2, name: 'Graphics Card', warranty: 365 },
    { id: 3, name: 'Memory', warranty: 365 },
    { id: 4, name: 'Peripherals', warranty: 365 },
    { id: 5, name: 'Monitor', warranty: 365 },
    { id: 6, name: 'Storage', warranty: 365 },
    { id: 7, name: 'Motherboard', warranty: 365 },
    { id: 8, name: 'Power Supply', warranty: 365 },
    { id: 9, name: 'Furniture', warranty: 30 },
    { id: 10, name: 'Accessories', warranty: 30 },
    { id: 11, name: 'Audio', warranty: 365 },
];

const SUPPLIERS = [
    { id: 1, name: 'AMD Phil', contact: '02-8888-1111' },
    { id: 2, name: 'Asus Ph', contact: '02-8888-2222' },
    { id: 3, name: 'Kingston D.', contact: '02-8888-3333' },
    { id: 4, name: 'Logi Dist', contact: '02-8888-4444' },
    { id: 5, name: 'Nvision', contact: '0917-000-1111' },
    { id: 6, name: 'Rakk Gears', contact: '0918-000-2222' },
    { id: 7, name: 'Gigabyte Ph', contact: '02-8888-5555' },
    { id: 8, name: 'Corsair D.', contact: '02-8888-6666' },
    { id: 9, name: 'SecretLab', contact: '02-8888-7777' },
    { id: 10, name: 'Generic', contact: 'N/A' },
    { id: 11, name: 'Maono', contact: '0919-000-3333' },
    { id: 12, name: 'Creative', contact: '02-8888-8888' },
];

const CUSTOMERS = [];

// Walk-in customers (customers stored from previous sales)
const WALK_IN_CUSTOMERS = [];

// Items — quantities will be mutated as sales/returns happen
const ITEMS = [
    { id: 1,  name: 'Ryzen 5 5600',       price: 8500,  cost: 6500,  qty: 50,  supplierId: 1,  typeId: 1 },
    { id: 2,  name: 'RTX 4060',            price: 18500, cost: 16000, qty: 20,  supplierId: 2,  typeId: 2 },
    { id: 3,  name: '8GB DDR4 RAM',        price: 1500,  cost: 900,   qty: 100, supplierId: 3,  typeId: 3 },
    { id: 4,  name: 'Logitech G102',       price: 995,   cost: 700,   qty: 45,  supplierId: 4,  typeId: 4 },
    { id: 5,  name: '24" IPS Monitor',     price: 7500,  cost: 5500,  qty: 30,  supplierId: 5,  typeId: 5 },
    { id: 6,  name: 'Mech Keyboard',       price: 2500,  cost: 1800,  qty: 60,  supplierId: 6,  typeId: 4 },
    { id: 7,  name: '1TB NVMe SSD',        price: 3500,  cost: 2500,  qty: 40,  supplierId: 3,  typeId: 6 },
    { id: 8,  name: 'Ryzen 7 5700X',       price: 12000, cost: 9500,  qty: 15,  supplierId: 1,  typeId: 1 },
    { id: 9,  name: 'B550m Motherboard',   price: 6500,  cost: 5000,  qty: 25,  supplierId: 2,  typeId: 7 },
    { id: 10, name: 'RTX 4070',            price: 38000, cost: 34000, qty: 10,  supplierId: 7,  typeId: 2 },
    { id: 11, name: '650W PSU',            price: 3000,  cost: 2200,  qty: 35,  supplierId: 8,  typeId: 8 },
    { id: 12, name: 'Webcam 1080p',        price: 1200,  cost: 800,   qty: 50,  supplierId: 4,  typeId: 4 },
    { id: 13, name: 'Gaming Chair',        price: 8000,  cost: 5000,  qty: 12,  supplierId: 9,  typeId: 9 },
    { id: 14, name: 'Ring Light',          price: 500,   cost: 200,   qty: 80,  supplierId: 10, typeId: 10 },
    { id: 15, name: 'Microphone USB',      price: 2500,  cost: 1500,  qty: 40,  supplierId: 11, typeId: 11 },
    { id: 16, name: 'Sound Card',          price: 1500,  cost: 900,   qty: 20,  supplierId: 12, typeId: 11 },
    { id: 17, name: 'RTX 3060',            price: 18000, cost: 14000, qty: 0,   supplierId: 2,  typeId: 2 },
];

// Sales built from the DML (using first 100 sale items)
const SALES = [];
const SALE_ITEMS = [];

// ========== UTILITY HELPERS - DEFINED EARLY FOR INITIALIZATION ==========
function calculateWarrantyExpiration(saleDate, warrantyDays) {
    const date = new Date(saleDate);
    date.setDate(date.getDate() + warrantyDays);
    return date.toISOString().slice(0, 10);
}

// Build sales from DML
(function buildSalesFromDML() {
    const saleDates = [
        '2025-01-01','2025-01-01','2025-01-01','2025-01-02','2025-01-02','2025-01-03','2025-01-03',
        '2025-01-04','2025-01-04','2025-01-05','2025-01-05','2025-01-06','2025-01-06','2025-01-07',
        '2025-01-07','2025-01-08','2025-01-08','2025-01-09','2025-01-09','2025-01-10','2025-01-10',
        '2025-01-10','2025-01-11','2025-01-11','2025-01-12','2025-01-12','2025-01-13','2025-01-13',
        '2025-01-14','2025-01-14','2025-01-15','2025-01-15','2025-01-15','2025-01-16','2025-01-16',
        '2025-01-17','2025-01-17','2025-01-18','2025-01-18','2025-01-19','2025-01-19','2025-01-20',
        '2025-01-20','2025-01-21','2025-01-21','2025-01-21','2025-01-22','2025-01-22','2025-01-23',
        '2025-01-23','2025-01-24','2025-01-24','2025-01-25','2025-01-25','2025-01-26','2025-01-26',
        '2025-01-26','2025-01-27','2025-01-27','2025-01-28','2025-01-28','2025-01-28','2025-01-29',
        '2025-01-29','2025-01-30','2025-01-30','2025-01-31','2025-01-31','2025-02-01','2025-02-01',
        '2025-02-01','2025-02-02','2025-02-02','2025-02-03','2025-02-03','2025-02-04','2025-02-04',
        '2025-02-05','2025-02-05','2025-02-06','2025-02-06','2025-02-07','2025-02-07','2025-02-08',
        '2025-02-08','2025-02-09','2025-02-09','2025-02-10','2025-02-10','2025-02-11','2025-02-11',
        '2025-02-12','2025-02-12','2025-02-13','2025-02-13','2025-02-14','2025-02-14','2025-02-14',
        '2025-02-15','2025-02-15'
    ];
    const saleCustomers = [1, 2, 3, 4, 5];

    // Don't add dummy sales — start with empty SALES array for fresh data
    // Users will create sales through POS transactions
    // for (let i = 0; i < 5; i++) {
    //     SALES.push({ id: i + 1, date: saleDates[i], customerId: saleCustomers[i] });
    // }

    const saleItemsRaw = [

    ];
    saleItemsRaw.forEach((r, i) => {
        const saleId = r[0];
        const itemId = r[1];
        const qty = r[2];
        const soldPrice = r[3];
        
        // Get sale date and calculate warranty expiration
        const sale = SALES.find(s => s.id === saleId);
        const item = ITEMS.find(it => it.id === itemId);
        const type = ITEM_TYPES.find(t => t.id === (item ? item.typeId : null));
        const warrantyDays = type ? type.warranty : 0;
        const saleDate = sale ? sale.date : new Date().toISOString().slice(0, 10);
        const warrantyExpiration = calculateWarrantyExpiration(saleDate, warrantyDays);
        
        SALE_ITEMS.push({ 
            id: i + 1, 
            saleId: saleId, 
            itemId: itemId, 
            qty: qty, 
            soldPrice: soldPrice,
            warrantyExpiration: warrantyExpiration
        });
    });
})();

// Returns (mock — empty to start, populated by user actions)
const RETURNS = [];
let nextReturnId = 1;

// ========== MONGODB LOG COLLECTIONS (Simulated) ==========

// --- inventory_logs: tracks every stock movement ---
let INVENTORY_LOGS = [];

// --- sales_logs: full sale records with nested customer & items ---
let SALES_LOGS = [];

// --- return_logs: return operations ---
let RETURN_LOGS = [];

// ========== UNIFIED SYSTEM ACTIVITY FEED ==========
// Consolidated log from ALL modules: POS, Inventory, Ledger, Returns
// Schema: _id, user_id, username, role, action, reference_id, created_at

let SYSTEM_ACTIVITY_FEED = [];

// Deprecated: SYSTEM_ACTIVITY_LOGS (kept for backward compatibility during migration)
const SYSTEM_ACTIVITY_LOGS = SYSTEM_ACTIVITY_FEED;

// ========== ANALYTICS COLLECTIONS (MongoDB Aggregated Data) ==========

// --- daily_sales_summary: daily aggregated metrics ---
const DAILY_SALES_SUMMARY = [];

// --- city_sales_analytics: geographic performance ---
const CITY_SALES_ANALYTICS = [];

// --- city_customer_distribution: customer demographics by city ---
const CITY_CUSTOMER_DISTRIBUTION = [];

// --- customer_analytics: individual customer insights ---
const CUSTOMER_ANALYTICS = [];

// --- item_performance_analytics: product performance metrics ---
const ITEM_PERFORMANCE_ANALYTICS = [];

// --- financial_snapshots: overall business health snapshots ---
const FINANCIAL_SNAPSHOTS = [];

// Log ID counters
let nextInventoryLogId = INVENTORY_LOGS.length + 1;
let nextSalesLogId = SALES_LOGS.length + 1;
let nextReturnLogId = RETURN_LOGS.length + 1;
let nextSystemLogId = SYSTEM_ACTIVITY_LOGS.length + 1;

// ========== UTILITY HELPERS ==========

const LOW_STOCK_THRESHOLD = 10;

const peso = (n) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function getItem(id)      { return ITEMS.find(i => i.id === id); }
function getType(id)      { return ITEM_TYPES.find(t => t.id === id); }
function getSupplier(id)  { return SUPPLIERS.find(s => s.id === id); }
function getCustomer(id)  { return CUSTOMERS.find(c => c.id === id); }

function isWarrantyExpired(warrantyExpirationDate) {
    return new Date(warrantyExpirationDate) < new Date();
}

function getWarrantyStatus(warrantyExpirationDate) {
    if (isWarrantyExpired(warrantyExpirationDate)) {
        return { status: 'Expired', class: 'warranty-expired', icon: '✗' };
    }
    return { status: 'Active', class: 'warranty-active', icon: '✓' };
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function closeModal() {
    document.getElementById('saleModal').classList.remove('show');
}

// ========== NAVIGATION ==========

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('view-' + item.dataset.view).classList.add('active');
    });
});

// ========== LIVE CLOCK ==========

function updateClock() {
    const now = new Date();
    document.getElementById('liveClock').textContent = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// ========== DASHBOARD MODULE ==========

const Dashboard = {
    init() {
        // Build live analytics from actual sales data
        this.buildLiveAnalytics();
        
        this.renderKPIs();
        this.renderAlerts();
        this.renderFinancialSnapshot();
        this.renderProfit();
        this.renderDailySalesCards();
        this.renderDailySales();
        this.renderTopProductsChart();
        this.renderItemPerformance();
        this.renderCityPerformanceCards();
        this.renderCityAnalytics();
        this.renderTopCustomersChart();
    },

    buildLiveAnalytics() {
    // Build DAILY_SALES_SUMMARY from MongoDB SALES_LOGS
    DAILY_SALES_SUMMARY.length = 0;
    const dailyMap = {};
    
    SALES_LOGS.forEach(sale => {
        // MongoDB timestamp to date
        const saleDate = sale.timestamp ? new Date(sale.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        
        if (!dailyMap[saleDate]) {
            dailyMap[saleDate] = {
                date: saleDate,
                total_sales: 0,
                total_profit: 0,
                transactions_count: 0,
                total_items_sold: 0,
                average_transaction_value: 0
            };
        }
        
        dailyMap[saleDate].transactions_count++;
        dailyMap[saleDate].total_sales += sale.total_amount || 0;
        dailyMap[saleDate].total_profit += sale.total_profit || 0;
        
        // MongoDB items are in sale.items array
        if (sale.items && Array.isArray(sale.items)) {
            dailyMap[saleDate].total_items_sold += sale.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
    });
    
    Object.values(dailyMap).forEach(day => {
        day.average_transaction_value = day.transactions_count > 0 ? day.total_sales / day.transactions_count : 0;
        DAILY_SALES_SUMMARY.push(day);
    });

    // Build ITEM_PERFORMANCE_ANALYTICS from MongoDB SALES_LOGS
    ITEM_PERFORMANCE_ANALYTICS.length = 0;
    const itemMap = {};
    
    SALES_LOGS.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
                const itemId = item.item_id;
                const itemName = item.item_name || 'Unknown';
                
                // Try to get type from ITEMS array if available
                const itemObj = getItem(itemId);
                const typeObj = itemObj ? getType(itemObj.typeId) : null;
                
                if (!itemMap[itemId]) {
                    itemMap[itemId] = {
                        name: itemName,
                        type: typeObj ? typeObj.name : 'Product',
                        total_quantity_sold: 0,
                        total_revenue: 0,
                        total_profit: 0,
                        return_rate: 0,
                        damage_rate: 0
                    };
                }
                
                itemMap[itemId].total_quantity_sold += item.quantity || 0;
                itemMap[itemId].total_revenue += item.line_total || 0;
                itemMap[itemId].total_profit += item.profit || 0;
            });
        }
    });
    
    Object.values(itemMap).forEach(item => {
        ITEM_PERFORMANCE_ANALYTICS.push(item);
    });

    // Build CUSTOMER_ANALYTICS from MongoDB SALES_LOGS
    CUSTOMER_ANALYTICS.length = 0;
    const customerMap = {};
    
    SALES_LOGS.forEach(sale => {
        if (sale.customer) {
            const customerKey = sale.customer.phone || sale.customer.name || 'unknown';
            const customerName = sale.customer.name || 'Unknown';
            const customerCity = sale.customer.city || '';
            
            if (!customerMap[customerKey]) {
                customerMap[customerKey] = {
                    name: customerName,
                    city: customerCity,
                    total_orders: 0,
                    total_spent: 0,
                    total_profit_generated: 0,
                    last_purchase_date: sale.timestamp || new Date().toISOString(),
                    favorite_item_type: 'Unknown'
                };
            }
            
            customerMap[customerKey].total_orders++;
            customerMap[customerKey].total_spent += sale.total_amount || 0;
            customerMap[customerKey].total_profit_generated += sale.total_profit || 0;
            
            // Update last purchase if newer
            const saleDate = new Date(sale.timestamp);
            const lastDate = new Date(customerMap[customerKey].last_purchase_date);
            if (saleDate > lastDate) {
                customerMap[customerKey].last_purchase_date = sale.timestamp;
            }
            
            // Get favorite item type from items
            if (sale.items && sale.items.length > 0) {
                const firstItem = getItem(sale.items[0].item_id);
                if (firstItem) {
                    const type = getType(firstItem.typeId);
                    if (type) customerMap[customerKey].favorite_item_type = type.name;
                }
            }
        }
    });
    
    Object.values(customerMap).forEach(customer => {
        CUSTOMER_ANALYTICS.push(customer);
    });

    // Build FINANCIAL_SNAPSHOTS from MongoDB SALES_LOGS
    FINANCIAL_SNAPSHOTS.length = 0;
    if (SALES_LOGS.length > 0) {
        let totalRevenue = 0, totalCost = 0, totalReturns = 0, totalDamage = 0;
        
        SALES_LOGS.forEach(sale => {
            totalRevenue += sale.total_amount || 0;
            // Calculate cost from items
            if (sale.items && Array.isArray(sale.items)) {
                sale.items.forEach(item => {
                    totalCost += (item.cost || 0) * (item.quantity || 0);
                });
            }
        });

        // Add returns calculation
        RETURN_LOGS.forEach(ret => {
            totalReturns += ret.refund_amount || 0;
        });
        
        const netSales = totalRevenue - totalReturns;
        const netProfit = netSales - totalCost - totalDamage;
        
        // Get top city (build it if not already done)
        if (CITY_SALES_ANALYTICS.length === 0) {
            // Quick build for snapshot
            const cityQuickMap = {};
            SALES_LOGS.forEach(sale => {
                if (sale.customer && sale.customer.city) {
                    const city = sale.customer.city;
                    if (!cityQuickMap[city]) cityQuickMap[city] = 0;
                    cityQuickMap[city] += sale.total_amount || 0;
                }
            });
            const sortedCities = Object.entries(cityQuickMap).sort((a, b) => b[1] - a[1]);
            var topCity = sortedCities.length > 0 ? sortedCities[0][0] : 'N/A';
        } else {
            var topCity = CITY_SALES_ANALYTICS[0] ? CITY_SALES_ANALYTICS[0].city : 'N/A';
        }
        
        // Get top item
        const topItem = ITEM_PERFORMANCE_ANALYTICS.length > 0 && ITEM_PERFORMANCE_ANALYTICS[0] ? ITEM_PERFORMANCE_ANALYTICS[0].name : 'N/A';
        const lowStockCount = ITEMS.filter(i => i.qty <= LOW_STOCK_THRESHOLD).length;
        
        FINANCIAL_SNAPSHOTS.push({
            snapshot_date: new Date().toISOString(),
            gross_sales: totalRevenue,
            total_returns: totalReturns,
            damaged_stock_loss: totalDamage,
            net_sales: netSales,
            net_profit: netProfit,
            top_city: topCity,
            top_item: topItem,
            low_stock_count: lowStockCount
        });
    }
},


    renderKPIs() {
    let totalRevenue = 0, totalProfit = 0;
    SALES_LOGS.forEach(sale => {
        totalRevenue += sale.total_amount || 0;
        totalProfit += sale.total_profit || 0;
    });
    const alerts = ITEMS.filter(i => i.qty <= LOW_STOCK_THRESHOLD).length;

    document.getElementById('kpiRevenue').textContent = peso(totalRevenue);
    document.getElementById('kpiProfit').textContent = peso(totalProfit);
    document.getElementById('kpiTransactions').textContent = SALES_LOGS.length;
    document.getElementById('kpiAlerts').textContent = alerts;
},

    renderAlerts() {
        const lowItems = ITEMS.filter(i => i.qty <= LOW_STOCK_THRESHOLD);
        const panel = document.getElementById('alertsPanel');
        const list = document.getElementById('alertsList');

        if (lowItems.length === 0) {
            panel.style.display = 'none';
            return;
        }

        panel.style.display = 'block';
        list.innerHTML = lowItems.map(item => {
            const isOut = item.qty === 0;
            const type = isOut ? 'danger' : 'warning';
            const icon = isOut ? 'fa-circle-xmark' : 'fa-triangle-exclamation';
            const label = isOut ? 'OUT OF STOCK' : `${item.qty} left`;
            const supplier = getSupplier(item.supplierId);
            return `
                <div class="alert-item ${type}">
                    <i class="fas ${icon}"></i>
                    <div class="alert-text">
                        <strong>${item.name}</strong> — Reorder from <em>${supplier ? supplier.name : 'N/A'}</em>
                    </div>
                    <span class="alert-qty">${label}</span>
                </div>`;
        }).join('');
    },

    renderProfit() {
    const filter = document.getElementById('profitFilter').value;
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

    let filteredSales = SALES_LOGS;
    if (filter === 'today') {
        filteredSales = SALES_LOGS.filter(s => s.timestamp.slice(0,10) === today);
    } else if (filter === 'week') {
        filteredSales = SALES_LOGS.filter(s => {
            const date = s.timestamp.slice(0,10);
            return date >= weekAgo && date <= today;
        });
    }

    let revenue = 0, profit = 0;
    filteredSales.forEach(sale => {
        revenue += sale.total_amount || 0;
        profit += sale.total_profit || 0;
    });
    const cost = revenue - profit;
    const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0';

    document.getElementById('profitSummary').innerHTML = `
        <div class="profit-stat revenue"><span class="stat-label">Revenue</span><span class="stat-value">${peso(revenue)}</span></div>
        <div class="profit-stat cost"><span class="stat-label">Total Cost</span><span class="stat-value">${peso(cost)}</span></div>
        <div class="profit-stat profit"><span class="stat-label">Net Profit</span><span class="stat-value">${peso(profit)}</span></div>
        <div class="profit-stat margin"><span class="stat-label">Margin</span><span class="stat-value">${margin}%</span></div>
    `;
},

    renderTopProducts() {
        const productMap = {};
        SALE_ITEMS.forEach(si => {
            if (!productMap[si.itemId]) productMap[si.itemId] = { units: 0, revenue: 0, profit: 0 };
            const item = getItem(si.itemId);
            productMap[si.itemId].units += si.qty;
            productMap[si.itemId].revenue += si.soldPrice * si.qty;
            productMap[si.itemId].profit += (si.soldPrice - (item ? item.cost : 0)) * si.qty;
        });

        const sorted = Object.entries(productMap)
            .map(([id, data]) => ({ item: getItem(Number(id)), ...data }))
            .filter(x => x.item)
            .sort((a, b) => b.units - a.units)
            .slice(0, 10);

        document.getElementById('topProductsBody').innerHTML = sorted.map(p => `
            <tr>
                <td>${p.item.name}</td>
                <td>${p.units}</td>
                <td>${peso(p.revenue)}</td>
                <td style="color: var(--green)">${peso(p.profit)}</td>
            </tr>`).join('');
    },

    renderDailySales() {
        const sorted = [...DAILY_SALES_SUMMARY].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        document.getElementById('dailySalesBody').innerHTML = sorted.map(day => `
            <tr>
                <td>${new Date(day.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td style="color: var(--green)">${peso(day.total_sales)}</td>
                <td style="color: var(--blue)">${peso(day.total_profit)}</td>
                <td>${day.transactions_count}</td>
                <td>${day.total_items_sold}</td>
                <td>${peso(day.average_transaction_value)}</td>
            </tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No data available</td></tr>';
    },

    renderCityAnalytics() {
        // Build live city analytics from actual sale data
        this.buildLiveCityAnalytics();
        const sorted = [...CITY_SALES_ANALYTICS].sort((a, b) => b.total_sales_amount - a.total_sales_amount);
        
        document.getElementById('cityAnalyticsBody').innerHTML = sorted.map(city => `
            <tr>
                <td><strong>${city.city}</strong></td>
                <td>${city.total_customers}</td>
                <td style="color: var(--green)">${peso(city.total_sales_amount)}</td>
                <td>${city.total_transactions}</td>
                <td>${city.total_items_sold}</td>
                <td style="color: var(--blue)">${peso(city.total_profit)}</td>
                <td>${city.most_purchased_item ? city.most_purchased_item.name : 'N/A'} (${city.most_purchased_item ? city.most_purchased_item.quantity : 0})</td>
            </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No data available</td></tr>';
    },

    renderCustomerAnalytics() {
        const sorted = [...CUSTOMER_ANALYTICS].sort((a, b) => b.total_spent - a.total_spent);
        
        document.getElementById('customerAnalyticsBody').innerHTML = sorted.map(customer => {
            const lastPurchase = new Date(customer.last_purchase_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
            return `
            <tr>
                <td><strong>${customer.name}</strong></td>
                <td>${customer.city}</td>
                <td>${customer.total_orders}</td>
                <td style="color: var(--green)">${peso(customer.total_spent)}</td>
                <td style="color: var(--blue)">${peso(customer.total_profit_generated)}</td>
                <td>${lastPurchase}</td>
                <td>${customer.favorite_item_type}</td>
            </tr>`;
        }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No data available</td></tr>';
    },

    renderItemPerformance() {
        const sorted = [...ITEM_PERFORMANCE_ANALYTICS].sort((a, b) => b.total_revenue - a.total_revenue);
        
        document.getElementById('itemPerformanceBody').innerHTML = sorted.map(item => {
            const returnRate = (item.return_rate * 100).toFixed(1);
            const damageRate = (item.damage_rate * 100).toFixed(1);
            const performance = item.return_rate === 0 && item.damage_rate === 0 ? 'Excellent' : 
                               item.return_rate < 0.2 && item.damage_rate < 0.2 ? 'Good' : 
                               item.return_rate < 0.5 && item.damage_rate < 0.5 ? 'Fair' : 'Poor';
            const performanceColor = performance === 'Excellent' ? 'var(--green)' : 
                                    performance === 'Good' ? 'var(--blue)' : 
                                    performance === 'Fair' ? 'var(--orange)' : 'var(--red)';
            return `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.type}</td>
                <td>${item.total_quantity_sold}</td>
                <td style="color: var(--green)">${peso(item.total_revenue)}</td>
                <td style="color: var(--blue)">${peso(item.total_profit)}</td>
                <td>${returnRate}%</td>
                <td>${damageRate}%</td>
                <td style="color: ${performanceColor}"><strong>${performance}</strong></td>
            </tr>`;
        }).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);">No data available</td></tr>';
    },

    renderFinancialSnapshot() {
        const latest = FINANCIAL_SNAPSHOTS.length > 0 ? FINANCIAL_SNAPSHOTS[FINANCIAL_SNAPSHOTS.length - 1] : null;
        
        if (!latest) {
            document.getElementById('financialSnapshotBody').innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">No financial snapshot available</div>';
            return;
        }

        const snapshotDate = new Date(latest.snapshot_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
        const netSalesMargin = latest.gross_sales > 0 ? ((latest.net_profit / latest.net_sales) * 100).toFixed(1) : '0.0';
        
        document.getElementById('financialSnapshotBody').innerHTML = `
            <div class="snapshot-header" style="text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);">
                <h4 style="margin:0;color:var(--accent);">Snapshot as of ${snapshotDate}</h4>
            </div>
            <div class="profit-summary" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;">
                <div class="profit-stat" style="background:var(--card-bg);padding:16px;border-radius:8px;border:1px solid var(--border);">
                    <span class="stat-label" style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">Gross Sales</span>
                    <span class="stat-value" style="display:block;font-size:1.5rem;font-weight:bold;color:var(--green);">${peso(latest.gross_sales)}</span>
                </div>
                <div class="profit-stat" style="background:var(--card-bg);padding:16px;border-radius:8px;border:1px solid var(--border);">
                    <span class="stat-label" style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">Total Returns</span>
                    <span class="stat-value" style="display:block;font-size:1.5rem;font-weight:bold;color:var(--orange);">${peso(latest.total_returns)}</span>
                </div>
                <div class="profit-stat" style="background:var(--card-bg);padding:16px;border-radius:8px;border:1px solid var(--border);">
                    <span class="stat-label" style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">Damaged Stock Loss</span>
                    <span class="stat-value" style="display:block;font-size:1.5rem;font-weight:bold;color:var(--red);">${peso(latest.damaged_stock_loss)}</span>
                </div>
                <div class="profit-stat" style="background:var(--card-bg);padding:16px;border-radius:8px;border:1px solid var(--border);">
                    <span class="stat-label" style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">Net Sales</span>
                    <span class="stat-value" style="display:block;font-size:1.5rem;font-weight:bold;color:var(--green);">${peso(latest.net_sales)}</span>
                </div>
                <div class="profit-stat" style="background:var(--card-bg);padding:16px;border-radius:8px;border:1px solid var(--border);">
                    <span class="stat-label" style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">Net Profit</span>
                    <span class="stat-value" style="display:block;font-size:1.5rem;font-weight:bold;color:var(--blue);">${peso(latest.net_profit)}</span>
                </div>
                <div class="profit-stat" style="background:var(--card-bg);padding:16px;border-radius:8px;border:1px solid var(--border);">
                    <span class="stat-label" style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">Profit Margin</span>
                    <span class="stat-value" style="display:block;font-size:1.5rem;font-weight:bold;color:var(--accent);">${netSalesMargin}%</span>
                </div>
            </div>
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
                <div>
                    <strong style="color:var(--accent);display:block;margin-bottom:8px;">Top Performing City:</strong>
                    <span style="font-size:1.2rem;color:var(--text);">${latest.top_city}</span>
                </div>
                <div>
                    <strong style="color:var(--accent);display:block;margin-bottom:8px;">Best Selling Product:</strong>
                    <span style="font-size:1.2rem;color:var(--text);">${latest.top_item}</span>
                </div>
                <div>
                    <strong style="color:var(--accent);display:block;margin-bottom:8px;">Low Stock Alerts:</strong>
                    <span style="font-size:1.2rem;color:${latest.low_stock_count > 5 ? 'var(--red)' : latest.low_stock_count > 0 ? 'var(--orange)' : 'var(--green)'};">${latest.low_stock_count}</span>
                </div>
            </div>
        `;
    },

    renderDailySalesCards() {
        const sorted = [...DAILY_SALES_SUMMARY].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        if (sorted.length === 0) {
            document.getElementById('dailySalesCards').innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">No sales data available</div>';
            return;
        }

        const maxSales = Math.max(...sorted.map(d => d.total_sales));
        
        document.getElementById('dailySalesCards').innerHTML = sorted.map(day => {
            const date = new Date(day.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
            const salesPercent = (day.total_sales / maxSales) * 100;
            const profitMargin = day.total_sales > 0 ? ((day.total_profit / day.total_sales) * 100).toFixed(1) : '0';
            
            return `
                <div class="analytics-card">
                    <div class="analytics-card-header">
                        <h4>${date}</h4>
                        <span class="badge badge-ok">${day.transactions_count} txns</span>
                    </div>
                    <div class="analytics-card-value" style="color:var(--green);">${peso(day.total_sales)}</div>
                    <div class="analytics-bar">
                        <div class="analytics-bar-fill" style="width:${salesPercent}%;background:var(--green);"></div>
                    </div>
                    <div class="analytics-card-stats">
                        <div><small>Profit:</small> <strong style="color:var(--blue);">${peso(day.total_profit)}</strong></div>
                        <div><small>Margin:</small> <strong>${profitMargin}%</strong></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderTopProductsChart() {
    const sorted = [...ITEM_PERFORMANCE_ANALYTICS].sort((a, b) => b.total_revenue - a.total_revenue).slice(0, 8);

    if (sorted.length === 0) {
        document.getElementById('topProductsChart').innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">No product sales data available</div>';
        return;
    }

    const maxRevenue = Math.max(...sorted.map(p => p.total_revenue));

    document.getElementById('topProductsChart').innerHTML = sorted.map((p, index) => {
        const revenuePercent = (p.total_revenue / maxRevenue) * 100;
        const profitPercent = p.total_revenue > 0 ? ((p.total_profit / p.total_revenue) * 100).toFixed(1) : '0';

        return `
            <div class="chart-row">
                <div class="chart-row-label">
                    <span class="chart-rank">#${index + 1}</span>
                    <strong>${p.name}</strong>
                    <small style="color:var(--text-muted);">${p.total_quantity_sold} units</small>
                </div>
                <div class="chart-row-bar">
                    <div class="chart-bar-fill" style="width:${revenuePercent}%;background:linear-gradient(90deg,var(--accent),var(--green));"></div>
                    <span class="chart-bar-value">${peso(p.total_revenue)}</span>
                </div>
                <div class="chart-row-stat">
                    <small>Profit:</small> <strong style="color:var(--blue);">${peso(p.total_profit)}</strong>
                    <small>(${profitPercent}%)</small>
                </div>
            </div>
        `;
    }).join('');
},

    renderCityPerformanceCards() {
        // Ensure live city data is up to date
        this.buildLiveCityAnalytics();
        const sorted = [...CITY_SALES_ANALYTICS].sort((a, b) => b.total_sales_amount - a.total_sales_amount).slice(0, 5);
        
        if (sorted.length === 0) {
            document.getElementById('cityPerformanceCards').innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">No city data available</div>';
            return;
        }

        const maxSales = Math.max(...sorted.map(c => c.total_sales_amount));
        
        document.getElementById('cityPerformanceCards').innerHTML = sorted.map((city, index) => {
            const salesPercent = (city.total_sales_amount / maxSales) * 100;
            const profitMargin = city.total_sales_amount > 0 ? ((city.total_profit / city.total_sales_amount) * 100).toFixed(1) : '0';
            const rankColors = ['var(--accent)', 'var(--blue)', 'var(--green)', 'var(--orange)', 'var(--text-muted)'];
            
            return `
                <div class="analytics-card">
                    <div class="analytics-card-header">
                        <h4><i class="fas fa-map-marker-alt" style="color:${rankColors[index]};"></i> ${city.city}</h4>
                        <span class="badge badge-ok"># ${index + 1}</span>
                    </div>
                    <div class="analytics-card-value" style="color:var(--green);">${peso(city.total_sales_amount)}</div>
                    <div class="analytics-bar">
                        <div class="analytics-bar-fill" style="width:${salesPercent}%;background:${rankColors[index]};"></div>
                    </div>
                    <div class="analytics-card-stats">
                        <div><small>Profit:</small> <strong style="color:var(--blue);">${peso(city.total_profit)}</strong></div>
                        <div><small>Customers:</small> <strong>${city.total_customers}</strong></div>
                        <div><small>Margin:</small> <strong>${profitMargin}%</strong></div>
                    </div>
                    <div class="analytics-card-footer">
                        <small><i class="fas fa-star"></i> ${city.most_purchased_item ? city.most_purchased_item.name : 'N/A'}</small>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Build city analytics from live sales data (customer.city)
    buildLiveCityAnalytics() {
    CITY_SALES_ANALYTICS.length = 0;
    const cityMap = {};

    SALES_LOGS.forEach(sale => {
        const city = sale.customer?.city;
        if (!city) return;

        if (!cityMap[city]) {
            cityMap[city] = {
                city,
                total_customers: new Set(),
                total_sales_amount: 0,
                total_transactions: 0,
                total_items_sold: 0,
                total_profit: 0,
                itemCounts: {}
            };
        }

        const custKey = sale.customer?.phone || sale.customer?.name || 'unknown';
        cityMap[city].total_customers.add(custKey);
        cityMap[city].total_transactions++;

        sale.items.forEach(item => {
            cityMap[city].total_sales_amount += item.line_total || 0;
            cityMap[city].total_items_sold += item.quantity || 0;
            cityMap[city].total_profit += item.profit || 0;

            const itemName = item.item_name || 'Unknown';
            cityMap[city].itemCounts[itemName] = (cityMap[city].itemCounts[itemName] || 0) + (item.quantity || 0);
        });
    });

    Object.values(cityMap).forEach(c => {
        let topItem = null, topQty = 0;
        Object.entries(c.itemCounts).forEach(([name, qty]) => {
            if (qty > topQty) { topItem = name; topQty = qty; }
        });

        CITY_SALES_ANALYTICS.push({
            city: c.city,
            total_customers: c.total_customers.size,
            total_sales_amount: c.total_sales_amount,
            total_transactions: c.total_transactions,
            total_items_sold: c.total_items_sold,
            total_profit: c.total_profit,
            most_purchased_item: topItem ? { name: topItem, quantity: topQty } : null
        });
    });
},

    renderTopCustomersChart() {
        const sorted = [...CUSTOMER_ANALYTICS].sort((a, b) => b.total_spent - a.total_spent).slice(0, 10);
        
        if (sorted.length === 0) {
            document.getElementById('topCustomersChart').innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">No customer data available</div>';
            return;
        }

        const maxSpent = Math.max(...sorted.map(c => c.total_spent));
        
        document.getElementById('topCustomersChart').innerHTML = sorted.map((customer, index) => {
            const spentPercent = (customer.total_spent / maxSpent) * 100;
            const profitPercent = customer.total_spent > 0 ? ((customer.total_profit_generated / customer.total_spent) * 100).toFixed(1) : '0';
            const lastPurchase = new Date(customer.last_purchase_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
            
            return `
                <div class="chart-row">
                    <div class="chart-row-label">
                        <span class="chart-rank">#${index + 1}</span>
                        <div>
                            <strong>${customer.name}</strong>
                            <small style="color:var(--text-muted);display:block;">${customer.city} • ${customer.favorite_item_type}</small>
                        </div>
                    </div>
                    <div class="chart-row-bar">
                        <div class="chart-bar-fill" style="width:${spentPercent}%;background:linear-gradient(90deg,var(--blue),var(--accent));"></div>
                        <span class="chart-bar-value">${peso(customer.total_spent)}</span>
                    </div>
                    <div class="chart-row-stat">
                        <small>Profit:</small> <strong style="color:var(--green);">${peso(customer.total_profit_generated)}</strong>
                        <small>(${profitPercent}%)</small>
                        <div style="margin-top:4px;font-size:0.7rem;color:var(--text-muted);">
                            <i class="fas fa-calendar"></i> ${lastPurchase}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};

// ========== POS MODULE ==========

const POS = {
    cart: [],

    init() {
        this.populateFilters();
        this.populateCustomers();
        this.renderProducts();
    },

    populateFilters() {
        const catSelect = document.getElementById('posCategory');
        const supSelect = document.getElementById('posSupplier');

        // Categories
        const usedTypes = [...new Set(ITEMS.map(i => i.typeId))];
        usedTypes.forEach(tid => {
            const t = getType(tid);
            if (t) catSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });

        // Suppliers
        const usedSuppliers = [...new Set(ITEMS.map(i => i.supplierId))];
        usedSuppliers.forEach(sid => {
            const s = getSupplier(sid);
            if (s) supSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
    },

    populateCustomers() {
        // Old method - no longer used with search box
        // Kept for backwards compatibility if needed
    },

    searchCustomers() {
        const search = document.getElementById('customerSearch').value.toLowerCase().trim();
        const resultsContainer = document.getElementById('customerSearchResults');
        
        if (search.length === 0) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
            return;
        }

        // Combine all known customers (Mock Data + Walk-ins)
        const allPotential = [...CUSTOMERS, ...WALK_IN_CUSTOMERS];

        // Filter customers by name or phone
        const matches = allPotential.filter(c => 
            (c.name && c.name.toLowerCase().includes(search)) || 
            (c.phone && c.phone.includes(search))
        );

        if (matches.length === 0) {
            resultsContainer.innerHTML = '<div style="padding:10px 12px;color:var(--text-muted);font-size:.82rem;">No customers found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        // Display matching customers
        resultsContainer.innerHTML = matches.map(c => `
            <div class="customer-result" onclick="POS.selectCustomer('${c.phone}')">
                <div class="customer-result-name">${c.name}</div>
                <div class="customer-result-phone">${c.phone}</div>
            </div>
        `).join('');
        resultsContainer.style.display = 'block';
    },

    selectCustomer(phone) {
        // Search in both arrays
        const allPotential = [...CUSTOMERS, ...WALK_IN_CUSTOMERS];
        const customer = allPotential.find(c => c.phone === phone);
        if (customer) {
            document.getElementById('customerName').value = customer.name;
            document.getElementById('customerPhone').value = customer.phone;
            document.getElementById('customerEmail').value = customer.email || '';
            document.getElementById('customerCity').value = customer.city || '';
            document.getElementById('customerSearch').value = customer.name;
            document.getElementById('customerSearchResults').style.display = 'none';
        }
    },

    filterProducts() {
        this.renderProducts();
    },

    renderProducts() {
        const search = document.getElementById('posSearch').value.toLowerCase();
        const cat = document.getElementById('posCategory').value;
        const sup = document.getElementById('posSupplier').value;

        const filtered = ITEMS.filter(item => {
            if (search && !item.name.toLowerCase().includes(search)) return false;
            if (cat !== 'all' && item.typeId !== Number(cat)) return false;
            if (sup !== 'all' && item.supplierId !== Number(sup)) return false;
            return true;
        });

        const grid = document.getElementById('productGrid');
        grid.innerHTML = filtered.map(item => {
            const type = getType(item.typeId);
            const outClass = item.qty === 0 ? 'out-of-stock' : '';
            let stockClass = '';
            let stockLabel = `${item.qty} in stock`;
            if (item.qty === 0) { stockClass = 'out'; stockLabel = 'Out of stock'; }
            else if (item.qty <= LOW_STOCK_THRESHOLD) { stockClass = 'low'; stockLabel = `Only ${item.qty} left`; }

            return `
                <div class="product-tile ${outClass}" onclick="POS.addToCart(${item.id})">
                    <div class="tile-name">${item.name}</div>
                    <div class="tile-category">${type ? type.name : ''}</div>
                    <div class="tile-price">${peso(item.price)}</div>
                    <div class="tile-stock ${stockClass}">${stockLabel}</div>
                </div>`;
        }).join('');
    },

    addToCart(itemId) {
        const item = getItem(itemId);
        if (!item || item.qty === 0) return;

        const existing = this.cart.find(c => c.itemId === itemId);
        if (existing) {
            if (existing.qty >= item.qty) {
                showToast(`Cannot add more — only ${item.qty} in stock`, 'warning');
                return;
            }
            existing.qty++;
        } else {
            this.cart.push({ itemId, qty: 1, price: item.price });
        }
        this.renderCart();
    },

    updateQty(itemId, delta) {
        const entry = this.cart.find(c => c.itemId === itemId);
        if (!entry) return;
        const item = getItem(itemId);

        entry.qty += delta;
        if (entry.qty <= 0) {
            this.cart = this.cart.filter(c => c.itemId !== itemId);
        } else if (item && entry.qty > item.qty) {
            entry.qty = item.qty;
            showToast(`Max stock: ${item.qty}`, 'warning');
        }
        this.renderCart();
    },

    clearCart() {
        this.cart = [];
        this.renderCart();
    },

    renderCart() {
        const container = document.getElementById('cartItems');
        const btn = document.getElementById('processBtn');

        if (this.cart.length === 0) {
            container.innerHTML = '<div class="cart-empty"><i class="fas fa-cart-plus"></i><p>Select products to begin</p></div>';
            document.getElementById('cartSubtotal').textContent = '₱0.00';
            document.getElementById('cartTotal').textContent = '₱0.00';
            document.getElementById('cartProfit').textContent = '₱0.00';
            btn.disabled = true;
            return;
        }

        let subtotal = 0, totalProfit = 0;
        container.innerHTML = this.cart.map(entry => {
            const item = getItem(entry.itemId);
            const lineTotal = entry.price * entry.qty;
            const lineProfit = (entry.price - (item ? item.cost : 0)) * entry.qty;
            subtotal += lineTotal;
            totalProfit += lineProfit;
            return `
                <div class="cart-item">
                    <div>
                        <div class="cart-item-name">${item ? item.name : 'Unknown'}</div>
                        <div class="cart-item-price">${peso(entry.price)} each</div>
                    </div>
                    <div class="qty-control">
                        <button onclick="POS.updateQty(${entry.itemId}, -1)"><i class="fas fa-minus"></i></button>
                        <span>${entry.qty}</span>
                        <button onclick="POS.updateQty(${entry.itemId}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="cart-item-total">${peso(lineTotal)}</div>
                </div>`;
        }).join('');

        document.getElementById('cartSubtotal').textContent = peso(subtotal);
        document.getElementById('cartTotal').textContent = peso(subtotal);
        document.getElementById('cartProfit').textContent = peso(totalProfit);
        btn.disabled = false;
    },

    async processSale() {
        if (this.cart.length === 0) {
            showToast('Please add items to cart', 'warning');
            return;
        }

        // Get customer data from form
        const customerName = document.getElementById('customerName').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const customerEmail = document.getElementById('customerEmail').value.trim();
        const customerCity = document.getElementById('customerCity').value.trim();
        const processedByUsername = document.getElementById('posCashier').value.trim();

        // Validate required fields
        if (!customerName) {
            showToast('Please enter customer name', 'warning');
            return;
        }
        if (!customerPhone) {
            showToast('Please enter customer phone', 'warning');
            return;
        }
        if (!processedByUsername) {
            showToast('Please select a cashier', 'warning');
            return;
        }

        // Check if this is a new customer (check both mock data and walk-ins)
        const allPotential = [...CUSTOMERS, ...WALK_IN_CUSTOMERS];
        const existingCustomer = allPotential.find(c => c.phone === customerPhone);
        if (!existingCustomer) {
            WALK_IN_CUSTOMERS.push({
                phone: customerPhone,
                name: customerName,
                email: customerEmail,
                city: customerCity
            });
            // Refresh the customer dropdown
            this.populateCustomers();
        }

        // ACID-like: Validate all stock first
        for (const entry of this.cart) {
            const item = getItem(entry.itemId);
            if (!item || item.qty < entry.qty) {
                showToast(`Insufficient stock for ${item ? item.name : 'item'}`, 'error');
                return;
            }
        }

        // Create sale
        // Get next sale ID from MongoDB (highest existing + 1)
let saleId = SALES.length + 1;
try {
    const existingSales = await API.getAllSales(1, 1);
    if (existingSales.success && existingSales.data.length > 0) {
        const maxId = Math.max(...existingSales.data.map(s => s.sale_id || 0));
        saleId = maxId + 1;
    }
} catch (error) {
    console.warn('Using local sale ID counter');
}
        const saleDate = new Date().toISOString().slice(0, 10);
        SALES.push({ id: saleId, date: saleDate, customerId: 0, customerData: { name: customerName, phone: customerPhone, email: customerEmail, city: customerCity } });

        // Process each item atomically
        let receiptHTML = '';
        let total = 0;
        this.cart.forEach(entry => {
            const item = getItem(entry.itemId);
            const type = getType(item.typeId);
            const lineTotal = entry.price * entry.qty;
            total += lineTotal;

            // Deduct inventory (simulates trigger trg_reduce_stock_after_sale)
            item.qty -= entry.qty;

            // Calculate warranty expiration date
            const warrantyDays = type ? type.warranty : 0;
            const warrantyExpiration = calculateWarrantyExpiration(saleDate, warrantyDays);

            // Record sale item
            SALE_ITEMS.push({
                id: SALE_ITEMS.length + 1,
                saleId,
                itemId: entry.itemId,
                qty: entry.qty,
                soldPrice: entry.price,
                warrantyExpiration: warrantyExpiration
            });

            receiptHTML += `<div class="receipt-line"><span>${item.name} x${entry.qty}</span><span>${peso(lineTotal)}</span></div>`;
        });

        receiptHTML += `<div class="receipt-total"><span>TOTAL</span><span>${peso(total)}</span></div>`;

        // Show receipt modal
        document.getElementById('saleReceipt').innerHTML = receiptHTML;
        document.getElementById('saleModal').classList.add('show');

        // ===== PREPARE LOG DATA BEFORE CLEARING CART =====
        const logItems = this.cart.map(entry => {
            const item = getItem(entry.itemId);
            return {
                item_id: entry.itemId,
                item_name: item ? item.name : 'Unknown',
                quantity: entry.qty,
                unit_price: entry.price,
                line_total: entry.price * entry.qty,
                cost: item ? item.cost : 0,
                profit: (entry.price - (item ? item.cost : 0)) * entry.qty
            };
        });

        const itemsDescription = logItems.map(i => `${i.quantity}x ${i.item_name}`).join(', ');
        const staffInfo = getStaffInfo(processedByUsername);

        // === LOG INTERCEPTOR: Auto-generate sales_log + inventory_logs ===
        // IMPORTANT: Do this BEFORE clearing cart and BEFORE dashboard.init()

        // Sales Log (with nested customer + items)
        await LogInterceptors.createSalesLog({
            sale_id: saleId,
            customer: {
                customer_id: 0,
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
                city: customerCity
            },
            items: logItems,
            total_amount: total,
            total_profit: logItems.reduce((s, i) => s + i.profit, 0),
            payment_method: 'Cash',
            processed_by: processedByUsername
        });

        // Inventory Logs (one per cart line — stock decrease)
        for (const logItem of logItems) {
            const item = getItem(logItem.item_id);
            if (item) {
                await LogInterceptors.createInventoryLog({
                    action: 'SALE',
                    item_id: logItem.item_id,
                    item_name: logItem.item_name,
                    quantity_change: -logItem.quantity,
                    previous_stock: logItem.quantity + item.qty, // was already deducted above
                    new_stock: item.qty,
                    performed_by: processedByUsername,
                    reference: 'SALE-' + saleId,
                    notes: 'Sold to ' + customerName
                });
            }
        }

        // === UNIFIED ACTIVITY FEED LOG ===
        // Log 1: Sales Processed event
        await LogInterceptors.createActivityLog({
            user_id: staffInfo.user_id,
            username: staffInfo.username,
            role: staffInfo.role,
            action: 'PROCESS_SALE',
            reference_id: saleId,
            details: `Processed sale #${saleId} to ${customerName} - ${itemsDescription} (${peso(total)})`
        });

        // Log 2: Inventory Auto-Update event (stock was deducted for each item)
        const stockSummary = logItems.map(i => {
            const item = getItem(i.item_id);
            return `${i.item_name}: -${i.quantity} (now ${item ? item.qty : '?'})`;
        }).join(', ');
        await LogInterceptors.createActivityLog({
            user_id: staffInfo.user_id,
            username: staffInfo.username,
            role: staffInfo.role,
            action: 'INVENTORY_AUTO_UPDATE',
            reference_id: saleId,
            details: `Auto stock deduction from sale #${saleId} — ${stockSummary}`
        });
        // === END LOG INTERCEPTOR ===

        // Reset
        this.cart = [];
        this.renderCart();
        this.renderProducts();
        // Clear customer form and search
        document.getElementById('customerSearch').value = '';
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerCity').value = '';
        document.getElementById('customerSearchResults').style.display = 'none';

        // Refresh dashboard data (NOW logs will be available)
        Dashboard.init();
        Inventory.init();
        Ledger.init();
        Returns.init();
        ActivityLog.init();
        
        // Refresh all log renderers
        LogRenderers.renderSalesLogs();
        LogRenderers.renderInventoryLogs();
        LogRenderers.renderActivityFeed();

        // Check new low stock alerts
        const newLow = ITEMS.filter(i => i.qty > 0 && i.qty <= LOW_STOCK_THRESHOLD);
        newLow.forEach(item => {
            showToast(`Low stock alert: ${item.name} (${item.qty} remaining)`, 'warning');
        });

        showToast(`Sale #${saleId} processed successfully`, 'success');
    }
};

// ========== INVENTORY MODULE ==========

const Inventory = {
    init() {
        this.populateDropdowns();
        this.render();
    },

    populateDropdowns() {
        // Populate category dropdown
        const typeSelect = document.getElementById('productType');
        typeSelect.innerHTML = '<option value="">-- Select Category --</option>';
        ITEM_TYPES.forEach(type => {
            typeSelect.innerHTML += `<option value="${type.id}">${type.name}</option>`;
        });

        // Populate supplier dropdown
        const supplierSelect = document.getElementById('productSupplier');
        supplierSelect.innerHTML = '<option value="">-- Select Supplier --</option>';
        SUPPLIERS.forEach(supplier => {
            supplierSelect.innerHTML += `<option value="${supplier.id}">${supplier.name}</option>`;
        });
    },

    calculatePrice() {
        const cost = parseFloat(document.getElementById('productCost').value) || 0;
        const margin = parseFloat(document.getElementById('productMargin').value) || 0;
        const priceInput = document.getElementById('productPrice');

        if (cost > 0 && margin >= 0) {
            if (margin >= 100) {
                showToast('Margin must be less than 100%', 'warning');
                return;
            }
            // SP = CP / (1 - (Margin/100))
            const sp = cost / (1 - (margin / 100));
            priceInput.value = sp.toFixed(2);
        }
    },

    calculateMargin() {
        const cost = parseFloat(document.getElementById('productCost').value) || 0;
        const sp = parseFloat(document.getElementById('productPrice').value) || 0;
        const marginInput = document.getElementById('productMargin');

        if (cost > 0 && sp > 0) {
            // Margin = (SP - CP) / SP * 100
            const margin = ((sp - cost) / sp) * 100;
            marginInput.value = margin.toFixed(1);
        } else {
            marginInput.value = '';
        }
    },

    async saveProduct() {
        const editId = document.getElementById('editProductId').value;
        const name = document.getElementById('productName').value.trim();
        const typeId = Number(document.getElementById('productType').value);
        const supplierId = Number(document.getElementById('productSupplier').value);
        const qty = Number(document.getElementById('productQty').value);
        const price = Number(document.getElementById('productPrice').value);
        const cost = Number(document.getElementById('productCost').value);
        const staffUsername = document.getElementById('productStaff').value.trim();

        // Validation
        if (!name) {
            showToast('Please enter product name', 'warning');
            return;
        }
        if (!typeId) {
            showToast('Please select a category', 'warning');
            return;
        }
        if (!supplierId) {
            showToast('Please select a supplier', 'warning');
            return;
        }
        if (price <= 0) {
            showToast('Selling price must be greater than 0', 'warning');
            return;
        }
        if (cost < 0) {
            showToast('Cost cannot be negative', 'warning');
            return;
        }
        if (!staffUsername) {
            showToast('Please select a staff member', 'warning');
            return;
        }

        if (editId) {
            // Edit existing product
            const item = getItem(Number(editId));
            if (item) {
                const oldQty = item.qty;
                const qtyChanged = qty !== oldQty;
                
                item.name = name;
                item.typeId = typeId;
                item.supplierId = supplierId;
                item.qty = qty;
                item.price = price;
                item.cost = cost;
                showToast(`Product "${name}" updated successfully`, 'success');

                // === LOG INTERCEPTOR: inventory_log if stock changed ===
                if (qtyChanged) {
                    const qtyChange = qty - oldQty;
                    await LogInterceptors.createInventoryLog({
                        action: 'PRODUCT_UPDATED',
                        item_id: Number(editId),
                        item_name: name,
                        quantity_change: qtyChange,
                        previous_stock: oldQty,
                        new_stock: qty,
                        performed_by: staffUsername,
                        reference: 'PRODUCT-EDIT',
                        notes: `Product stock adjusted during edit - ${oldQty} → ${qty}`
                    });
                }

                // === UNIFIED ACTIVITY FEED LOG ===
                const staffInfo = getStaffInfo(staffUsername);
                await LogInterceptors.createActivityLog({
                    user_id: staffInfo.user_id,
                    username: staffInfo.username,
                    role: staffInfo.role,
                    action: 'UPDATE_PRODUCT',
                    reference_id: Number(editId),
                    details: `Updated product "${name}" - Category: ${ITEM_TYPES.find(t => t.id === typeId)?.name || 'Unknown'}, Price: ${peso(price)}${qtyChanged ? `, Stock: ${oldQty} → ${qty}` : ''}`
                });
            }
        } else {
            // Add new product
            const newId = Math.max(...ITEMS.map(i => i.id)) + 1;
            ITEMS.push({
                id: newId,
                name,
                typeId,
                supplierId,
                qty,
                price,
                cost
            });
            showToast(`Product "${name}" added successfully`, 'success');

            // === LOG INTERCEPTOR: inventory_log for initial stock ===
            await LogInterceptors.createInventoryLog({
                action: 'PRODUCT_ADDED',
                item_id: newId,
                item_name: name,
                quantity_change: qty,
                previous_stock: 0,
                new_stock: qty,
                performed_by: staffUsername,
                reference: 'NEW-PRODUCT',
                notes: `New product added with initial stock of ${qty} units`
            });

            // === UNIFIED ACTIVITY FEED LOG ===
            const staffInfo = getStaffInfo(staffUsername);
            await LogInterceptors.createActivityLog({
                user_id: staffInfo.user_id,
                username: staffInfo.username,
                role: staffInfo.role,
                action: 'ADD_PRODUCT',
                reference_id: newId,
                details: `Added new product "${name}" - Category: ${ITEM_TYPES.find(t => t.id === typeId)?.name || 'Unknown'}, Price: ${peso(price)}, Qty: ${qty}`
            });
        }

        this.cancelEdit();
        this.render();
        POS.init(); // Refresh POS to show new/updated product
        Dashboard.init(); // Refresh dashboard
        ActivityLog.init(); // Refresh activity log to show new product logs
        LogRenderers.renderActivityFeed(); // Update activity feed display
    },

    editProduct(itemId) {
        const item = getItem(Number(itemId));
        if (!item) {
            console.error('Product not found:', itemId);
            return;
        }

        document.getElementById('editProductId').value = item.id;
        document.getElementById('productName').value = item.name;
        document.getElementById('productType').value = item.typeId;
        document.getElementById('productSupplier').value = item.supplierId;
        document.getElementById('productQty').value = item.qty;
        document.getElementById('productPrice').value = item.price;
        document.getElementById('productCost').value = item.cost;
        
        // Populate margin field
        const margin = item.price > 0 ? (((item.price - item.cost) / item.price) * 100).toFixed(1) : '0';
        document.getElementById('productMargin').value = margin;

        document.getElementById('productFormTitle').textContent = 'Edit Product';
        document.getElementById('productSaveBtn').textContent = 'Update Product';
        document.getElementById('productCancelBtn').style.display = 'inline-flex';

        // Scroll to form - more robust selector
        const formCard = document.querySelector('#view-inventory .card');
        if (formCard) {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    cancelEdit() {
        document.getElementById('editProductId').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productType').value = '';
        document.getElementById('productSupplier').value = '';
        document.getElementById('productQty').value = '0';
        document.getElementById('productPrice').value = '';
        document.getElementById('productCost').value = '';
        document.getElementById('productMargin').value = '';
        document.getElementById('productStaff').value = '';

        document.getElementById('productFormTitle').textContent = 'Add New Product';
        document.getElementById('productSaveBtn').textContent = 'Add Product';
        document.getElementById('productCancelBtn').style.display = 'none';
    },

    searchProducts() {
        const search = document.getElementById('addStockSearch').value.toLowerCase().trim();
        const resultsContainer = document.getElementById('addStockResults');
        
        if (search.length === 0) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
            return;
        }

        const matches = ITEMS.filter(item => 
            item.name.toLowerCase().includes(search)
        );

        if (matches.length === 0) {
            resultsContainer.innerHTML = '<div style="padding:10px 12px;color:var(--text-muted);font-size:.82rem;">No products found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        resultsContainer.innerHTML = matches.map(item => `
            <div class="product-result" onclick="Inventory.selectProduct(${item.id})">
                <div class="product-result-name">${item.name}</div>
                <div class="product-result-info">Current: ${item.qty} units</div>
            </div>
        `).join('');
        resultsContainer.style.display = 'block';
    },

    selectProduct(productId) {
        const item = getItem(productId);
        if (item) {
            document.getElementById('addStockSearch').value = item.name;
            document.getElementById('addStockProductId').value = productId;
            document.getElementById('currentStock').value = item.qty;
            document.getElementById('addStockResults').style.display = 'none';
        }
    },

    async addStock() {
        const productId = Number(document.getElementById('addStockProductId').value);
        const qtyToAdd = Number(document.getElementById('addStockQty').value);
        const staffUsername = document.getElementById('stockStaff').value.trim();

        if (!productId) {
            showToast('Please select a product from the list', 'warning');
            return;
        }

        if (qtyToAdd <= 0) {
            showToast('Quantity must be greater than 0', 'warning');
            return;
        }

        if (!staffUsername) {
            showToast('Please select a staff member', 'warning');
            return;
        }

        const item = getItem(productId);
        if (!item) {
            showToast('Product not found', 'error');
            return;
        }

        const oldQty = item.qty;
        item.qty += qtyToAdd;

        // === LOG INTERCEPTOR: inventory_log for restock ===
        await LogInterceptors.createInventoryLog({
            action: 'RESTOCK',
            item_id: productId,
            item_name: item.name,
            quantity_change: qtyToAdd,
            previous_stock: oldQty,
            new_stock: item.qty,
            performed_by: staffUsername,
            reference: 'MANUAL-RESTOCK',
            notes: `Manual restock of ${qtyToAdd} units`
        });

        // === UNIFIED ACTIVITY FEED LOG ===
        const staffInfo = getStaffInfo(staffUsername);
        await LogInterceptors.createActivityLog({
            user_id: staffInfo.user_id,
            username: staffInfo.username,
            role: staffInfo.role,
            action: 'RESTOCK_ITEM',
            reference_id: productId,
            details: `Restocked ${qtyToAdd} units of ${item.name} - Stock updated: ${oldQty} → ${item.qty}`
        });
        // === END LOG INTERCEPTOR ===

        // Reset form
        document.getElementById('addStockSearch').value = '';
        document.getElementById('addStockProductId').value = '';
        document.getElementById('currentStock').value = '';
        document.getElementById('addStockQty').value = 1;
        document.getElementById('stockStaff').value = '';

        // Refresh displays
        this.render();
        Dashboard.init(); // Refresh alerts
        POS.renderProducts(); // Refresh POS tiles
        ActivityLog.init(); // Refresh activity stats
        LogRenderers.renderActivityFeed();

        showToast(`Added ${qtyToAdd} units to ${item.name}. Stock updated: ${oldQty} → ${item.qty}`, 'success');
    },

    render() {
        const body = document.getElementById('inventoryBody');
        LogRenderers.renderInventoryLogs();
        body.innerHTML = ITEMS.map(item => {
            const type = getType(item.typeId);
            const supplier = getSupplier(item.supplierId);
            const margin = item.price > 0 ? (((item.price - item.cost) / item.price) * 100).toFixed(1) : '0.0';
            const warranty = type ? type.warranty : 0;

            let badge = '', badgeClass = '';
            if (item.qty === 0) { badge = 'Out of Stock'; badgeClass = 'badge-out'; }
            else if (item.qty <= LOW_STOCK_THRESHOLD) { badge = 'Low Stock'; badgeClass = 'badge-low'; }
            else { badge = 'In Stock'; badgeClass = 'badge-ok'; }

            return `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${type ? type.name : ''}</td>
                    <td>${supplier ? supplier.name : ''}</td>
                    <td>${item.qty}</td>
                    <td>${peso(item.price)}</td>
                    <td>${peso(item.cost)}</td>
                    <td>${margin}%</td>
                    <td>${warranty} days</td>
                    <td><span class="badge ${badgeClass}">${badge}</span></td>
                    <td>
                        <button class="btn-info-circle" onclick="Inventory.editProduct(${item.id})" title="Edit Product">
                            <i class="fas fa-pen"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
    },

    filter() {
        const search = document.getElementById('invSearch').value.toLowerCase();
        const stockFilter = document.getElementById('invStockFilter').value;
        const body = document.getElementById('inventoryBody');

        const filtered = ITEMS.filter(item => {
            if (search && !item.name.toLowerCase().includes(search)) return false;
            if (stockFilter === 'low' && item.qty > LOW_STOCK_THRESHOLD) return false;
            if (stockFilter === 'out' && item.qty > 0) return false;
            return true;
        });

        body.innerHTML = filtered.map(item => {
            const type = getType(item.typeId);
            const supplier = getSupplier(item.supplierId);
            const margin = item.price > 0 ? (((item.price - item.cost) / item.price) * 100).toFixed(1) : '0.0';
            const warranty = type ? type.warranty : 0;

            let badge = '', badgeClass = '';
            if (item.qty === 0) { badge = 'Out of Stock'; badgeClass = 'badge-out'; }
            else if (item.qty <= LOW_STOCK_THRESHOLD) { badge = 'Low Stock'; badgeClass = 'badge-low'; }
            else { badge = 'In Stock'; badgeClass = 'badge-ok'; }

            return `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${type ? type.name : ''}</td>
                    <td>${supplier ? supplier.name : ''}</td>
                    <td>${item.qty}</td>
                    <td>${peso(item.price)}</td>
                    <td>${peso(item.cost)}</td>
                    <td>${margin}%</td>
                    <td>${warranty} days</td>
                    <td><span class="badge ${badgeClass}">${badge}</span></td>
                    <td>
                        <button class="btn-info-circle" onclick="Inventory.editProduct(${item.id})" title="Edit Product">
                            <i class="fas fa-pen"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
    }
};

// ========== LEDGER MODULE ==========

const Ledger = {
    init() {
        this.render();
        LogRenderers.renderSalesLogs();
    },

    render() {
        const body = document.getElementById('ledgerBody');
        
        // Combine SALE_ITEMS and RETURNS into a unified ledger
        const allTransactions = [];
        
        // Add sales
        SALE_ITEMS.forEach(si => {
            const sale = SALES.find(s => s.id === si.saleId);
            const item = getItem(si.itemId);
            let customerName = 'N/A';
            let customerDetails = null;
            if (sale) {
                if (sale.customerData) {
                    customerName = sale.customerData.name;
                    customerDetails = sale.customerData;
                } else {
                    const customer = getCustomer(sale.customerId);
                    customerName = customer ? customer.name : 'N/A';
                    customerDetails = customer;
                }
            }
            const lineTotal = si.soldPrice * si.qty;
            const profit = (si.soldPrice - (item ? item.cost : 0)) * si.qty;
            
            if (customerName !== 'N/A') {
                allTransactions.push({
                    type: 'sale',
                    id: si.id,
                    saleId: si.saleId,
                    date: sale ? sale.date : '',
                    customerName,
                    customerDetails,
                    item,
                    itemName: item ? item.name : 'N/A',
                    qty: si.qty,
                    soldPrice: si.soldPrice,
                    lineTotal,
                    profit,
                    warrantyExpiration: si.warrantyExpiration,
                    sale,
                    si
                });
            }
        });
        
        // Add returns as negative profit entries
        RETURNS.forEach(ret => {
            const item = getItem(ret.itemId);
            let customerName = 'Walk-in';
            let customerDetails = null;
            
            if (ret.customerData) {
                customerName = ret.customerData.name;
                customerDetails = ret.customerData;
            } else if (ret.customerId) {
                const customer = getCustomer(ret.customerId);
                if (customer) {
                    customerName = customer.name;
                    customerDetails = customer;
                }
            }
            
            allTransactions.push({
                type: 'return',
                id: ret.id,
                saleId: ret.saleId,
                date: ret.date,
                customerName,
                customerDetails,
                item,
                itemName: ret.itemName,
                qty: -ret.qty, // Negative quantity for returns
                soldPrice: ret.soldPrice,
                lineTotal: -ret.returnedAmount, // Negative amount
                profit: -ret.profitLoss, // Negative profit impact
                warrantyExpiration: null,
                reason: ret.reason,
                disposition: ret.disposition,
                returnRecord: ret
            });
        });
        
        // Sort by date descending
        allTransactions.sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.saleId - a.saleId;
        });

        body.innerHTML = allTransactions.map(r => {
            if (r.type === 'sale') {
                const warrantyStatus = r.warrantyExpiration ? getWarrantyStatus(r.warrantyExpiration) : { status: 'N/A', class: '' };
                return `
                <tr>
                    <td>${r.saleId}</td>
                    <td>${r.date}</td>
                    <td>${r.customerName}</td>
                    <td>${r.itemName}</td>
                    <td>${r.qty}</td>
                    <td>${peso(r.soldPrice)}</td>
                    <td>${peso(r.lineTotal)}</td>
                    <td style="color: var(--green)">${peso(r.profit)}</td>
                    <td>${r.warrantyExpiration || 'N/A'}</td>
                    <td><span class="warranty-badge ${warrantyStatus.class}">${warrantyStatus.status}</span></td>
                    <td>
                        <button class="btn-info-circle" onclick="Ledger.showDetails(${r.id}, 'sale')" title="View Details">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </td>
                </tr>`;
            } else {
                // Return row
                return `
                <tr style="background: rgba(255, 107, 157, 0.05);">
                    <td>R-${r.id} <span style="font-size:0.7rem;color:var(--text-muted);">(Ref: ${r.saleId})</span></td>
                    <td>${r.date}</td>
                    <td>${r.customerName}</td>
                    <td>${r.itemName} <span style="font-size:0.7rem;color:var(--red);">RETURN</span></td>
                    <td style="color: var(--red)">${r.qty}</td>
                    <td>${peso(r.soldPrice)}</td>
                    <td style="color: var(--red)">${peso(r.lineTotal)}</td>
                    <td style="color: var(--red); font-weight: 600;">${peso(r.profit)}</td>
                    <td colspan="2" style="color: var(--text-muted); font-size:0.78rem;">${r.reason} → ${r.disposition}</td>
                    <td>
                        <button class="btn-info-circle" onclick="Ledger.showDetails(${r.id}, 'return')" title="View Details">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </td>
                </tr>`;
            }
        }).join('');
    },

    filter() {
        const searchInput = document.getElementById('ledgerSearch').value.toLowerCase().trim();
        const from = document.getElementById('ledgerDateFrom').value;
        const to = document.getElementById('ledgerDateTo').value;
        const body = document.getElementById('ledgerBody');

        const allTransactions = [];
        
        // Add sales
        SALE_ITEMS.forEach(si => {
            const sale = SALES.find(s => s.id === si.saleId);
            const item = getItem(si.itemId);
            let customerName = 'N/A';
            let customerDetails = null;
            if (sale) {
                if (sale.customerData) {
                    customerName = sale.customerData.name;
                    customerDetails = sale.customerData;
                } else {
                    const customer = getCustomer(sale.customerId);
                    customerName = customer ? customer.name : 'N/A';
                    customerDetails = customer;
                }
            }
            const lineTotal = si.soldPrice * si.qty;
            const profit = (si.soldPrice - (item ? item.cost : 0)) * si.qty;
            
            if (customerName !== 'N/A') {
                allTransactions.push({
                    type: 'sale',
                    id: si.id,
                    saleId: si.saleId,
                    date: sale ? sale.date : '',
                    customerName,
                    customerDetails,
                    item,
                    itemName: item ? item.name : 'N/A',
                    qty: si.qty,
                    soldPrice: si.soldPrice,
                    lineTotal,
                    profit,
                    warrantyExpiration: si.warrantyExpiration,
                    sale,
                    si
                });
            }
        });
        
        // Add returns
        RETURNS.forEach(ret => {
            const item = getItem(ret.itemId);
            let customerName = 'Walk-in';
            let customerDetails = null;
            
            if (ret.customerData) {
                customerName = ret.customerData.name;
                customerDetails = ret.customerData;
            } else if (ret.customerId) {
                const customer = getCustomer(ret.customerId);
                if (customer) {
                    customerName = customer.name;
                    customerDetails = customer;
                }
            }
            
            allTransactions.push({
                type: 'return',
                id: ret.id,
                saleId: ret.saleId,
                date: ret.date,
                customerName,
                customerDetails,
                item,
                itemName: ret.itemName,
                qty: -ret.qty,
                soldPrice: ret.soldPrice,
                lineTotal: -ret.returnedAmount,
                profit: -ret.profitLoss,
                warrantyExpiration: null,
                reason: ret.reason,
                disposition: ret.disposition,
                returnRecord: ret
            });
        });
        
        // Apply filters
        const rows = allTransactions.filter(r => {
            // Text Search filter
            if (searchInput) {
                const matchesId = r.saleId.toString() === searchInput;
                const matchesCustomer = r.customerName.toLowerCase().includes(searchInput);
                const matchesItem = r.itemName.toLowerCase().includes(searchInput);
                if (!matchesId && !matchesCustomer && !matchesItem) return false;
            }

            if (from && r.date < from) return false;
            if (to && r.date > to) return false;
            return true;
        }).sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.saleId - a.saleId;
        });

        body.innerHTML = rows.map(r => {
            if (r.type === 'sale') {
                const warrantyStatus = r.warrantyExpiration ? getWarrantyStatus(r.warrantyExpiration) : { status: 'N/A', class: '' };
                return `
                <tr>
                    <td>${r.saleId}</td>
                    <td>${r.date}</td>
                    <td>${r.customerName}</td>
                    <td>${r.itemName}</td>
                    <td>${r.qty}</td>
                    <td>${peso(r.soldPrice)}</td>
                    <td>${peso(r.lineTotal)}</td>
                    <td style="color: var(--green)">${peso(r.profit)}</td>
                    <td>${r.warrantyExpiration || 'N/A'}</td>
                    <td><span class="warranty-badge ${warrantyStatus.class}">${warrantyStatus.status}</span></td>
                    <td>
                        <button class="btn-info-circle" onclick="Ledger.showDetails(${r.id}, 'sale')" title="View Details">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </td>
                </tr>`;
            } else {
                return `
                <tr style="background: rgba(255, 107, 157, 0.05);">
                    <td>R-${r.id} <span style="font-size:0.7rem;color:var(--text-muted);">(Ref: ${r.saleId})</span></td>
                    <td>${r.date}</td>
                    <td>${r.customerName}</td>
                    <td>${r.itemName} <span style="font-size:0.7rem;color:var(--red);">RETURN</span></td>
                    <td style="color: var(--red)">${r.qty}</td>
                    <td>${peso(r.soldPrice)}</td>
                    <td style="color: var(--red)">${peso(r.lineTotal)}</td>
                    <td style="color: var(--red); font-weight: 600;">${peso(r.profit)}</td>
                    <td colspan="2" style="color: var(--text-muted); font-size:0.78rem;">${r.reason} → ${r.disposition}</td>
                    <td>
                        <button class="btn-info-circle" onclick="Ledger.showDetails(${r.id}, 'return')" title="View Details">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </td>
                </tr>`;
            }
        }).join('');
    },

    showDetails(id, type) {
        let content = '';
        
        if (type === 'sale') {
            const si = SALE_ITEMS.find(item => item.id === id);
            if (!si) return;

            const sale = SALES.find(s => s.id === si.saleId);
            const product = getItem(si.itemId);
            
            let customer = { name: 'Walk-in Customer', phone: 'N/A', email: 'N/A', city: 'N/A' };
            if (sale) {
                if (sale.customerData) {
                    customer = sale.customerData;
                } else {
                    const c = getCustomer(sale.customerId);
                    if (c) customer = c;
                }
            }

            content = `
                <div class="receipt-line"><span>Sale ID</span><span>#${si.saleId}</span></div>
                <div class="receipt-line"><span>Date</span><span>${sale ? sale.date : 'N/A'}</span></div>
                <div class="receipt-line"><span>Product</span><span>${product ? product.name : 'Unknown'}</span></div>
                <div class="receipt-line"><span>Quantity</span><span>${si.qty} units</span></div>
                <div class="receipt-line"><span>Unit Price</span><span>${peso(si.soldPrice)}</span></div>
                <div class="receipt-total"><span>Line Total</span><span>${peso(si.soldPrice * si.qty)}</span></div>
                
                <div class="detail-section">
                    <div class="detail-title">Customer Information</div>
                    <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${customer.name}</span></div>
                    <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${customer.phone}</span></div>
                    <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${customer.email || 'N/A'}</span></div>
                    <div class="detail-row"><span class="detail-label">City</span><span class="detail-value">${customer.city || 'N/A'}</span></div>
                </div>
                
                <div class="detail-section">
                    <div class="detail-title">Warranty Status</div>
                    <div class="detail-row"><span class="detail-label">Expires On</span><span class="detail-value">${si.warrantyExpiration || 'N/A'}</span></div>
                    <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value" style="color:${getWarrantyStatus(si.warrantyExpiration).class === 'warranty-active' ? 'var(--green)' : 'var(--red)'}">${getWarrantyStatus(si.warrantyExpiration).status}</span></div>
                </div>
            `;
        } else if (type === 'return') {
            const ret = RETURNS.find(r => r.id === id);
            if (!ret) return;
            
            const product = getItem(ret.itemId);
            let customer = { name: 'Walk-in Customer', phone: 'N/A', email: 'N/A', city: 'N/A' };
            
            if (ret.customerData) {
                customer = ret.customerData;
            } else if (ret.customerId) {
                const c = getCustomer(ret.customerId);
                if (c) customer = c;
            }
            
            const dispositionColor = ret.restocked ? 'var(--green)' : 'var(--red)';
            
            content = `
                <div class="receipt-line"><span>Return ID</span><span>#R-${ret.id}</span></div>
                <div class="receipt-line"><span>Original Sale</span><span>#${ret.saleId}</span></div>
                <div class="receipt-line"><span>Return Date</span><span>${ret.date}</span></div>
                <div class="receipt-line"><span>Product</span><span>${ret.itemName}</span></div>
                <div class="receipt-line"><span>Quantity Returned</span><span style="color:var(--red)">${ret.qty} units</span></div>
                <div class="receipt-line"><span>Original Price</span><span>${peso(ret.soldPrice)}</span></div>
                <div class="receipt-total" style="border-top-color: var(--red);"><span>Refund Amount</span><span style="color:var(--red)">${peso(ret.returnedAmount)}</span></div>
                
                <div class="detail-section">
                    <div class="detail-title">Return Information</div>
                    <div class="detail-row"><span class="detail-label">Reason</span><span class="detail-value">${ret.reason}</span></div>
                    <div class="detail-row"><span class="detail-label">Disposition</span><span class="detail-value" style="color:${dispositionColor}; font-weight:600;">${ret.disposition}</span></div>
                    <div class="detail-row"><span class="detail-label">Profit Impact</span><span class="detail-value" style="color:var(--red); font-weight:600;">${peso(ret.profitLoss)}</span></div>
                </div>
                
                <div class="detail-section">
                    <div class="detail-title">Customer Information</div>
                    <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${customer.name}</span></div>
                    <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${customer.phone}</span></div>
                    <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${customer.email || 'N/A'}</span></div>
                    <div class="detail-row"><span class="detail-label">City</span><span class="detail-value">${customer.city || 'N/A'}</span></div>
                </div>
            `;
        }

        document.getElementById('saleDetailsContent').innerHTML = content;
        document.getElementById('saleDetailsModal').classList.add('show');
    },

    closeDetailsModal() {
        document.getElementById('saleDetailsModal').classList.remove('show');
    }
};

// ========== RETURNS MODULE ==========

const Returns = {
    init() {
        this.populateSales();
        this.renderHistory();
    },

    populateSales() {
        const select = document.getElementById('returnSaleId');
        // Clear existing options
        select.innerHTML = '<option value="">-- Select Sale --</option>';
        // Only show sales that have sale items and valid customer names
        const saleIds = [...new Set(SALE_ITEMS.map(si => si.saleId))].sort((a, b) => b - a);
        saleIds.forEach(sid => {
            const sale = SALES.find(s => s.id === sid);
            const customerData = sale.customerData;
            const customerName = customerData ? customerData.name : getCustomer(sale.customerId)?.name || 'N/A';
            // Only add if customer name is not N/A
            if (customerName !== 'N/A') {
                select.innerHTML += `<option value="${sid}">Sale #${sid} — ${customerName} (${sale ? sale.date : ''})</option>`;
            }
        });
    },

    loadSaleItems() {
        const saleId = Number(document.getElementById('returnSaleId').value);
        const itemSelect = document.getElementById('returnItem');
        const qtyInput = document.getElementById('returnQty');
        const reasonSelect = document.getElementById('returnReason');
        const approverSelect = document.getElementById('returnApprover');
        const submitBtn = document.getElementById('submitReturnBtn');

        itemSelect.innerHTML = '<option value="">-- Select Item --</option>';

        if (!saleId) {
            itemSelect.disabled = true;
            qtyInput.disabled = true;
            reasonSelect.disabled = true;
            approverSelect.disabled = true;
            submitBtn.disabled = true;
            return;
        }

        const items = SALE_ITEMS.filter(si => si.saleId === saleId);
        items.forEach(si => {
            const item = getItem(si.itemId);
            itemSelect.innerHTML += `<option value="${si.id}">${item ? item.name : 'Unknown'} (Qty: ${si.qty})</option>`;
        });

        itemSelect.disabled = false;
        qtyInput.disabled = false;
        reasonSelect.disabled = false;
        approverSelect.disabled = false;
        submitBtn.disabled = false;
    },

    async submit() {
        const saleId = Number(document.getElementById('returnSaleId').value);
        const saleItemId = Number(document.getElementById('returnItem').value);
        const qty = Number(document.getElementById('returnQty').value);
        const reason = document.getElementById('returnReason').value;
        const approverUsername = document.getElementById('returnApprover').value.trim();

        if (!saleId || !saleItemId || qty < 1) {
            showToast('Please fill in all return fields', 'warning');
            return;
        }

        if (!approverUsername) {
            showToast('Please select an approver', 'warning');
            return;
        }

        const saleItem = SALE_ITEMS.find(si => si.id === saleItemId);
        if (!saleItem) {
            showToast('Sale item not found', 'error');
            return;
        }

        if (qty > saleItem.qty) {
            showToast(`Cannot return more than ${saleItem.qty} units`, 'error');
            return;
        }

        const item = getItem(saleItem.itemId);
        const sale = SALES.find(s => s.id === saleId);
        
        // Determine disposition based on reason
        let disposition = '';
        let restocked = false;
        
        if (reason === 'Defective') {
            disposition = 'Defective Bin';
            restocked = false;
            // Defective items do NOT return to inventory
        } else {
            disposition = 'Returned to Stock';
            restocked = true;
            // Restock inventory for non-defective returns
            if (item) {
                item.qty += qty;
            }
        }

        // Calculate return impact on profit
        const returnedAmount = saleItem.soldPrice * qty;
        const returnedCost = (item ? item.cost : 0) * qty;
        const profitLoss = returnedAmount - returnedCost;

        // Record return with full details
        const returnRecord = {
            id: nextReturnId++,
            saleId,
            saleItemId,
            itemId: saleItem.itemId,
            itemName: item ? item.name : 'Unknown',
            qty,
            soldPrice: saleItem.soldPrice,
            returnedAmount,
            profitLoss,
            reason,
            disposition,
            restocked,
            date: new Date().toISOString().slice(0, 10),
            customerData: sale?.customerData || null,
            customerId: sale?.customerId || 0,
            status: 'Approved'
        };
        
        RETURNS.push(returnRecord);

        // === LOG INTERCEPTOR: Auto-generate return_log + system_activity_log ===
        const customerNameForLog = sale?.customerData?.name || (sale?.customerId ? (getCustomer(sale.customerId)?.name || 'Walk-in') : 'Walk-in');

        await LogInterceptors.createReturnLog({
            return_id: returnRecord.id,
            original_sale_id: saleId,
            item_id: saleItem.itemId,
            item_name: item ? item.name : 'Unknown',
            quantity_returned: qty,
            reason,
            disposition,
            refund_amount: returnedAmount,
            restocked,
            approved_by: approverUsername,
            customer_name: customerNameForLog,
            notes: `Return for Sale #${saleId} — ${reason}`
        });

        // Inventory log if restocked
        if (restocked && item) {
            await LogInterceptors.createInventoryLog({
                action: 'RETURN',
                item_id: saleItem.itemId,
                item_name: item.name,
                quantity_change: qty,
                previous_stock: item.qty - qty,
                new_stock: item.qty,
                performed_by: approverUsername,
                reference: 'RET-' + returnRecord.id,
                notes: `Restocked from Return #${returnRecord.id}`
            });
        }

        // === UNIFIED ACTIVITY FEED LOG ===
        const staffInfo = getStaffInfo(approverUsername);
        await LogInterceptors.createActivityLog({
            user_id: staffInfo.user_id,
            username: staffInfo.username,
            role: staffInfo.role,
            action: 'PROCESS_RETURN',
            reference_id: returnRecord.id,
            details: `Processed return #${returnRecord.id} for ${qty}x ${item ? item.name : 'item'} from sale #${saleId} - ${reason} - Refund: ${peso(returnedAmount)}`
        });
        // === END LOG INTERCEPTOR ===

        const restockMsg = restocked ? 'restocked' : 'sent to defective bin';
        showToast(`Return processed — ${qty} x ${item ? item.name : 'item'} ${restockMsg}`, 'success');

        // Reset form
        document.getElementById('returnSaleId').value = '';
        document.getElementById('returnItem').innerHTML = '<option value="">-- Select Item --</option>';
        document.getElementById('returnItem').disabled = true;
        document.getElementById('returnQty').value = 1;
        document.getElementById('returnQty').disabled = true;
        document.getElementById('returnReason').disabled = true;
        document.getElementById('returnApprover').value = '';
        document.getElementById('returnApprover').disabled = true;
        document.getElementById('submitReturnBtn').disabled = true;

        this.renderHistory();
        Dashboard.init();
        Ledger.init();
        Inventory.render();
        POS.renderProducts();
        ActivityLog.init();
        LogRenderers.renderActivityFeed();
    },

    renderHistory() {
        LogRenderers.renderReturnLogs();
        const body = document.getElementById('returnsBody');
        if (RETURNS.length === 0) {
            body.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px;">No returns recorded yet</td></tr>';
            return;
        }
        body.innerHTML = RETURNS.map(r => {
            const dispositionColor = r.restocked ? 'var(--green)' : 'var(--red)';
            return `
            <tr>
                <td>${r.id}</td>
                <td>${r.saleId}</td>
                <td>${r.itemName}</td>
                <td>${r.qty}</td>
                <td>${r.reason}</td>
                <td style="color: ${dispositionColor}; font-weight: 600;">${r.disposition}</td>
                <td style="color: var(--red)">${peso(r.profitLoss)}</td>
                <td><span class="badge badge-approved">${r.status}</span></td>
            </tr>`;
        }).join('');
    }
};

// ========== LOG INTERCEPTORS — Automated Multi-DB Inserts ==========

const LogInterceptors = {
    // --- Data cleaning helpers (strict MongoDB $jsonSchema compliance) ---
    cleanString(val) { return String(val || '').trim(); },
    cleanNumber(val) { return parseFloat(val) || 0; },
    cleanInt(val) { return parseInt(val, 10) || 0; },
    cleanDate(val) { return new Date(val || Date.now()); },

    // Generate a pseudo ObjectId
    objectId(prefix) {
        return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    // --- Inventory Log Creator ---
    async createInventoryLog({ action, item_id, item_name, quantity_change, previous_stock, new_stock, performed_by, reference, notes }) {
        const log = {
            timestamp: this.cleanDate(new Date()),
            action: this.cleanString(action),
            item_id: this.cleanInt(item_id),
            item_name: this.cleanString(item_name),
            quantity_change: this.cleanNumber(quantity_change),
            previous_stock: this.cleanInt(previous_stock),
            new_stock: this.cleanInt(new_stock),
            performed_by: this.cleanString(performed_by || 'staff'),
            reference: this.cleanString(reference),
            notes: this.cleanString(notes)
        };
        INVENTORY_LOGS.unshift(log);
        
        // ⭐ Save to MongoDB via API
        try {
            if (typeof API !== 'undefined') {
                await API.logInventoryAction(log);
                console.log('✅ Inventory log saved to MongoDB');
            }
        } catch (error) {
            console.error('❌ Failed to save inventory log to MongoDB:', error);
        }
        
        return log;
    },

    // --- Sales Log Creator (nested customer + items array) ---
    async createSalesLog({ sale_id, customer, items, total_amount, total_profit, payment_method, processed_by }) {
        const cleanItems = (items || []).map(i => ({
            item_id: this.cleanInt(i.item_id),
            item_name: this.cleanString(i.item_name),
            quantity: this.cleanInt(i.quantity),
            unit_price: this.cleanNumber(i.unit_price),
            line_total: this.cleanNumber(i.line_total),
            cost: this.cleanNumber(i.cost),
            profit: this.cleanNumber(i.profit)
        }));
        const log = {
            timestamp: this.cleanDate(new Date()),
            sale_id: this.cleanInt(sale_id),
            transaction_type: 'SALE',
            customer: {
                customer_id: this.cleanInt(customer.customer_id || 0),
                name: this.cleanString(customer.name),
                phone: this.cleanString(customer.phone),
                email: this.cleanString(customer.email),
                city: this.cleanString(customer.city || customer.address)
            },
            items: cleanItems,
            total_amount: this.cleanNumber(total_amount),
            total_profit: this.cleanNumber(total_profit),
            payment_method: this.cleanString(payment_method || 'Cash'),
            processed_by: this.cleanString(processed_by || 'cashier_01')
        };
        SALES_LOGS.unshift(log);
        
        // ⭐ Save to MongoDB via API
        try {
            if (typeof API !== 'undefined') {
                await API.createSale(log);
                console.log('✅ Sale saved to MongoDB:', sale_id);
            }
        } catch (error) {
            console.error('❌ Failed to save sale to MongoDB:', error);
        }
        
        return log;
    },

    // --- Return Log Creator ---
    async createReturnLog({ return_id, original_sale_id, item_id, item_name, quantity_returned, reason, disposition, refund_amount, restocked, approved_by, customer_name, notes }) {
        const log = {
            timestamp: this.cleanDate(new Date()),
            return_id: this.cleanInt(return_id),
            original_sale_id: this.cleanInt(original_sale_id),
            item_id: this.cleanInt(item_id),
            item_name: this.cleanString(item_name),
            quantity_returned: this.cleanInt(quantity_returned),
            reason: this.cleanString(reason),
            disposition: this.cleanString(disposition),
            refund_amount: this.cleanNumber(refund_amount),
            restocked: Boolean(restocked),
            approved_by: this.cleanString(approved_by || 'manager_01'),
            customer_name: this.cleanString(customer_name),
            notes: this.cleanString(notes)
        };
        RETURN_LOGS.unshift(log);
        
        // ⭐ Save to MongoDB via API
        try {
            if (typeof API !== 'undefined') {
                await API.createReturn(log);
                console.log('✅ Return saved to MongoDB');
            }
        } catch (error) {
            console.error('❌ Failed to save return to MongoDB:', error);
        }
        
        return log;
    },

    // --- System Activity Log Creator (Unified Feed) ---
    createSystemActivityLog({ event_type, user, ip_address, details, severity }) {
        const log = {
            _id: this.objectId('syslog'),
            timestamp: this.cleanDate(new Date()),
            event_type: this.cleanString(event_type),
            user: this.cleanString(user || 'system'),
            ip_address: this.cleanString(ip_address || '192.168.1.' + Math.floor(Math.random() * 254 + 1)),
            details: this.cleanString(details),
            severity: this.cleanString(severity || 'info')
        };
        SYSTEM_ACTIVITY_LOGS.unshift(log);
        return log;
    },

    // --- Unified Activity Feed Creator ---
    // Logs to the consolidated SYSTEM_ACTIVITY_FEED used by all modules
    async createActivityLog({ user_id = 1, username = 'staff', role = 'Staff', action = 'ACTION', reference_id = 0, details = '' }) {
        const activity = {
            user_id: this.cleanInt(user_id),
            username: this.cleanString(username),
            role: this.cleanString(role),
            action: this.cleanString(action),
            reference_id: this.cleanInt(reference_id),
            created_at: this.cleanDate(new Date()),
            details: this.cleanString(details)
        };
        SYSTEM_ACTIVITY_FEED.unshift(activity);
        
        // ⭐ Save to MongoDB via API
        try {
            if (typeof API !== 'undefined') {
                await API.logActivity(activity);
                console.log('✅ Activity logged to MongoDB');
            }
        } catch (error) {
            console.error('❌ Failed to log activity to MongoDB:', error);
        }
        
        return activity;
    }
};

// ========== UNIFIED LOG ACCESSOR & DISPATCHER ==========

function showLogDetail(type, id) {
    switch(type) {
        case 'inventory':
            LogRenderers.showInventoryLogDetail(id);
            break;
        case 'sales':
            LogRenderers.showSalesLogDetail(id);
            break;
        case 'return':
            LogRenderers.showReturnLogDetail(id);
            break;
        case 'activity':
            LogRenderers.showActivityLogDetail(id);
            break;
        default:
            console.warn('Unknown log type:', type);
    }
}

// ========== LOG RENDERING HELPERS ==========

const LogRenderers = {
    // --- Inventory Movement Logs (for Inventory View) ---
    renderInventoryLogs() {
        const body = document.getElementById('inventoryLogsBody');
        if (!body) return;
        // INVENTORY_LOGS already newest-first due to unshift()
        const sorted = INVENTORY_LOGS;
        if (sorted.length === 0) {
            body.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:24px;">No inventory movements recorded</td></tr>';
            return;
        }
        body.innerHTML = sorted.map(log => {
            const isPositive = log.quantity_change > 0;
            const changeColor = isPositive ? 'var(--green)' : 'var(--red)';
            const changePrefix = isPositive ? '+' : '';
            const actionBadge = log.action === 'RESTOCK' ? 'badge-ok' : (log.action === 'SALE' ? 'badge-low' : 'badge-out');
            const ts = new Date(log.timestamp);
            
            // Build action description
            const changeText = `${changePrefix}${log.quantity_change}`;
            const actionDesc = `${log.action}: ${changeText} of ${log.item_name} (${log.previous_stock} → ${log.new_stock})`;
            
            return `
            <tr class="log-row clickable" onclick="showLogDetail('inventory', '${log._id}')">
                <td style="font-size:.78rem;color:var(--text-muted);">${ts.toLocaleDateString('en-PH')} ${ts.toLocaleTimeString('en-PH', {hour:'2-digit',minute:'2-digit'})}</td>
                <td><span class="badge ${actionBadge}">${log.action}</span></td>
                <td><strong>${log.item_name}</strong></td>
                <td style="color:${changeColor};font-weight:600;">${changePrefix}${log.quantity_change}</td>
                <td>${log.previous_stock}</td>
                <td>${log.new_stock}</td>
                <td style="font-size:.78rem;color:var(--text-secondary);">${actionDesc}</td>
                <td style="font-size:.78rem;color:var(--text-muted);">${log.performed_by}</td>
                <td>
                    <button class="btn-info-circle" onclick="event.stopPropagation();showLogDetail('inventory', '${log._id}')" title="Details">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');
    },

    // --- Return Logs (for Returns View) ---
    renderReturnLogs() {
        const body = document.getElementById('returnLogsBody');
        if (!body) return;
        const sorted = [...RETURN_LOGS].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (sorted.length === 0) {
            body.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:24px;">No return logs recorded</td></tr>';
            return;
        }
        body.innerHTML = sorted.map(log => {
            const dispositionColor = log.restocked ? 'var(--green)' : 'var(--red)';
            const ts = new Date(log.timestamp);
            
            // Build action description
            const actionDesc = `${log.quantity_returned}x ${log.item_name} returned - ${log.reason} (${log.disposition})`;
            
            return `
            <tr class="log-row clickable" onclick="showLogDetail('return', '${log._id}')">
                <td>${log.return_id}</td>
                <td>${log.original_sale_id}</td>
                <td><strong>${log.item_name}</strong></td>
                <td>${log.quantity_returned}</td>
                <td>${log.reason}</td>
                <td style="color:${dispositionColor};font-weight:600;">${log.disposition}</td>
                <td style="color:var(--red);">${peso(log.refund_amount)}</td>
                <td style="font-size:.78rem;color:var(--text-secondary);">${actionDesc}</td>
                <td style="font-size:.78rem;">${log.approved_by}</td>
                <td>
                    <button class="btn-info-circle" onclick="event.stopPropagation();showLogDetail('return', '${log._id}')" title="Details">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');
    },

    // --- Sales Logs (for Ledger View — View Details modal) ---
    renderSalesLogs() {
        const body = document.getElementById('salesLogsBody');
        if (!body) return;
        // SALES_LOGS already newest-first due to unshift()
        const sorted = SALES_LOGS;
        if (sorted.length === 0) {
            body.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:24px;">No sales logs recorded</td></tr>';
            return;
        }
        body.innerHTML = sorted.map(log => {
            const ts = new Date(log.timestamp);
            
            // Build action description
            const itemsList = log.items.map(i => `${i.quantity}x ${i.item_name}`).join(', ');
            const actionDesc = `Sale to ${log.customer.name} - ${itemsList} (${peso(log.total_amount)})`;
            
            return `
            <tr class="log-row clickable" onclick="showLogDetail('sales', '${log._id}')">
                <td>${log.sale_id}</td>
                <td style="font-size:.78rem;">${ts.toLocaleDateString('en-PH')} ${ts.toLocaleTimeString('en-PH', {hour:'2-digit',minute:'2-digit'})}</td>
                <td><strong>${log.customer.name}</strong></td>
                <td>${log.items.length}</td>
                <td>${peso(log.total_amount)}</td>
                <td style="color:var(--green);">${peso(log.total_profit)}</td>
                <td style="font-size:.78rem;color:var(--text-secondary);">${actionDesc}</td>
                <td style="font-size:.78rem;color:var(--text-muted);">${log.processed_by}</td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();showLogDetail('sales', '${log._id}')" style="font-size:.72rem;">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </td>
            </tr>`;
        }).join('');
    },

    // --- Unified System Activity Feed (Dashboard — last 10 from all modules) ---
    renderActivityFeed() {
        const container = document.getElementById('activityFeedBody');
        if (!container) return;
        
        const sorted = [...SYSTEM_ACTIVITY_FEED].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
        
        if (sorted.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">No recent activity</div>';
            return;
        }
        
        container.innerHTML = sorted.map(log => {
            const ts = new Date(log.created_at);
            
            // Action-based icon mapping
            const actionIcons = {
                'PROCESS_SALE': 'fa-cash-register',
                'RESTOCK_ITEM': 'fa-boxes-stacked',
                'INVENTORY_AUTO_UPDATE': 'fa-arrows-rotate',
                'PROCESS_RETURN': 'fa-rotate-left',
                'APPROVE_RETURN': 'fa-check-circle',
                'DELETE_PRODUCT': 'fa-trash-can',
                'UPDATE_INVENTORY': 'fa-sync',
                'USER_LOGIN': 'fa-right-to-bracket',
                'USER_LOGOUT': 'fa-right-from-bracket',
                'ADJUST_STOCK': 'fa-square-plus'
            };
            
            // Role-based color coding
            const roleColors = {
                'Administrator': 'var(--red)',
                'Manager': 'var(--orange)',
                'Cashier': 'var(--blue)',
                'Staff': 'var(--green)',
                'System': 'var(--text-muted)'
            };
            
            const icon = actionIcons[log.action] || 'fa-circle-check';
            const color = roleColors[log.role] || 'var(--text-secondary)';
            const roleDisplay = log.role || 'Unknown Role';
            
            return `
            <div class="activity-feed-item clickable" onclick="showActivityLogDetail('${log._id}')">
                <div class="activity-icon" style="color:${color};"><i class="fas ${icon}"></i></div>
                <div class="activity-body">
                    <div class="activity-title">${log.action} <span class="activity-user" style="font-size:.78rem;">— ${log.username} <span style="color:var(--text-muted);">(${roleDisplay})</span></span></div>
                    <div class="activity-detail">${log.details || 'Activity reference: ' + log.reference_id}</div>
                    <div class="activity-time">${ts.toLocaleDateString('en-PH')} ${ts.toLocaleTimeString('en-PH', {hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <div class="activity-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>`;
        }).join('');
    },

    // ======== Detail Modals ========

    showLogDetailModal(title, contentHTML) {
        document.getElementById('logDetailTitle').textContent = title;
        document.getElementById('logDetailContent').innerHTML = contentHTML;
        document.getElementById('logDetailModal').classList.add('show');
    },

    closeLogDetailModal() {
        document.getElementById('logDetailModal').classList.remove('show');
    },

    showInventoryLogDetail(logId) {
        const log = INVENTORY_LOGS.find(l => l._id === logId);
        if (!log) return;
        const ts = new Date(log.timestamp);
        const isPositive = log.quantity_change > 0;
        const changeColor = isPositive ? 'var(--green)' : 'var(--red)';
        const content = `
            <div class="receipt-line"><span>Log ID</span><span style="font-size:.75rem;">${log._id}</span></div>
            <div class="receipt-line"><span>Timestamp</span><span>${ts.toLocaleString('en-PH')}</span></div>
            <div class="receipt-line"><span>Action</span><span><span class="badge ${log.action === 'RESTOCK' ? 'badge-ok' : 'badge-low'}">${log.action}</span></span></div>
            <div class="receipt-line"><span>Item</span><span>${log.item_name}</span></div>
            <div class="receipt-line"><span>Qty Change</span><span style="color:${changeColor};font-weight:700;">${isPositive ? '+' : ''}${log.quantity_change}</span></div>
            <div class="receipt-line"><span>Stock Before</span><span>${log.previous_stock}</span></div>
            <div class="receipt-line"><span>Stock After</span><span>${log.new_stock}</span></div>
            <div class="detail-section">
                <div class="detail-title">Metadata</div>
                <div class="detail-row"><span class="detail-label">Performed By</span><span class="detail-value">${log.performed_by}</span></div>
                <div class="detail-row"><span class="detail-label">Reference</span><span class="detail-value">${log.reference || 'N/A'}</span></div>
                <div class="detail-row"><span class="detail-label">Notes</span><span class="detail-value">${log.notes || 'N/A'}</span></div>
            </div>
            <div class="detail-section">
                <div class="detail-title">Raw JSON</div>
                <pre class="json-preview">${JSON.stringify(log, null, 2)}</pre>
            </div>`;
        this.showLogDetailModal('Inventory Movement Detail', content);
    },

    showReturnLogDetail(logId) {
        const log = RETURN_LOGS.find(l => l._id === logId);
        if (!log) return;
        const ts = new Date(log.timestamp);
        const dispositionColor = log.restocked ? 'var(--green)' : 'var(--red)';
        const content = `
            <div class="receipt-line"><span>Log ID</span><span style="font-size:.75rem;">${log._id}</span></div>
            <div class="receipt-line"><span>Timestamp</span><span>${ts.toLocaleString('en-PH')}</span></div>
            <div class="receipt-line"><span>Return #</span><span>${log.return_id}</span></div>
            <div class="receipt-line"><span>Original Sale</span><span>#${log.original_sale_id}</span></div>
            <div class="receipt-line"><span>Item</span><span>${log.item_name}</span></div>
            <div class="receipt-line"><span>Qty Returned</span><span style="color:var(--red)">${log.quantity_returned}</span></div>
            <div class="receipt-line"><span>Reason</span><span>${log.reason}</span></div>
            <div class="receipt-line"><span>Disposition</span><span style="color:${dispositionColor};font-weight:600;">${log.disposition}</span></div>
            <div class="receipt-total" style="border-top-color:var(--red);"><span>Refund Amount</span><span style="color:var(--red);">${peso(log.refund_amount)}</span></div>
            <div class="detail-section">
                <div class="detail-title">Approval Info</div>
                <div class="detail-row"><span class="detail-label">Approved By</span><span class="detail-value">${log.approved_by}</span></div>
                <div class="detail-row"><span class="detail-label">Customer</span><span class="detail-value">${log.customer_name}</span></div>
                <div class="detail-row"><span class="detail-label">Notes</span><span class="detail-value">${log.notes || 'N/A'}</span></div>
            </div>
            <div class="detail-section">
                <div class="detail-title">Raw JSON</div>
                <pre class="json-preview">${JSON.stringify(log, null, 2)}</pre>
            </div>`;
        this.showLogDetailModal('Return Log Detail', content);
    },

    showSalesLogDetail(logId) {
        const log = SALES_LOGS.find(l => l._id === logId);
        if (!log) return;
        const ts = new Date(log.timestamp);
        let itemsHTML = log.items.map(i => `
            <div class="log-item-row">
                <span class="log-item-name">${i.item_name}</span>
                <span class="log-item-qty">x${i.quantity}</span>
                <span class="log-item-price">${peso(i.line_total)}</span>
                <span class="log-item-profit" style="color:var(--green);">+${peso(i.profit)}</span>
            </div>`).join('');
        const content = `
            <div class="receipt-line"><span>Log ID</span><span style="font-size:.75rem;">${log._id}</span></div>
            <div class="receipt-line"><span>Sale #</span><span>${log.sale_id}</span></div>
            <div class="receipt-line"><span>Timestamp</span><span>${ts.toLocaleString('en-PH')}</span></div>
            <div class="receipt-line"><span>Payment</span><span>${log.payment_method}</span></div>
            <div class="receipt-line"><span>Processed By</span><span>${log.processed_by}</span></div>
            <div class="detail-section">
                <div class="detail-title"><i class="fas fa-user" style="color:var(--accent);margin-right:4px;"></i> Customer</div>
                <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${log.customer.name}</span></div>
                <div class="detail-row"><span class="detail-label">ID</span><span class="detail-value">${log.customer.customer_id || 'Walk-in'}</span></div>
                <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${log.customer.phone}</span></div>
                <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${log.customer.email || 'N/A'}</span></div>
                <div class="detail-row"><span class="detail-label">City</span><span class="detail-value">${log.customer.city || 'N/A'}</span></div>
            </div>
            <div class="detail-section">
                <div class="detail-title"><i class="fas fa-box" style="color:var(--accent);margin-right:4px;"></i> Items (${log.items.length})</div>
                <div class="log-items-list">${itemsHTML}</div>
            </div>
            <div class="receipt-total"><span>Total</span><span>${peso(log.total_amount)}</span></div>
            <div class="receipt-line"><span>Total Profit</span><span style="color:var(--green);font-weight:700;">${peso(log.total_profit)}</span></div>
            <div class="detail-section">
                <div class="detail-title">Raw JSON</div>
                <pre class="json-preview">${JSON.stringify(log, null, 2)}</pre>
            </div>`;
        this.showLogDetailModal('Sales Log Detail — Nested Data', content);
    },

    showActivityLogDetail(logId) {
        const log = SYSTEM_ACTIVITY_FEED.find(l => l._id === logId);
        if (!log) return;
        const ts = new Date(log.created_at);
        const content = `
            <div class="receipt-line"><span>Log ID</span><span style="font-size:.75rem;">${log._id}</span></div>
            <div class="receipt-line"><span>Timestamp</span><span>${ts.toLocaleString('en-PH')}</span></div>
            <div class="receipt-line"><span>User ID</span><span>${log.user_id}</span></div>
            <div class="receipt-line"><span>Username</span><span><strong>${log.username}</strong></span></div>
            <div class="receipt-line"><span>Role</span><span class="badge badge-info">${log.role}</span></div>
            <div class="receipt-line"><span>Action</span><span><strong style="color:var(--accent);">${log.action}</strong></span></div>
            <div class="receipt-line"><span>Reference ID</span><span>${log.reference_id || 'N/A'}</span></div>
            <div class="detail-section">
                <div class="detail-title">Details</div>
                <div class="detail-row"><span class="detail-label">Activity Description</span><span class="detail-value">${log.details || 'No additional details'}</span></div>
            </div>
            <div class="detail-section">
                <div class="detail-title">Raw JSON</div>
                <pre class="json-preview">${JSON.stringify(log, null, 2)}</pre>
            </div>`;
        this.showLogDetailModal('System Activity Log Detail', content);
    }
};

// ===== Global Activity Log Handler =====
function showActivityLogDetail(logId) {
    LogRenderers.showActivityLogDetail(logId);
}

// ========== INITIALIZE ALL MODULES ON LOAD ==========

// Helper function to populate staff dropdowns
function populateStaffDropdowns() {
    // POS Cashier Dropdown
    const posCashierSelect = document.getElementById('posCashier');
    if (posCashierSelect) {
        posCashierSelect.innerHTML = '<option value="">-- Select Cashier --</option>';
        STAFF_USERS.filter(s => s.role === 'Cashier' || s.role === 'Manager').forEach(staff => {
            posCashierSelect.innerHTML += `<option value="${staff.username}">${staff.username} (${staff.role})</option>`;
        });
    }

    // Inventory Product Staff Dropdown
    const productStaffSelect = document.getElementById('productStaff');
    if (productStaffSelect) {
        productStaffSelect.innerHTML = '<option value="">-- Select Staff --</option>';
        STAFF_USERS.filter(s => s.role === 'Administrator' || s.role === 'Manager').forEach(staff => {
            productStaffSelect.innerHTML += `<option value="${staff.username}">${staff.username} (${staff.role})</option>`;
        });
    }

    // Stock Adjustment Staff Dropdown
    const stockStaffSelect = document.getElementById('stockStaff');
    if (stockStaffSelect) {
        stockStaffSelect.innerHTML = '<option value="">-- Select Staff --</option>';
        STAFF_USERS.filter(s => s.role === 'Administrator' || s.role === 'Manager').forEach(staff => {
            stockStaffSelect.innerHTML += `<option value="${staff.username}">${staff.username} (${staff.role})</option>`;
        });
    }

    // Returns Approver Dropdown
    const returnApproverSelect = document.getElementById('returnApprover');
    if (returnApproverSelect) {
        returnApproverSelect.innerHTML = '<option value="">-- Select Manager --</option>';
        STAFF_USERS.filter(s => s.role === 'Manager' || s.role === 'Administrator').forEach(staff => {
            returnApproverSelect.innerHTML += `<option value="${staff.username}">${staff.username} (${staff.role})</option>`;
        });
    }
}

// ============================================================
// Activity Log
// ============================================================
const ActivityLog = {
    init() {
        // Render the activity feed
        LogRenderers.renderActivityFeed();
        
        // Calculate activity statistics
        this.renderActivityStats();
    },
    
    renderActivityStats() {
        let salesCount = 0;
        let inventoryCount = 0;
        let returnsCount = 0;
        
        SYSTEM_ACTIVITY_FEED.forEach(activity => {
            if (activity.action === 'PROCESS_SALE') {
                salesCount++;
            } else if (activity.action === 'RESTOCK_ITEM' || activity.action === 'UPDATE_INVENTORY' || activity.action === 'ADJUST_STOCK' || activity.action === 'INVENTORY_AUTO_UPDATE') {
                inventoryCount++;
            } else if (activity.action === 'PROCESS_RETURN') {
                returnsCount++;
            }
        });
        
        const totalCount = SYSTEM_ACTIVITY_FEED.length;
        
        // Update DOM
        const salesEl = document.getElementById('activitySalesCount');
        const inventoryEl = document.getElementById('activityInventoryCount');
        const returnsEl = document.getElementById('activityReturnsCount');
        const totalEl = document.getElementById('activityTotalCount');
        
        if (salesEl) salesEl.textContent = salesCount;
        if (inventoryEl) inventoryEl.textContent = inventoryCount;
        if (returnsEl) returnsEl.textContent = returnsCount;
        if (totalEl) totalEl.textContent = totalCount;
    }
};

// Globalize for environment compatibility (e.g. GitHub Pages)
window.Inventory = Inventory;
window.POS = POS;
window.Ledger = Ledger;
window.Returns = Returns;
window.Dashboard = Dashboard;
window.ActivityLog = ActivityLog;
window.LogInterceptors = LogInterceptors;
window.LogRenderers = LogRenderers;
window.showLogDetail = showLogDetail;

document.addEventListener('DOMContentLoaded', () => {
    populateStaffDropdowns();
    Dashboard.init();
    POS.init();
    Inventory.init();
    Ledger.init();
    Returns.init();
    ActivityLog.init();
});