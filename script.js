/* ================================================
   TechZone Staff Portal — Core Application Logic
   ================================================
   Mock data sourced from TechZone MySQL DDL / DML.
   No database connection required — all data is
   simulated client-side for the frontend prototype.
   ================================================ */

// ========== MOCK DATA (from DDL / DML) ==========

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

const CUSTOMERS = [
    { id: 1, name: 'Juan Dela Cruz', phone: '0917-111-2222', email: 'juan.dc@gmail.com', address: 'Quezon City' },
    { id: 2, name: 'Maria Santos', phone: '0918-222-3333', email: 'maria.santos@yahoo.com', address: 'Makati City' },
    { id: 3, name: 'Jose Rizal', phone: '0919-333-4444', email: 'j.rizal@gmail.com', address: 'Manila' },
    { id: 4, name: 'Andres Bonifacio', phone: '0920-444-5555', email: 'a.boni@yahoo.com', address: 'Tondo, Manila' },
    { id: 5, name: 'Emilio Aguinaldo', phone: '0921-555-6666', email: 'e.agui@gmail.com', address: 'Cavite' },
];

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

    for (let i = 0; i < 5; i++) {
        SALES.push({ id: i + 1, date: saleDates[i], customerId: saleCustomers[i] });
    }

    const saleItemsRaw = [
        [1,1,1,8500],
        [2,2,1,18500],
        [3,3,2,1500],
        [4,4,1,995],
        [5,5,1,7500]
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
        this.renderKPIs();
        this.renderAlerts();
        this.renderProfit();
        this.renderTopProducts();
    },

    renderKPIs() {
        let revenue = 0, cost = 0;
        SALE_ITEMS.forEach(si => {
            const item = getItem(si.itemId);
            revenue += si.soldPrice * si.qty;
            cost += (item ? item.cost : 0) * si.qty;
        });
        const profit = revenue - cost;
        const alerts = ITEMS.filter(i => i.qty <= LOW_STOCK_THRESHOLD).length;

        document.getElementById('kpiRevenue').textContent = peso(revenue);
        document.getElementById('kpiProfit').textContent = peso(profit);
        document.getElementById('kpiTransactions').textContent = SALES.length;
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

        let filteredSaleIds = new Set();
        SALES.forEach(s => {
            if (filter === 'all') filteredSaleIds.add(s.id);
            else if (filter === 'today' && s.date === today) filteredSaleIds.add(s.id);
            else if (filter === 'week' && s.date >= weekAgo && s.date <= today) filteredSaleIds.add(s.id);
        });

        let revenue = 0, cost = 0, txns = filteredSaleIds.size;
        SALE_ITEMS.forEach(si => {
            if (!filteredSaleIds.has(si.saleId)) return;
            const item = getItem(si.itemId);
            revenue += si.soldPrice * si.qty;
            cost += (item ? item.cost : 0) * si.qty;
        });
        const profit = revenue - cost;
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
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        document.getElementById('topProductsBody').innerHTML = sorted.map(p => `
            <tr>
                <td>${p.item.name}</td>
                <td>${p.units}</td>
                <td>${peso(p.revenue)}</td>
                <td style="color: var(--green)">${peso(p.profit)}</td>
            </tr>`).join('');
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
            document.getElementById('customerAddress').value = customer.address || '';
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

    processSale() {
        if (this.cart.length === 0) {
            showToast('Please add items to cart', 'warning');
            return;
        }

        // Get customer data from form
        const customerName = document.getElementById('customerName').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const customerEmail = document.getElementById('customerEmail').value.trim();
        const customerAddress = document.getElementById('customerAddress').value.trim();

        // Validate required fields
        if (!customerName) {
            showToast('Please enter customer name', 'warning');
            return;
        }
        if (!customerPhone) {
            showToast('Please enter customer phone', 'warning');
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
                address: customerAddress
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
        const saleId = SALES.length + 1;
        const saleDate = new Date().toISOString().slice(0, 10);
        SALES.push({ id: saleId, date: saleDate, customerId: 0, customerData: { name: customerName, phone: customerPhone, email: customerEmail, address: customerAddress } });

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

        // Reset
        this.cart = [];
        this.renderCart();
        this.renderProducts();
        // Clear customer form and search
        document.getElementById('customerSearch').value = '';
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('customerSearchResults').style.display = 'none';

        // Refresh dashboard data
        Dashboard.init();
        Ledger.init();
        Returns.init();

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

    saveProduct() {
        const editId = document.getElementById('editProductId').value;
        const name = document.getElementById('productName').value.trim();
        const typeId = Number(document.getElementById('productType').value);
        const supplierId = Number(document.getElementById('productSupplier').value);
        const qty = Number(document.getElementById('productQty').value);
        const price = Number(document.getElementById('productPrice').value);
        const cost = Number(document.getElementById('productCost').value);

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

        if (editId) {
            // Edit existing product
            const item = getItem(Number(editId));
            if (item) {
                item.name = name;
                item.typeId = typeId;
                item.supplierId = supplierId;
                item.qty = qty;
                item.price = price;
                item.cost = cost;
                showToast(`Product "${name}" updated successfully`, 'success');
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
        }

        this.cancelEdit();
        this.render();
        POS.init(); // Refresh POS to show new/updated product
        Dashboard.init(); // Refresh dashboard
    },

    editProduct(itemId) {
        const item = getItem(itemId);
        if (!item) return;

        document.getElementById('editProductId').value = itemId;
        document.getElementById('productName').value = item.name;
        document.getElementById('productType').value = item.typeId;
        document.getElementById('productSupplier').value = item.supplierId;
        document.getElementById('productQty').value = item.qty;
        document.getElementById('productPrice').value = item.price;
        document.getElementById('productCost').value = item.cost;

        document.getElementById('productFormTitle').textContent = 'Edit Product';
        document.getElementById('productSaveBtn').textContent = 'Update Product';
        document.getElementById('productCancelBtn').style.display = 'inline-flex';

        // Scroll to form
        document.querySelector('#view-inventory .card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    cancelEdit() {
        document.getElementById('editProductId').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productType').value = '';
        document.getElementById('productSupplier').value = '';
        document.getElementById('productQty').value = '0';
        document.getElementById('productPrice').value = '';
        document.getElementById('productCost').value = '';

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

    addStock() {
        const productId = Number(document.getElementById('addStockProductId').value);
        const qtyToAdd = Number(document.getElementById('addStockQty').value);

        if (!productId) {
            showToast('Please select a product from the list', 'warning');
            return;
        }

        if (qtyToAdd <= 0) {
            showToast('Quantity must be greater than 0', 'warning');
            return;
        }

        const item = getItem(productId);
        if (!item) {
            showToast('Product not found', 'error');
            return;
        }

        const oldQty = item.qty;
        item.qty += qtyToAdd;

        // Reset form
        document.getElementById('addStockSearch').value = '';
        document.getElementById('addStockProductId').value = '';
        document.getElementById('currentStock').value = '';
        document.getElementById('addStockQty').value = 1;

        // Refresh displays
        this.render();
        Dashboard.init(); // Refresh alerts
        POS.renderProducts(); // Refresh POS tiles

        showToast(`Added ${qtyToAdd} units to ${item.name}. Stock updated: ${oldQty} → ${item.qty}`, 'success');
    },

    render() {
        const body = document.getElementById('inventoryBody');
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
            
            let customer = { name: 'Walk-in Customer', phone: 'N/A', email: 'N/A', address: 'N/A' };
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
                    <div class="detail-row"><span class="detail-label">Address</span><span class="detail-value">${customer.address || 'N/A'}</span></div>
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
            let customer = { name: 'Walk-in Customer', phone: 'N/A', email: 'N/A', address: 'N/A' };
            
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
                    <div class="detail-row"><span class="detail-label">Address</span><span class="detail-value">${customer.address || 'N/A'}</span></div>
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
        const submitBtn = document.getElementById('submitReturnBtn');

        itemSelect.innerHTML = '<option value="">-- Select Item --</option>';

        if (!saleId) {
            itemSelect.disabled = true;
            qtyInput.disabled = true;
            reasonSelect.disabled = true;
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
        submitBtn.disabled = false;
    },

    submit() {
        const saleId = Number(document.getElementById('returnSaleId').value);
        const saleItemId = Number(document.getElementById('returnItem').value);
        const qty = Number(document.getElementById('returnQty').value);
        const reason = document.getElementById('returnReason').value;

        if (!saleId || !saleItemId || qty < 1) {
            showToast('Please fill in all return fields', 'warning');
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

        const restockMsg = restocked ? 'restocked' : 'sent to defective bin';
        showToast(`Return processed — ${qty} x ${item ? item.name : 'item'} ${restockMsg}`, 'success');

        // Reset form
        document.getElementById('returnSaleId').value = '';
        document.getElementById('returnItem').innerHTML = '<option value="">-- Select Item --</option>';
        document.getElementById('returnItem').disabled = true;
        document.getElementById('returnQty').value = 1;
        document.getElementById('returnQty').disabled = true;
        document.getElementById('returnReason').disabled = true;
        document.getElementById('submitReturnBtn').disabled = true;

        this.renderHistory();
        Dashboard.init();
        Ledger.init();
        Inventory.render();
        POS.renderProducts();
    },

    renderHistory() {
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

// ========== INITIALIZE ALL MODULES ON LOAD ==========

document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
    POS.init();
    Inventory.init();
    Ledger.init();
    Returns.init();
});