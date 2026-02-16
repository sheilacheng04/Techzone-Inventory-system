# TechZone MongoDB Schema Documentation

## Database: TechZoneMongo

### Collections Overview

```
TechZoneMongo/
├── Analytics/
│   ├── daily_sales_summary
│   ├── city_sales_analytics
│   ├── city_customer_distribution
│   ├── customer_analytics
│   ├── item_performance_analytics
│   ├── inventory_health_analytics
│   ├── financial_snapshots
│   └── supplier_analytics
└── Logs/
    ├── sales_logs
    ├── inventory_logs
    ├── return_logs
    └── system_activity_logs
```

---

## ANALYTICS COLLECTIONS

### 1. daily_sales_summary
**Purpose**: Aggregated daily sales metrics

```javascript
{
  _id: ObjectId(),
  date: "2025-02-16",                    // Date of sales
  total_sales: 145000.00,                // Total revenue for day
  total_profit: 45000.00,                // Total profit for day
  transactions_count: 12,                // Number of sales transactions
  total_items_sold: 35,                  // Total items sold
  average_transaction_value: 12083.33,   // Average per transaction
  created_at: ISODate("2025-02-16T09:00:00Z"),
  updated_at: ISODate("2025-02-16T18:00:00Z")
}
```

**Indexes**:
- `date` (ascending) - for daily lookups
- `created_at` (descending) - for time-based queries

---

### 2. city_sales_analytics
**Purpose**: Geographic sales performance

```javascript
{
  _id: ObjectId(),
  city: "Metro Manila",
  total_customers: 45,                   // Unique customers from city
  total_sales_amount: 560000.00,         // Total revenue from city
  total_transactions: 38,                // Number of transactions
  total_items_sold: 120,                 // Total items sold
  total_profit: 180000.00,               // Total profit from city
  most_purchased_item: {
    name: "Ryzen 5 5600",
    quantity: 15
  },
  penetration_rate: 0.25,                // Market penetration (0-1)
  customer_satisfaction: 4.5,            // Rating 1-5
  created_at: ISODate("2025-02-16T09:00:00Z"),
  updated_at: ISODate("2025-02-16T18:00:00Z")
}
```

**Indexes**:
- `city` (ascending) - unique index
- `total_sales_amount` (descending) - for top cities

---

### 3. city_customer_distribution
**Purpose**: Customer demographic analysis by location

```javascript
{
  _id: ObjectId(),
  city: "Cebu",
  total_customers: 32,
  customer_segments: {
    retail: 18,                          // Individual customers
    wholesale: 8,                        // Bulk buyers
    corporate: 6                         // Business accounts
  },
  average_purchase_value: 8500.00,
  repeat_customer_rate: 0.65,            // 65% repeat rate
  customer_lifetime_value: 125000.00,    // Average CLV
  churn_rate: 0.05,                      // 5% churn
  acquisition_cost: 1500.00,
  created_at: ISODate("2025-02-16T09:00:00Z"),
  updated_at: ISODate("2025-02-16T18:00:00Z")
}
```

---

### 4. customer_analytics
**Purpose**: Individual customer insights

```javascript
{
  _id: ObjectId(),
  name: "Juan Dela Cruz",
  city: "Davao",
  phone: "09123456789",
  email: "juan@example.com",
  total_orders: 8,                       // Total number of orders
  total_spent: 285000.00,                // Lifetime purchase value
  total_profit_generated: 95000.00,      // Profit from customer
  last_purchase_date: "2025-02-14",
  first_purchase_date: "2025-01-05",
  favorite_item_type: "Graphics Card",
  favorite_products: [
    { item_id: 2, item_name: "RTX 4060", purchases: 3 },
    { item_id: 10, item_name: "RTX 4070", purchases: 1 }
  ],
  average_order_value: 35625.00,
  purchase_frequency_days: 12,           // Days between orders
  customer_segment: "VIP",               // VIP, Regular, At-Risk
  loyalty_score: 850,                    // Points
  created_at: ISODate("2025-01-05T10:00:00Z"),
  updated_at: ISODate("2025-02-16T18:00:00Z")
}
```

**Indexes**:
- `phone` (ascending) - unique, for customer lookup
- `total_spent` (descending) - for VIP ranking
- `customer_segment` (ascending) - for segmentation
- `city` (ascending) - for geographic analysis

---

### 5. item_performance_analytics
**Purpose**: Product/SKU performance tracking

```javascript
{
  _id: ObjectId(),
  item_id: 2,
  name: "RTX 4060",
  type: "Graphics Card",
  supplier_id: 2,
  supplier_name: "Asus Ph",
  total_quantity_sold: 145,              // Units sold
  total_revenue: 2682500.00,             // Total sales value
  total_profit: 346000.00,               // Gross profit
  profit_margin: 0.129,                  // 12.9%
  return_rate: 0.02,                     // 2% returns
  damage_rate: 0.01,                     // 1% damage
  performance_rating: "Excellent",       // Excellent/Good/Fair/Poor
  inventory_turnover: 7.25,              // Times turned over
  days_in_inventory: 50,                 // Average days held
  current_stock: 20,
  reorder_point: 15,
  reorder_quantity: 50,
  cost_per_unit: 16000.00,
  selling_price: 18500.00,
  elasticity: -0.8,                      // Price elasticity
  created_at: ISODate("2025-01-10T09:00:00Z"),
  updated_at: ISODate("2025-02-16T18:00:00Z")
}
```

**Indexes**:
- `item_id` (ascending) - unique
- `total_revenue` (descending) - for top products
- `performance_rating` (ascending)

---

### 6. inventory_health_analytics
**Purpose**: Stock and supply chain health

```javascript
{
  _id: ObjectId(),
  analysis_date: "2025-02-16",
  total_items: 17,
  stock_status: {
    in_stock: 15,
    low_stock: 1,
    out_of_stock: 1
  },
  total_inventory_value: 1285500.00,     // Total stock value (cost)
  total_inventory_retail: 1945000.00,    // Total retail value
  average_inventory_age: 34,             // Days
  slow_moving_items: 3,                  // Items with low turnover
  dead_stock_value: 45000.00,            // Value of unsold items
  stockout_incidents: 2,                 // Times out of stock this month
  overstock_items: 1,
  inventory_accuracy: 0.98,              // 98% accurate counts
  carrying_cost_total: 12500.00,         // Monthly carrying costs
  created_at: ISODate("2025-02-16T09:00:00Z")
}
```

---

### 7. financial_snapshots
**Purpose**: Business health snapshots

```javascript
{
  _id: ObjectId(),
  snapshot_date: "2025-02-16",
  snapshot_period: "daily",              // daily/weekly/monthly
  gross_sales: 560000.00,                // Total revenue
  total_returns: 8500.00,                // Returns value
  damaged_stock_loss: 3200.00,           // Damage losses
  net_sales: 548300.00,                  // Net revenue
  cost_of_goods_sold: 380000.00,
  net_profit: 168300.00,
  profit_margin: 0.301,                  // 30.1%
  roi: 0.44,                             // 44% return
  top_city: "Metro Manila",
  top_item: "Ryzen 5 5600",
  top_customer: "Juan Dela Cruz",
  low_stock_count: 2,
  cash_position: 2500000.00,
  accounts_receivable: 150000.00,
  inventory_turnover_ratio: 6.5,
  current_ratio: 2.1,
  created_at: ISODate("2025-02-16T18:00:00Z")
}
```

**Indexes**:
- `snapshot_date` (descending) - for latest snapshot
- `snapshot_period` (ascending)

---

### 8. supplier_analytics
**Purpose**: Supplier performance tracking

```javascript
{
  _id: ObjectId(),
  supplier_id: 1,
  supplier_name: "AMD Phil",
  contact: "02-8888-1111",
  total_orders: 24,
  total_purchase_value: 850000.00,
  total_items_supplied: 450,
  average_order_value: 35416.67,
  on_time_delivery_rate: 0.95,           // 95% on-time
  quality_rating: 4.7,                   // 1-5 stars
  defect_rate: 0.02,                     // 2% defects
  lead_time_days: 14,
  payment_terms: "Net 30",
  reliability_score: 94,                 // Overall score
  products_supplied: 4,
  most_supplied_item: "Ryzen 5 5600",
  average_quantity_per_order: 18.75,
  created_at: ISODate("2025-01-10T09:00:00Z"),
  updated_at: ISODate("2025-02-16T18:00:00Z")
}
```

---

## LOG COLLECTIONS

### 1. sales_logs
**Purpose**: Complete sales transaction records

```javascript
{
  _id: ObjectId(),
  sale_id: 1,
  sale_date: "2025-02-16",
  customer: {
    customer_id: 0,
    name: "Juan Dela Cruz",
    phone: "09123456789",
    email: "juan@example.com",
    city: "Davao"
  },
  items: [
    {
      item_id: 1,
      item_name: "Ryzen 5 5600",
      quantity: 2,
      unit_price: 8500.00,
      line_total: 17000.00,
      cost: 6500.00,
      profit: 4000.00
    },
    {
      item_id: 2,
      item_name: "RTX 4060",
      quantity: 1,
      unit_price: 18500.00,
      line_total: 18500.00,
      cost: 16000.00,
      profit: 2500.00
    }
  ],
  total_amount: 35500.00,
  total_cost: 22500.00,
  total_profit: 6500.00,
  payment_method: "Cash",
  payment_status: "Paid",              // Paid/Pending/Failed
  processed_by: "cashier_01",
  location: "Main Branch",
  discount_applied: 0.00,
  tax_amount: 0.00,
  created_at: ISODate("2025-02-16T14:30:00Z"),
  updated_at: ISODate("2025-02-16T14:30:00Z")
}
```

**Indexes**:
- `sale_id` (ascending) - unique
- `sale_date` (descending) - for date range queries
- `customer.phone` (ascending) - for customer lookup
- `processed_by` (ascending) - by cashier
- `created_at` (descending) - chronological order

---

### 2. inventory_logs
**Purpose**: Stock movement tracking (FIFO/LIFO audit trail)

```javascript
{
  _id: ObjectId(),
  log_id: 1,
  action: "SALE",                        // SALE/RESTOCK/PRODUCT_ADDED/PRODUCT_UPDATED/DAMAGE/ADJUSTMENT
  item_id: 2,
  item_name: "RTX 4060",
  quantity_change: -5,                   // Negative for decrease, positive for increase
  previous_stock: 25,
  new_stock: 20,
  performed_by: "cashier_01",
  reference: "SALE-15",                  // Links to sales_logs or other transactions
  reference_type: "Sale",                // Sale/Restock/Damage/Adjustment
  notes: "Sold to Juan Dela Cruz",
  reason_code: "SOLD",                   // SOLD/RECEIVED/DAMAGED/LOST/RETURNED/COUNTED
  warehouse_location: "A-12-3",          // Bin location
  unit_cost: 16000.00,
  total_value_change: -80000.00,         // Cost basis impact
  created_at: ISODate("2025-02-16T14:30:00Z")
}
```

**Indexes**:
- `reference` (ascending) - unique per transaction
- `action` (ascending) - for activity filtering
- `item_id` (ascending) - for item history
- `created_at` (descending) - chronological
- `performed_by` (ascending) - staff accountability

---

### 3. return_logs
**Purpose**: Product returns and warranty claims

```javascript
{
  _id: ObjectId(),
  return_id: 1,
  return_date: "2025-02-14",
  original_sale_id: 5,
  customer: {
    name: "Maria Santos",
    phone: "09987654321",
    city: "Cebu"
  },
  items: [
    {
      item_id: 3,
      item_name: "8GB DDR4 RAM",
      quantity_returned: 2,
      original_price: 1500.00,
      return_reason: "Defective",        // Defective/Wrong Item/Changed Mind/Damaged
      condition: "Non-Functional",       // New/Like-New/Good/Fair/Poor
      refund_amount: 3000.00
    }
  ],
  total_return_value: 3000.00,
  refund_status: "Processed",            // Requested/Approved/Rejected/Processed
  refund_method: "Cash",                 // Cash/Credit Card/Bank Transfer
  restocked: true,
  processed_by: "manager_01",
  notes: "Customer confirmed defect on RAM chips",
  created_at: ISODate("2025-02-14T10:15:00Z"),
  updated_at: ISODate("2025-02-15T09:00:00Z")
}
```

**Indexes**:
- `return_id` (ascending) - unique
- `original_sale_id` (ascending) - links to sales
- `return_date` (descending)
- `refund_status` (ascending)
- `customer.phone` (ascending)

---

### 4. system_activity_logs
**Purpose**: Unified activity tracking across all modules

```javascript
{
  _id: ObjectId(),
  activity_id: 1,
  user_id: 2,
  username: "cashier_01",
  role: "Cashier",
  action: "PROCESS_SALE",                // PROCESS_SALE/ADD_PRODUCT/UPDATE_PRODUCT/RESTOCK/PROCESS_RETURN/INVENTORY_AUTO_UPDATE
  reference_id: 25,                      // Sale ID, Product ID, etc.
  reference_type: "Sale",                // Sale/Product/Inventory/Return
  details: "Processed sale #25 to Juan Dela Cruz - 2x Ryzen 5 5600, 1x RTX 4060 (₱35,500.00)",
  ip_address: "192.168.1.5",
  device_info: "Windows 10 Chrome",
  change_log: {
    field: "stock_quantity",
    old_value: 25,
    new_value: 20
  },
  status: "Success",                     // Success/Pending/Failed
  error_message: null,
  created_at: ISODate("2025-02-16T14:30:00Z"),
  timestamp: 1739709000000              // Unix timestamp
}
```

**Indexes**:
- `activity_id` (ascending) - unique
- `username` (ascending) - staff activity tracking
- `action` (ascending) - activity type filtering
- `reference_id` (ascending) - transaction lookup
- `created_at` (descending) - timeline queries
- `user_id` (ascending) - by user

---

## INDEXES SUMMARY

### Recommended Index Strategies

```javascript
// Analytics Indexes
db.daily_sales_summary.createIndex({ date: 1 });
db.city_sales_analytics.createIndex({ city: 1 }, { unique: true });
db.city_sales_analytics.createIndex({ total_sales_amount: -1 });
db.customer_analytics.createIndex({ phone: 1 }, { unique: true });
db.customer_analytics.createIndex({ total_spent: -1 });
db.customer_analytics.createIndex({ city: 1 });
db.item_performance_analytics.createIndex({ item_id: 1 }, { unique: true });
db.item_performance_analytics.createIndex({ total_revenue: -1 });
db.financial_snapshots.createIndex({ snapshot_date: -1 });
db.supplier_analytics.createIndex({ supplier_id: 1 }, { unique: true });

// Logs Indexes
db.sales_logs.createIndex({ sale_id: 1 }, { unique: true });
db.sales_logs.createIndex({ sale_date: -1 });
db.sales_logs.createIndex({ "customer.phone": 1 });
db.sales_logs.createIndex({ processed_by: 1 });

db.inventory_logs.createIndex({ reference: 1 });
db.inventory_logs.createIndex({ action: 1 });
db.inventory_logs.createIndex({ item_id: 1 });
db.inventory_logs.createIndex({ created_at: -1 });
db.inventory_logs.createIndex({ performed_by: 1 });

db.return_logs.createIndex({ return_id: 1 }, { unique: true });
db.return_logs.createIndex({ original_sale_id: 1 });
db.return_logs.createIndex({ "customer.phone": 1 });

db.system_activity_logs.createIndex({ activity_id: 1 }, { unique: true });
db.system_activity_logs.createIndex({ username: 1 });
db.system_activity_logs.createIndex({ action: 1 });
db.system_activity_logs.createIndex({ created_at: -1 });
db.system_activity_logs.createIndex({ user_id: 1 });
```

---

## Data Relationships

```
SALES (POS Transaction)
├── creates entries in sales_logs (one-to-one)
├── creates multiple inventory_logs (one-to-many)
├── updates customer_analytics (references customer)
├── updates item_performance_analytics (updates each item)
├── updates daily_sales_summary (updates date bucket)
┗── updates city_sales_analytics (references customer.city)

RESTOCK (Inventory)
├── creates inventory_logs (one-to-one)
├── updates item_performance_analytics
└── updates financial_snapshots

RETURN (Return Processing)
├── creates return_logs (one-to-one)
├── creates inventory_logs (one-to-one)
├── updates customer_analytics
└── updates item_performance_analytics

PRODUCT MANAGEMENT
├── creates inventory_logs for new products
└── updates item_performance_analytics

SYSTEM ACTIVITY
└── all actions above create system_activity_logs entries
```

---

## Sample Aggregation Queries

### Top Selling Cities (Last 30 Days)
```javascript
db.city_sales_analytics.find()
  .sort({ total_sales_amount: -1 })
  .limit(5)
```

### Customer Lifetime Value Analysis
```javascript
db.customer_analytics.aggregate([
  {
    $group: {
      _id: null,
      avg_clv: { $avg: "$total_spent" },
      total_customers: { $sum: 1 },
      total_revenue: { $sum: "$total_spent" }
    }
  }
])
```

### Product Performance by Category
```javascript
db.item_performance_analytics.aggregate([
  {
    $group: {
      _id: "$type",
      total_revenue: { $sum: "$total_revenue" },
      avg_profit_margin: { $avg: "$profit_margin" },
      products: { $sum: 1 }
    }
  },
  { $sort: { total_revenue: -1 } }
])
```

---

## Data Retention Policy

| Collection | Retention | Archive | Notes |
|-----------|-----------|---------|-------|
| sales_logs | 7 years | Quarterly | Audit trail |
| inventory_logs | 5 years | Annually | Compliance |
| return_logs | 5 years | Annually | Warranty tracking |
| system_activity_logs | 2 years | Quarterly | Security/Compliance |
| Analytics | Rolling 2 years | N/A | Auto-aggregate to views |

---

## Performance Notes

- **Sharding Key**: Recommend `sale_date` or `created_at` for time-series collections
- **TTL Indexes**: Consider for temporary tracking documents
- **Caching**: Pre-compute daily/monthly summaries in financial_snapshots
- **Archive Strategy**: Move old logs to separate collection monthly
