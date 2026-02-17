// ============================================
// TECHZONE API CLIENT
// ============================================
// Add this at the TOP of your script.js file
// This connects your frontend to the backend API

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

    // === SALES API ===
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

    // === INVENTORY API ===
    async logInventoryAction(logData) {
        return await this.request('/inventory-logs', {
            method: 'POST',
            body: JSON.stringify(logData)
        });
    },

    async getInventoryHistory(itemId) {
        return await this.request(`/inventory-logs/${itemId}`);
    },

    // === RETURNS API ===
    async createReturn(returnData) {
        return await this.request('/returns', {
            method: 'POST',
            body: JSON.stringify(returnData)
        });
    },

    async getAllReturns() {
        return await this.request('/returns');
    },

    // === ANALYTICS API ===
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

    // === ACTIVITY LOG API ===
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
        
        if (health.databases.mongodb === 'Connected') {
            console.log('✅ MongoDB Ready - Real data mode enabled!');
            showNotification('Connected to database - Real data mode active', 'success');
        }
    } catch (error) {
        console.warn('⚠️ API not available - Using mock data mode');
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
