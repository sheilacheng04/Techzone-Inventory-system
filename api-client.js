// ============================================
// TECHZONE API CLIENT
// ============================================
// Connects frontend to backend API
// Supports both MySQL (core data) and MongoDB (analytics/logs)

const API_URL = 'http://localhost:5000/api';

// ============================================
// API HELPER FUNCTIONS
// ============================================

const API = {
    // Generic fetch wrapper with error handling
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // ======================================================
    // MYSQL API — Core Business Data
    // ======================================================

    // === CATEGORIES ===
    async getCategories() { return await this.request('/mysql/categories'); },
    async getCategory(id) { return await this.request(`/mysql/categories/${id}`); },
    async createCategory(data) { return await this.request('/mysql/categories', { method: 'POST', body: JSON.stringify(data) }); },
    async updateCategory(id, data) { return await this.request(`/mysql/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async deleteCategory(id) { return await this.request(`/mysql/categories/${id}`, { method: 'DELETE' }); },

    // === SUPPLIERS ===
    async getSuppliers() { return await this.request('/mysql/suppliers'); },
    async getSupplier(id) { return await this.request(`/mysql/suppliers/${id}`); },
    async createSupplier(data) { return await this.request('/mysql/suppliers', { method: 'POST', body: JSON.stringify(data) }); },
    async updateSupplier(id, data) { return await this.request(`/mysql/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async deleteSupplier(id) { return await this.request(`/mysql/suppliers/${id}`, { method: 'DELETE' }); },

    // === STAFF ===
    async getStaff() { return await this.request('/mysql/staff'); },
    async getStaffMember(id) { return await this.request(`/mysql/staff/${id}`); },
    async createStaff(data) { return await this.request('/mysql/staff', { method: 'POST', body: JSON.stringify(data) }); },
    async updateStaff(id, data) { return await this.request(`/mysql/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async deleteStaff(id) { return await this.request(`/mysql/staff/${id}`, { method: 'DELETE' }); },

    // === CUSTOMERS ===
    async getCustomers() { return await this.request('/mysql/customers'); },
    async getCustomerById(id) { return await this.request(`/mysql/customers/${id}`); },
    async createCustomer(data) { return await this.request('/mysql/customers', { method: 'POST', body: JSON.stringify(data) }); },
    async updateCustomer(id, data) { return await this.request(`/mysql/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async deleteCustomer(id) { return await this.request(`/mysql/customers/${id}`, { method: 'DELETE' }); },

    // === PRODUCTS (MySQL — replaces MongoDB items) ===
    async getProducts() { return await this.request('/mysql/products'); },
    async getProduct(id) { return await this.request(`/mysql/products/${id}`); },
    async createProduct(data) { return await this.request('/mysql/products', { method: 'POST', body: JSON.stringify(data) }); },
    async updateProduct(id, data) { return await this.request(`/mysql/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async deleteProduct(id) { return await this.request(`/mysql/products/${id}`, { method: 'DELETE' }); },
    async updateProductStock(id, qty, action) { return await this.request(`/mysql/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ qty, action }) }); },
    async getLowStockProducts(threshold) { return await this.request(`/mysql/products/low-stock/${threshold || 10}`); },

    // === MYSQL SALES ===
    async createMySQLSale(data) { return await this.request('/mysql/sales', { method: 'POST', body: JSON.stringify(data) }); },
    async getMySQLSales() { return await this.request('/mysql/sales'); },
    async getMySQLSale(id) { return await this.request(`/mysql/sales/${id}`); },
    async getMySQLSaleItems(saleId) { return await this.request(`/mysql/sale-items/by-sale/${saleId}`); },
    async getAllMySQLSaleItems() { return await this.request('/mysql/sale-items'); },

    // === MYSQL RETURNS ===
    async createMySQLReturn(data) { return await this.request('/mysql/returns', { method: 'POST', body: JSON.stringify(data) }); },
    async getMySQLReturns() { return await this.request('/mysql/returns'); },

    // ======================================================
    // MONGODB API — Analytics & Logging
    // ======================================================

    // === SALES (MongoDB logs) ===
    async createSale(saleData) {
        return await this.request('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData)
        });
    },

    async getAllSales(page = 1, limit = 50) {
        return await this.request(`/sales?page=${page}&limit=${limit}`);
    },

    async getSalesByDateRange(startDate, endDate) {
        return await this.request(`/sales/range?startDate=${startDate}&endDate=${endDate}`);
    },

    // === INVENTORY (MongoDB logs) ===
    async logInventoryAction(logData) {
        return await this.request('/inventory-logs', {
            method: 'POST',
            body: JSON.stringify(logData)
        });
    },

    async getInventoryHistory(itemId) {
        return await this.request(`/inventory-logs/${itemId}`);
    },

    // === RETURNS (MongoDB logs) ===
    async createReturn(returnData) {
        return await this.request('/returns', {
            method: 'POST',
            body: JSON.stringify(returnData)
        });
    },

    async getAllReturns() {
        return await this.request('/returns');
    },

    // === ANALYTICS (MongoDB) ===
    async getDashboardKPIs() {
        return await this.request('/analytics/dashboard');
    },

    async getCustomerAnalytics() {
        return await this.request('/analytics/customers');
    },

    async updateCustomerAnalytics(phone, data) {
        return await this.request(`/analytics/customers/${phone}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // === ACTIVITY LOG (MongoDB) ===
    async logActivity(activityData) {
        return await this.request('/activity', {
            method: 'POST',
            body: JSON.stringify(activityData)
        });
    },

    async getActivityFeed(limit = 50) {
        return await this.request(`/activity?limit=${limit}`);
    },

    // === HEALTH CHECK ===
    async checkHealth() {
        return await this.request('/health');
    }
};

// ============================================
// INITIALIZE - VERIFY API CONNECTION
// ============================================

// Check API connection on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const health = await API.checkHealth();
        console.log('✅ API Connected:', health);
        
        const mongoOk = health.databases.mongodb === 'Connected';
        const mysqlOk = health.databases.mysql === 'Connected';
        
        if (mongoOk && mysqlOk) {
            console.log('✅ MongoDB + MySQL Ready - Full data mode enabled!');
            showNotification('Connected to MySQL + MongoDB — Real data mode active', 'success');
        } else if (mysqlOk) {
            console.log('✅ MySQL Ready, MongoDB offline');
            showNotification('MySQL connected — MongoDB offline', 'warning');
        } else {
            showNotification('Database connections incomplete — check server', 'warning');
        }
    } catch (error) {
        console.warn('⚠️ API not available - Using offline mode');
        console.warn('Make sure server is running: npm start');
        showNotification('Running in offline mode - Start server for real data', 'warning');
    }
});

// Simple notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

console.log('🔌 TechZone API Client loaded');
console.log('📡 API Endpoint:', API_URL);
