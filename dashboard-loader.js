// ============================================
// DASHBOARD LOADER - MATCHES YOUR EXACT HTML
// ============================================

async function loadRealDashboardData() {
    console.log('📊 Loading dashboard data from MongoDB...');
    
    try {
        // Load sales from MongoDB
        const salesResponse = await API.getAllSales(1, 10000);
        
        if (!salesResponse.success || !salesResponse.data || salesResponse.data.length === 0) {
            console.warn('⚠️ No sales data found in MongoDB');
            return;
        }
        
        const sales = salesResponse.data;
        console.log(`✅ Processing ${sales.length} sales for dashboard...`);
        
        // ===== UPDATE KPI CARDS =====
        updateKPICards(sales);
        
        // ===== UPDATE DAILY SALES TABLE =====
        updateDailySalesTable(sales);
        
        // ===== UPDATE TOP PRODUCTS =====
        updateTopProducts(sales);
        
        // ===== UPDATE CITY ANALYTICS =====
        updateCityAnalytics(sales);
        
        // ===== UPDATE TOP CUSTOMERS =====
        updateTopCustomers(sales);
        
        console.log('✅ Dashboard loaded with real data from MongoDB');
        console.log(`   Total Sales: ₱${sales.reduce((sum, s) => sum + (s.total_amount || 0), 0).toFixed(2)}`);
        console.log(`   Total Profit: ₱${sales.reduce((sum, s) => sum + (s.total_profit || 0), 0).toFixed(2)}`);
        console.log(`   Transactions: ${sales.length}`);
        
    } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
    }
}

function updateKPICards(sales) {
    // Calculate totals
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const totalProfit = sales.reduce((sum, sale) => sum + (sale.total_profit || 0), 0);
    const transactionCount = sales.length;
    
    // Update KPI values
    document.getElementById('kpiRevenue').textContent = `₱${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    document.getElementById('kpiProfit').textContent = `₱${totalProfit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    document.getElementById('kpiTransactions').textContent = transactionCount;
    
    console.log('✅ KPI cards updated');
}

function updateDailySalesTable(sales) {
    // Group sales by date
    const dailySales = {};
    
    sales.forEach(sale => {
        const saleDate = sale.timestamp ? new Date(sale.timestamp).toISOString().split('T')[0] : 'Unknown';
        
        if (!dailySales[saleDate]) {
            dailySales[saleDate] = {
                date: saleDate,
                sales: 0,
                profit: 0,
                transactions: 0,
                itemsSold: 0
            };
        }
        
        dailySales[saleDate].sales += sale.total_amount || 0;
        dailySales[saleDate].profit += sale.total_profit || 0;
        dailySales[saleDate].transactions += 1;
        
        if (sale.items && Array.isArray(sale.items)) {
            dailySales[saleDate].itemsSold += sale.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
    });
    
    // Convert to array and sort by date (newest first)
    const dailyArray = Object.values(dailySales).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update table
    const tbody = document.getElementById('dailySalesBody');
    if (tbody) {
        if (dailyArray.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No data available</td></tr>';
        } else {
            tbody.innerHTML = dailyArray.map(day => {
                const avgTransaction = day.transactions > 0 ? day.sales / day.transactions : 0;
                return `
                    <tr>
                        <td>${formatDate(day.date)}</td>
                        <td>₱${day.sales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                        <td>₱${day.profit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                        <td>${day.transactions}</td>
                        <td>${day.itemsSold}</td>
                        <td>₱${avgTransaction.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    </tr>
                `;
            }).join('');
        }
        console.log('✅ Daily sales table updated');
    }
}

function updateTopProducts(sales) {
    // Aggregate product sales
    const productStats = {};
    
    sales.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
                const itemName = item.item_name || 'Unknown';
                
                if (!productStats[itemName]) {
                    productStats[itemName] = {
                        name: itemName,
                        qtySold: 0,
                        revenue: 0,
                        profit: 0
                    };
                }
                
                productStats[itemName].qtySold += item.quantity || 0;
                productStats[itemName].revenue += item.line_total || 0;
                productStats[itemName].profit += item.profit || 0;
            });
        }
    });
    
    // Convert to array and sort by quantity sold
    const topProducts = Object.values(productStats)
        .sort((a, b) => b.qtySold - a.qtySold)
        .slice(0, 10);
    
    // Update chart div (simple text list for now)
    const chartDiv = document.getElementById('topProductsChart');
    if (chartDiv) {
        if (topProducts.length === 0) {
            chartDiv.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No product sales data available</p>';
        } else {
            chartDiv.innerHTML = topProducts.map((product, index) => `
                <div style="padding:8px;border-bottom:1px solid var(--border-color);">
                    <strong>#${index + 1} ${product.name}</strong><br>
                    <small>Sold: ${product.qtySold} units | Revenue: ₱${product.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })} | Profit: ₱${product.profit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</small>
                </div>
            `).join('');
        }
        console.log('✅ Top products updated');
    }
    
    // Update item performance table if it exists
    const itemPerfBody = document.getElementById('itemPerformanceBody');
    if (itemPerfBody) {
        if (topProducts.length === 0) {
            itemPerfBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);">No data available</td></tr>';
        } else {
            itemPerfBody.innerHTML = topProducts.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>-</td>
                    <td>${product.qtySold}</td>
                    <td>₱${product.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td>₱${product.profit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span class="badge badge-ok">Good</span></td>
                </tr>
            `).join('');
        }
    }
}

function updateCityAnalytics(sales) {
    // Aggregate by city
    const cityStats = {};
    
    sales.forEach(sale => {
        if (sale.customer && sale.customer.city) {
            const city = sale.customer.city;
            
            if (!cityStats[city]) {
                cityStats[city] = {
                    city: city,
                    customers: new Set(),
                    totalSales: 0,
                    transactions: 0,
                    itemsSold: 0,
                    profit: 0
                };
            }
            
            cityStats[city].customers.add(sale.customer.phone || sale.customer.name);
            cityStats[city].totalSales += sale.total_amount || 0;
            cityStats[city].transactions += 1;
            cityStats[city].profit += sale.total_profit || 0;
            
            if (sale.items && Array.isArray(sale.items)) {
                cityStats[city].itemsSold += sale.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            }
        }
    });
    
    // Convert to array
    const cityArray = Object.values(cityStats).map(c => ({
        ...c,
        customers: c.customers.size
    })).sort((a, b) => b.totalSales - a.totalSales);
    
    // Update table
    const tbody = document.getElementById('cityAnalyticsBody');
    if (tbody) {
        if (cityArray.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No city data available</td></tr>';
        } else {
            tbody.innerHTML = cityArray.map(city => `
                <tr>
                    <td>${city.city}</td>
                    <td>${city.customers}</td>
                    <td>₱${city.totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td>${city.transactions}</td>
                    <td>${city.itemsSold}</td>
                    <td>₱${city.profit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td>-</td>
                </tr>
            `).join('');
        }
        console.log('✅ City analytics table updated');
    }
}

function updateTopCustomers(sales) {
    // Aggregate by customer
    const customerStats = {};
    
    sales.forEach(sale => {
        if (sale.customer && sale.customer.name) {
            const custKey = sale.customer.phone || sale.customer.name;
            
            if (!customerStats[custKey]) {
                customerStats[custKey] = {
                    name: sale.customer.name,
                    phone: sale.customer.phone,
                    totalSpent: 0,
                    orders: 0
                };
            }
            
            customerStats[custKey].totalSpent += sale.total_amount || 0;
            customerStats[custKey].orders += 1;
        }
    });
    
    // Convert to array and sort by spending
    const topCustomers = Object.values(customerStats)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);
    
    // Update chart div
    const chartDiv = document.getElementById('topCustomersChart');
    if (chartDiv) {
        if (topCustomers.length === 0) {
            chartDiv.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No customer data available</p>';
        } else {
            chartDiv.innerHTML = topCustomers.map((customer, index) => `
                <div style="padding:8px;border-bottom:1px solid var(--border-color);">
                    <strong>#${index + 1} ${customer.name}</strong> ${customer.phone ? `(${customer.phone})` : ''}<br>
                    <small>Orders: ${customer.orders} | Total Spent: ₱${customer.totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</small>
                </div>
            `).join('');
        }
        console.log('✅ Top customers updated');
    }
}

function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

// Load dashboard data when page loads
window.addEventListener('DOMContentLoaded', async () => {
    setTimeout(async () => {
        await loadRealDashboardData();
    }, 2000); // Wait 2 seconds for sales to load first
});

// Reload when switching to dashboard tab
document.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (navItem && navItem.dataset.view === 'dashboard') {
        setTimeout(() => loadRealDashboardData(), 200);
    }
});

console.log('📊 Dashboard loader initialized (FIXED for your HTML structure)');