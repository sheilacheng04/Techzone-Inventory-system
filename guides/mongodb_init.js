// ============================================================================
// TechZone MongoDB Initialization Script
// ============================================================================
// This script creates all collections, indexes, and validation rules for
// the TechZone Inventory System MongoDB database
// 
// Usage: mongosh < mongodb_init.js
// ============================================================================

// Create database
use TechZoneMongo;

// ============================================================================
// ANALYTICS COLLECTIONS
// ============================================================================

// 1. Daily Sales Summary
db.createCollection("daily_sales_summary", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["date", "total_sales", "total_profit"],
      properties: {
        _id: { bsonType: "objectId" },
        date: { bsonType: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        total_sales: { bsonType: ["double", "decimal"] },
        total_profit: { bsonType: ["double", "decimal"] },
        transactions_count: { bsonType: "int" },
        total_items_sold: { bsonType: "int" },
        average_transaction_value: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.daily_sales_summary.createIndex({ date: 1 });
db.daily_sales_summary.createIndex({ created_at: -1 });

// 2. City Sales Analytics
db.createCollection("city_sales_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["city", "total_customers"],
      properties: {
        _id: { bsonType: "objectId" },
        city: { bsonType: "string" },
        total_customers: { bsonType: "int" },
        total_sales_amount: { bsonType: ["double", "decimal"] },
        total_transactions: { bsonType: "int" },
        total_items_sold: { bsonType: "int" },
        total_profit: { bsonType: ["double", "decimal"] },
        most_purchased_item: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            quantity: { bsonType: "int" }
          }
        },
        penetration_rate: { bsonType: ["double", "decimal"] },
        customer_satisfaction: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.city_sales_analytics.createIndex({ city: 1 }, { unique: true });
db.city_sales_analytics.createIndex({ total_sales_amount: -1 });

// 3. City Customer Distribution
db.createCollection("city_customer_distribution", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["city"],
      properties: {
        _id: { bsonType: "objectId" },
        city: { bsonType: "string" },
        total_customers: { bsonType: "int" },
        customer_segments: {
          bsonType: "object",
          properties: {
            retail: { bsonType: "int" },
            wholesale: { bsonType: "int" },
            corporate: { bsonType: "int" }
          }
        },
        average_purchase_value: { bsonType: ["double", "decimal"] },
        repeat_customer_rate: { bsonType: ["double", "decimal"] },
        customer_lifetime_value: { bsonType: ["double", "decimal"] },
        churn_rate: { bsonType: ["double", "decimal"] },
        acquisition_cost: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.city_customer_distribution.createIndex({ city: 1 }, { unique: true });

// 4. Customer Analytics
db.createCollection("customer_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "phone"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        city: { bsonType: "string" },
        phone: { bsonType: "string" },
        email: { bsonType: "string" },
        total_orders: { bsonType: "int" },
        total_spent: { bsonType: ["double", "decimal"] },
        total_profit_generated: { bsonType: ["double", "decimal"] },
        last_purchase_date: { bsonType: "string" },
        first_purchase_date: { bsonType: "string" },
        favorite_item_type: { bsonType: "string" },
        favorite_products: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              item_id: { bsonType: "int" },
              item_name: { bsonType: "string" },
              purchases: { bsonType: "int" }
            }
          }
        },
        average_order_value: { bsonType: ["double", "decimal"] },
        purchase_frequency_days: { bsonType: "int" },
        customer_segment: { 
          bsonType: "string",
          enum: ["VIP", "Regular", "At-Risk"]
        },
        loyalty_score: { bsonType: "int" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.customer_analytics.createIndex({ phone: 1 }, { unique: true });
db.customer_analytics.createIndex({ total_spent: -1 });
db.customer_analytics.createIndex({ city: 1 });
db.customer_analytics.createIndex({ customer_segment: 1 });

// 5. Item Performance Analytics
db.createCollection("item_performance_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["item_id", "name"],
      properties: {
        _id: { bsonType: "objectId" },
        item_id: { bsonType: "int" },
        name: { bsonType: "string" },
        type: { bsonType: "string" },
        supplier_id: { bsonType: "int" },
        supplier_name: { bsonType: "string" },
        total_quantity_sold: { bsonType: "int" },
        total_revenue: { bsonType: ["double", "decimal"] },
        total_profit: { bsonType: ["double", "decimal"] },
        profit_margin: { bsonType: ["double", "decimal"] },
        return_rate: { bsonType: ["double", "decimal"] },
        damage_rate: { bsonType: ["double", "decimal"] },
        performance_rating: { 
          bsonType: "string",
          enum: ["Excellent", "Good", "Fair", "Poor"]
        },
        inventory_turnover: { bsonType: ["double", "decimal"] },
        days_in_inventory: { bsonType: "int" },
        current_stock: { bsonType: "int" },
        reorder_point: { bsonType: "int" },
        reorder_quantity: { bsonType: "int" },
        cost_per_unit: { bsonType: ["double", "decimal"] },
        selling_price: { bsonType: ["double", "decimal"] },
        elasticity: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.item_performance_analytics.createIndex({ item_id: 1 }, { unique: true });
db.item_performance_analytics.createIndex({ total_revenue: -1 });
db.item_performance_analytics.createIndex({ performance_rating: 1 });

// 6. Inventory Health Analytics
db.createCollection("inventory_health_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["analysis_date"],
      properties: {
        _id: { bsonType: "objectId" },
        analysis_date: { bsonType: "string" },
        total_items: { bsonType: "int" },
        stock_status: {
          bsonType: "object",
          properties: {
            in_stock: { bsonType: "int" },
            low_stock: { bsonType: "int" },
            out_of_stock: { bsonType: "int" }
          }
        },
        total_inventory_value: { bsonType: ["double", "decimal"] },
        total_inventory_retail: { bsonType: ["double", "decimal"] },
        average_inventory_age: { bsonType: "int" },
        slow_moving_items: { bsonType: "int" },
        dead_stock_value: { bsonType: ["double", "decimal"] },
        stockout_incidents: { bsonType: "int" },
        overstock_items: { bsonType: "int" },
        inventory_accuracy: { bsonType: ["double", "decimal"] },
        carrying_cost_total: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" }
      }
    }
  }
});
db.inventory_health_analytics.createIndex({ analysis_date: -1 });

// 7. Financial Snapshots
db.createCollection("financial_snapshots", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["snapshot_date"],
      properties: {
        _id: { bsonType: "objectId" },
        snapshot_date: { bsonType: "string" },
        snapshot_period: { 
          bsonType: "string",
          enum: ["daily", "weekly", "monthly"]
        },
        gross_sales: { bsonType: ["double", "decimal"] },
        total_returns: { bsonType: ["double", "decimal"] },
        damaged_stock_loss: { bsonType: ["double", "decimal"] },
        net_sales: { bsonType: ["double", "decimal"] },
        cost_of_goods_sold: { bsonType: ["double", "decimal"] },
        net_profit: { bsonType: ["double", "decimal"] },
        profit_margin: { bsonType: ["double", "decimal"] },
        roi: { bsonType: ["double", "decimal"] },
        top_city: { bsonType: "string" },
        top_item: { bsonType: "string" },
        top_customer: { bsonType: "string" },
        low_stock_count: { bsonType: "int" },
        cash_position: { bsonType: ["double", "decimal"] },
        accounts_receivable: { bsonType: ["double", "decimal"] },
        inventory_turnover_ratio: { bsonType: ["double", "decimal"] },
        current_ratio: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" }
      }
    }
  }
});
db.financial_snapshots.createIndex({ snapshot_date: -1 });
db.financial_snapshots.createIndex({ snapshot_period: 1 });

// 8. Supplier Analytics
db.createCollection("supplier_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["supplier_id", "supplier_name"],
      properties: {
        _id: { bsonType: "objectId" },
        supplier_id: { bsonType: "int" },
        supplier_name: { bsonType: "string" },
        contact: { bsonType: "string" },
        total_orders: { bsonType: "int" },
        total_purchase_value: { bsonType: ["double", "decimal"] },
        total_items_supplied: { bsonType: "int" },
        average_order_value: { bsonType: ["double", "decimal"] },
        on_time_delivery_rate: { bsonType: ["double", "decimal"] },
        quality_rating: { bsonType: ["double", "decimal"] },
        defect_rate: { bsonType: ["double", "decimal"] },
        lead_time_days: { bsonType: "int" },
        payment_terms: { bsonType: "string" },
        reliability_score: { bsonType: "int" },
        products_supplied: { bsonType: "int" },
        most_supplied_item: { bsonType: "string" },
        average_quantity_per_order: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.supplier_analytics.createIndex({ supplier_id: 1 }, { unique: true });

// ============================================================================
// LOG COLLECTIONS
// ============================================================================

// 1. Sales Logs
db.createCollection("sales_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sale_id", "customer", "items", "total_amount"],
      properties: {
        _id: { bsonType: "objectId" },
        sale_id: { bsonType: "int" },
        sale_date: { bsonType: "string" },
        customer: {
          bsonType: "object",
          required: ["name"],
          properties: {
            customer_id: { bsonType: "int" },
            name: { bsonType: "string" },
            phone: { bsonType: "string" },
            email: { bsonType: "string" },
            city: { bsonType: "string" }
          }
        },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              item_id: { bsonType: "int" },
              item_name: { bsonType: "string" },
              quantity: { bsonType: "int" },
              unit_price: { bsonType: ["double", "decimal"] },
              line_total: { bsonType: ["double", "decimal"] },
              cost: { bsonType: ["double", "decimal"] },
              profit: { bsonType: ["double", "decimal"] }
            }
          }
        },
        total_amount: { bsonType: ["double", "decimal"] },
        total_cost: { bsonType: ["double", "decimal"] },
        total_profit: { bsonType: ["double", "decimal"] },
        payment_method: { bsonType: "string" },
        payment_status: { bsonType: "string" },
        processed_by: { bsonType: "string" },
        location: { bsonType: "string" },
        discount_applied: { bsonType: ["double", "decimal"] },
        tax_amount: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.sales_logs.createIndex({ sale_id: 1 }, { unique: true });
db.sales_logs.createIndex({ sale_date: -1 });
db.sales_logs.createIndex({ "customer.phone": 1 });
db.sales_logs.createIndex({ processed_by: 1 });
db.sales_logs.createIndex({ created_at: -1 });

// 2. Inventory Logs
db.createCollection("inventory_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["action", "item_id", "quantity_change"],
      properties: {
        _id: { bsonType: "objectId" },
        log_id: { bsonType: "int" },
        action: { 
          bsonType: "string",
          enum: ["SALE", "RESTOCK", "PRODUCT_ADDED", "PRODUCT_UPDATED", "DAMAGE", "ADJUSTMENT", "RETURN"]
        },
        item_id: { bsonType: "int" },
        item_name: { bsonType: "string" },
        quantity_change: { bsonType: "int" },
        previous_stock: { bsonType: "int" },
        new_stock: { bsonType: "int" },
        performed_by: { bsonType: "string" },
        reference: { bsonType: "string" },
        reference_type: { bsonType: "string" },
        notes: { bsonType: "string" },
        reason_code: { bsonType: "string" },
        warehouse_location: { bsonType: "string" },
        unit_cost: { bsonType: ["double", "decimal"] },
        total_value_change: { bsonType: ["double", "decimal"] },
        created_at: { bsonType: "date" }
      }
    }
  }
});
db.inventory_logs.createIndex({ reference: 1 });
db.inventory_logs.createIndex({ action: 1 });
db.inventory_logs.createIndex({ item_id: 1 });
db.inventory_logs.createIndex({ created_at: -1 });
db.inventory_logs.createIndex({ performed_by: 1 });

// 3. Return Logs
db.createCollection("return_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["return_id"],
      properties: {
        _id: { bsonType: "objectId" },
        return_id: { bsonType: "int" },
        return_date: { bsonType: "string" },
        original_sale_id: { bsonType: "int" },
        customer: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            phone: { bsonType: "string" },
            city: { bsonType: "string" }
          }
        },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              item_id: { bsonType: "int" },
              item_name: { bsonType: "string" },
              quantity_returned: { bsonType: "int" },
              original_price: { bsonType: ["double", "decimal"] },
              return_reason: { bsonType: "string" },
              condition: { bsonType: "string" },
              refund_amount: { bsonType: ["double", "decimal"] }
            }
          }
        },
        total_return_value: { bsonType: ["double", "decimal"] },
        refund_status: { bsonType: "string" },
        refund_method: { bsonType: "string" },
        restocked: { bsonType: "bool" },
        processed_by: { bsonType: "string" },
        notes: { bsonType: "string" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.return_logs.createIndex({ return_id: 1 }, { unique: true });
db.return_logs.createIndex({ original_sale_id: 1 });
db.return_logs.createIndex({ "customer.phone": 1 });
db.return_logs.createIndex({ return_date: -1 });

// 4. System Activity Logs
db.createCollection("system_activity_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "action"],
      properties: {
        _id: { bsonType: "objectId" },
        activity_id: { bsonType: "int" },
        user_id: { bsonType: "int" },
        username: { bsonType: "string" },
        role: { bsonType: "string" },
        action: { 
          bsonType: "string",
          enum: [
            "PROCESS_SALE", "ADD_PRODUCT", "UPDATE_PRODUCT", "RESTOCK",
            "PROCESS_RETURN", "INVENTORY_AUTO_UPDATE", "LOGIN", "LOGOUT"
          ]
        },
        reference_id: { bsonType: "int" },
        reference_type: { bsonType: "string" },
        details: { bsonType: "string" },
        ip_address: { bsonType: "string" },
        device_info: { bsonType: "string" },
        change_log: {
          bsonType: "object",
          properties: {
            field: { bsonType: "string" },
            old_value: { bsonType: "mixed" },
            new_value: { bsonType: "mixed" }
          }
        },
        status: { 
          bsonType: "string",
          enum: ["Success", "Pending", "Failed"]
        },
        error_message: { bsonType: "string" },
        created_at: { bsonType: "date" },
        timestamp: { bsonType: "long" }
      }
    }
  }
});
db.system_activity_logs.createIndex({ activity_id: 1 }, { unique: true });
db.system_activity_logs.createIndex({ username: 1 });
db.system_activity_logs.createIndex({ action: 1 });
db.system_activity_logs.createIndex({ created_at: -1 });
db.system_activity_logs.createIndex({ user_id: 1 });

// ============================================================================
// SUMMARY
// ============================================================================

print("\n✓ TechZone MongoDB Database Initialization Complete!");
print("✓ All 12 collections created with validation rules");
print("✓ All indexes created for optimal performance");
print("\nCollections created:");
print("  Analytics (8): daily_sales_summary, city_sales_analytics, city_customer_distribution,");
print("                 customer_analytics, item_performance_analytics, inventory_health_analytics,");
print("                 financial_snapshots, supplier_analytics");
print("  Logs (4):      sales_logs, inventory_logs, return_logs, system_activity_logs");
