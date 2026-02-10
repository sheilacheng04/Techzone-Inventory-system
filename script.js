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
    { id: 4, name: 'Andres Bonifacio', phone: '0920-444-5555', email: 'andres.b@outlook.com', address: 'Tondo' },
    { id: 5, name: 'Gabriela Silang', phone: '0921-555-6666', email: 'g.silang@gmail.com', address: 'Ilocos' },
    { id: 6, name: 'Emilio Aguinaldo', phone: '0922-666-7777', email: 'emilio.a@yahoo.com', address: 'Cavite' },
    { id: 7, name: 'Apolinario Mabini', phone: '0923-777-8888', email: 'poly.mabini@gmail.com', address: 'Batangas' },
    { id: 8, name: 'Melchora Aquino', phone: '0924-888-9999', email: 'tandang.sora@gmail.com', address: 'Quezon City' },
    { id: 9, name: 'Antonio Luna', phone: '0925-999-0000', email: 'gen.luna@hotmail.com', address: 'Manila' },
    { id: 10, name: 'Gregorio Del Pilar', phone: '0926-000-1111', email: 'goyo.dp@gmail.com', address: 'Bulacan' },
    { id: 11, name: 'Lapu Lapu', phone: '0927-111-2222', email: 'lapu.cebu@yahoo.com', address: 'Cebu' },
    { id: 12, name: 'Francisco Balagtas', phone: '0928-222-3333', email: 'kiko.b@gmail.com', address: 'Bulacan' },
    { id: 13, name: 'Grace Poe', phone: '0929-333-4444', email: 'grace.p@senate.gov', address: 'Manila' },
    { id: 14, name: 'Manny Pacquiao', phone: '0930-444-5555', email: 'pacman@gym.com', address: 'GenSan' },
    { id: 15, name: 'Catriona Gray', phone: '0931-555-6666', email: 'cat.gray@universe.com', address: 'Albay' },
    { id: 16, name: 'Pia Wurtzbach', phone: '0932-666-7777', email: 'pia.w@universe.com', address: 'CDO' },
    { id: 17, name: 'Lea Salonga', phone: '0933-777-8888', email: 'lea.s@broadway.com', address: 'Manila' },
    { id: 18, name: 'Arnel Pineda', phone: '0934-888-9999', email: 'arnel.journey@gmail.com', address: 'Manila' },
    { id: 19, name: 'Regine Velasquez', phone: '0935-999-0000', email: 'regine.v@gma.com', address: 'Bulacan' },
    { id: 20, name: 'Sarah Geronimo', phone: '0936-000-1111', email: 'sarah.g@pop.com', address: 'Manila' },
    { id: 21, name: 'Vice Ganda', phone: '0937-111-2222', email: 'vice.g@showtime.com', address: 'Manila' },
    { id: 22, name: 'Coco Martin', phone: '0938-222-3333', email: 'coco.m@angprob.com', address: 'Quezon City' },
    { id: 23, name: 'Kathryn Bernardo', phone: '0939-333-4444', email: 'kath.b@abs.com', address: 'Nueva Ecija' },
    { id: 24, name: 'Daniel Padilla', phone: '0940-444-5555', email: 'dj.padilla@abs.com', address: 'Manila' },
    { id: 25, name: 'Liza Soberano', phone: '0941-555-6666', email: 'liza.s@care.com', address: 'Manila' },
    { id: 26, name: 'Enrique Gil', phone: '0942-666-7777', email: 'quen.gil@abs.com', address: 'Cebu' },
    { id: 27, name: 'Joshua Garcia', phone: '0943-777-8888', email: 'josh.g@gmail.com', address: 'Batangas' },
    { id: 28, name: 'Julia Barretto', phone: '0944-888-9999', email: 'julia.b@gmail.com', address: 'Marikina' },
    { id: 29, name: 'Alden Richards', phone: '0945-999-0000', email: 'alden.r@gma.com', address: 'Laguna' },
    { id: 30, name: 'Maine Mendoza', phone: '0946-000-1111', email: 'yaya.dub@gmail.com', address: 'Bulacan' },
];

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
    const saleCustomers = [
        1,2,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,1,
        2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,1,2,
        3,4,5,6,7,8,9,10,11,12
    ];

    for (let i = 0; i < 100; i++) {
        SALES.push({ id: i + 1, date: saleDates[i], customerId: saleCustomers[i] });
    }

    const saleItemsRaw = [
        [1,1,1,8500],[2,2,1,18500],[3,3,2,1500],[4,4,1,995],[5,1,10,8200],
        [6,5,1,7500],[7,2,1,18500],[8,6,1,2500],[9,7,1,3500],[10,8,1,12000],
        [11,9,1,6500],[12,10,1,38000],[13,11,1,3000],[14,12,1,1200],[15,13,5,8000],
        [16,14,1,500],[17,1,1,8500],[18,15,1,2500],[19,16,1,1500],[20,5,2,7500],
        [21,17,1,18000],[22,1,1,8500],[23,4,1,995],[24,6,1,2500],[25,7,1,3500],
        [26,10,1,38000],[27,13,1,8000],[28,12,1,1200],[29,8,1,12000],[30,14,2,500],
        [31,11,1,3000],[32,9,1,6500],[33,3,4,1500],[34,17,1,18000],[35,5,1,7500],
        [36,16,1,1500],[37,15,1,2500],[38,1,1,8500],[39,2,2,18500],[40,4,1,995],
        [41,6,1,2500],[42,13,1,8000],[43,7,1,3500],[44,10,1,38000],[45,9,1,6500],
        [46,12,1,1200],[47,14,1,500],[48,8,1,12000],[49,11,1,3000],[50,3,2,1500],
        [51,17,1,18000],[52,5,1,7500],[53,16,1,1500],[54,15,1,2500],[55,1,1,8500],
        [56,2,1,18500],[57,4,1,995],[58,6,1,2500],[59,13,1,8000],[60,7,2,3500],
        [61,10,1,38000],[62,9,1,6500],[63,12,1,1200],[64,14,1,500],[65,8,1,12000],
        [66,11,1,3000],[67,3,2,1500],[68,17,1,18000],[69,5,1,7500],[70,16,1,1500],
        [71,15,1,2500],[72,1,1,8500],[73,2,5,18500],[74,4,1,995],[75,6,1,2500],
        [76,13,1,8000],[77,7,1,3500],[78,10,1,38000],[79,9,1,6500],[80,12,1,1200],
        [81,14,1,500],[82,8,1,12000],[83,11,1,3000],[84,3,2,1500],[85,17,1,18000],
        [86,5,1,7500],[87,16,1,1500],[88,15,1,2500],[89,1,1,8500],[90,2,1,18500],
        [91,4,1,995],[92,6,1,2500],[93,13,1,8000],[94,7,1,3500],[95,10,1,38000],
        [96,9,1,6500],[97,12,1,1200],[98,14,1,500],[99,8,1,12000],[100,11,1,3000]
    ];
    saleItemsRaw.forEach((r, i) => {
        SALE_ITEMS.push({ id: i + 1, saleId: r[0], itemId: r[1], qty: r[2], soldPrice: r[3] });
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
        const select = document.getElementById('cartCustomer');
        CUSTOMERS.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });
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
        if (this.cart.length === 0) return;

        const customerId = document.getElementById('cartCustomer').value;
        if (!customerId) {
            showToast('Please select a customer', 'warning');
            return;
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
        SALES.push({ id: saleId, date: saleDate, customerId: Number(customerId) });

        // Process each item atomically
        let receiptHTML = '';
        let total = 0;
        this.cart.forEach(entry => {
            const item = getItem(entry.itemId);
            const lineTotal = entry.price * entry.qty;
            total += lineTotal;

            // Deduct inventory (simulates trigger trg_reduce_stock_after_sale)
            item.qty -= entry.qty;

            // Record sale item
            SALE_ITEMS.push({
                id: SALE_ITEMS.length + 1,
                saleId,
                itemId: entry.itemId,
                qty: entry.qty,
                soldPrice: entry.price
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

        // Refresh dashboard data
        Dashboard.init();

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
        this.render();
    },

    render() {
        const body = document.getElementById('inventoryBody');
        body.innerHTML = ITEMS.map(item => {
            const type = getType(item.typeId);
            const supplier = getSupplier(item.supplierId);
            const margin = item.price > 0 ? (((item.price - item.cost) / item.price) * 100).toFixed(1) : '0.0';

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
                    <td><span class="badge ${badgeClass}">${badge}</span></td>
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
                    <td><span class="badge ${badgeClass}">${badge}</span></td>
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
        // Join SALE_ITEMS with SALES and ITEMS
        const rows = SALE_ITEMS.map(si => {
            const sale = SALES.find(s => s.id === si.saleId);
            const item = getItem(si.itemId);
            const customer = sale ? getCustomer(sale.customerId) : null;
            const lineTotal = si.soldPrice * si.qty;
            const profit = (si.soldPrice - (item ? item.cost : 0)) * si.qty;
            return { si, sale, item, customer, lineTotal, profit };
        }).sort((a, b) => {
            if (a.sale && b.sale) return b.sale.date.localeCompare(a.sale.date) || b.si.saleId - a.si.saleId;
            return 0;
        });

        body.innerHTML = rows.map(r => `
            <tr>
                <td>${r.si.saleId}</td>
                <td>${r.sale ? r.sale.date : ''}</td>
                <td>${r.customer ? r.customer.name : 'N/A'}</td>
                <td>${r.item ? r.item.name : 'N/A'}</td>
                <td>${r.si.qty}</td>
                <td>${peso(r.si.soldPrice)}</td>
                <td>${peso(r.lineTotal)}</td>
                <td style="color: var(--green)">${peso(r.profit)}</td>
            </tr>`).join('');
    },

    filter() {
        const from = document.getElementById('ledgerDateFrom').value;
        const to = document.getElementById('ledgerDateTo').value;
        const body = document.getElementById('ledgerBody');

        const rows = SALE_ITEMS.map(si => {
            const sale = SALES.find(s => s.id === si.saleId);
            const item = getItem(si.itemId);
            const customer = sale ? getCustomer(sale.customerId) : null;
            const lineTotal = si.soldPrice * si.qty;
            const profit = (si.soldPrice - (item ? item.cost : 0)) * si.qty;
            return { si, sale, item, customer, lineTotal, profit };
        }).filter(r => {
            if (!r.sale) return false;
            if (from && r.sale.date < from) return false;
            if (to && r.sale.date > to) return false;
            return true;
        }).sort((a, b) => b.sale.date.localeCompare(a.sale.date) || b.si.saleId - a.si.saleId);

        body.innerHTML = rows.map(r => `
            <tr>
                <td>${r.si.saleId}</td>
                <td>${r.sale.date}</td>
                <td>${r.customer ? r.customer.name : 'N/A'}</td>
                <td>${r.item ? r.item.name : 'N/A'}</td>
                <td>${r.si.qty}</td>
                <td>${peso(r.si.soldPrice)}</td>
                <td>${peso(r.lineTotal)}</td>
                <td style="color: var(--green)">${peso(r.profit)}</td>
            </tr>`).join('');
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
        // Only show sales that have sale items
        const saleIds = [...new Set(SALE_ITEMS.map(si => si.saleId))].sort((a, b) => b - a);
        saleIds.forEach(sid => {
            const sale = SALES.find(s => s.id === sid);
            const customer = sale ? getCustomer(sale.customerId) : null;
            select.innerHTML += `<option value="${sid}">Sale #${sid} — ${customer ? customer.name : 'N/A'} (${sale ? sale.date : ''})</option>`;
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

        // Restock inventory (simulates trigger trg_restock_after_return)
        const item = getItem(saleItem.itemId);
        if (item) {
            item.qty += qty;
        }

        // Record return
        RETURNS.push({
            id: nextReturnId++,
            saleId,
            saleItemId,
            itemName: item ? item.name : 'Unknown',
            qty,
            reason,
            status: 'Approved'
        });

        showToast(`Return processed — ${qty} x ${item ? item.name : 'item'} restocked`, 'success');

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
        Inventory.render();
        POS.renderProducts();
    },

    renderHistory() {
        const body = document.getElementById('returnsBody');
        if (RETURNS.length === 0) {
            body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px;">No returns recorded yet</td></tr>';
            return;
        }
        body.innerHTML = RETURNS.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.saleId}</td>
                <td>${r.itemName}</td>
                <td>${r.qty}</td>
                <td>${r.reason}</td>
                <td><span class="badge badge-approved">${r.status}</span></td>
            </tr>`).join('');
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