// ============================================
// MYSQL INITIALIZATION SCRIPT
// ============================================
// Creates all MySQL tables, stored procedures,
// functions, and seeds initial data.
// Run: node scripts/init-mysql.js
// ============================================

require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    multipleStatements: true
};

const DB_NAME = process.env.MYSQL_DATABASE || 'techzone';

async function initMySQL() {
    let connection;
    try {
        console.log('🔌 Connecting to MySQL...');
        connection = await mysql.createConnection(config);
        console.log('✅ Connected to MySQL');

        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        await connection.query(`USE \`${DB_NAME}\``);
        console.log(`✅ Database "${DB_NAME}" ready`);

        // ========================================
        // CREATE TABLES
        // ========================================
        console.log('📋 Creating tables...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                warranty INT DEFAULT 365,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('   ✅ categories');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                contact VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('   ✅ suppliers');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS staff (
                user_id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) NOT NULL UNIQUE,
                role VARCHAR(50) DEFAULT 'Staff',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('   ✅ staff');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(50),
                email VARCHAR(100),
                city VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('   ✅ customers');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL,
                price DECIMAL(12,2) NOT NULL DEFAULT 0,
                cost DECIMAL(12,2) NOT NULL DEFAULT 0,
                qty INT NOT NULL DEFAULT 0,
                supplier_id INT,
                type_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
                FOREIGN KEY (type_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);
        console.log('   ✅ products');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS sales (
                id INT PRIMARY KEY AUTO_INCREMENT,
                sale_date DATE NOT NULL,
                customer_id INT,
                customer_name VARCHAR(100),
                customer_phone VARCHAR(50),
                customer_email VARCHAR(100),
                customer_city VARCHAR(100),
                total_amount DECIMAL(12,2) DEFAULT 0,
                total_profit DECIMAL(12,2) DEFAULT 0,
                payment_method VARCHAR(50) DEFAULT 'Cash',
                processed_by VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
            )
        `);
        console.log('   ✅ sales');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS sale_item (
                id INT PRIMARY KEY AUTO_INCREMENT,
                sale_id INT NOT NULL,
                item_id INT NOT NULL,
                qty INT NOT NULL DEFAULT 1,
                sold_price DECIMAL(12,2) NOT NULL,
                cost DECIMAL(12,2) DEFAULT 0,
                line_total DECIMAL(12,2) DEFAULT 0,
                profit DECIMAL(12,2) DEFAULT 0,
                warranty_expiration DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
                FOREIGN KEY (item_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        console.log('   ✅ sale_item');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS returns_tbl (
                id INT PRIMARY KEY AUTO_INCREMENT,
                sale_id INT,
                sale_item_id INT,
                item_id INT,
                item_name VARCHAR(200),
                qty INT NOT NULL DEFAULT 1,
                sold_price DECIMAL(12,2),
                returned_amount DECIMAL(12,2),
                profit_loss DECIMAL(12,2),
                reason VARCHAR(100),
                disposition VARCHAR(100),
                restocked BOOLEAN DEFAULT FALSE,
                return_date DATE,
                customer_name VARCHAR(100),
                approved_by VARCHAR(50),
                status VARCHAR(50) DEFAULT 'Approved',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL,
                FOREIGN KEY (item_id) REFERENCES products(id) ON DELETE SET NULL
            )
        `);
        console.log('   ✅ returns_tbl');

        // ========================================
        // DROP EXISTING PROCEDURES AND FUNCTIONS
        // ========================================
        console.log('🔧 Creating stored procedures and functions...');

        await connection.query(`DROP PROCEDURE IF EXISTS sp_add_product`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_update_product`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_delete_product`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_update_stock`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_process_sale`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_add_sale_item`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_process_return`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_get_low_stock`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_add_category`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_update_category`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_delete_category`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_add_supplier`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_update_supplier`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_delete_supplier`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_add_staff`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_update_staff`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_delete_staff`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_add_customer`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_update_customer`);
        await connection.query(`DROP PROCEDURE IF EXISTS sp_delete_customer`);
        await connection.query(`DROP FUNCTION IF EXISTS fn_get_product_margin`);
        await connection.query(`DROP FUNCTION IF EXISTS fn_calculate_warranty_expiry`);
        await connection.query(`DROP FUNCTION IF EXISTS fn_get_stock_status`);

        // ========================================
        // STORED PROCEDURES
        // ========================================

        // --- Category CRUD ---
        await connection.query(`
            CREATE PROCEDURE sp_add_category(IN p_name VARCHAR(100), IN p_warranty INT)
            BEGIN
                INSERT INTO categories (name, warranty) VALUES (p_name, p_warranty);
                SELECT LAST_INSERT_ID() AS id;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_update_category(IN p_id INT, IN p_name VARCHAR(100), IN p_warranty INT)
            BEGIN
                UPDATE categories SET name = p_name, warranty = p_warranty WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_delete_category(IN p_id INT)
            BEGIN
                DELETE FROM categories WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        // --- Supplier CRUD ---
        await connection.query(`
            CREATE PROCEDURE sp_add_supplier(IN p_name VARCHAR(100), IN p_contact VARCHAR(50))
            BEGIN
                INSERT INTO suppliers (name, contact) VALUES (p_name, p_contact);
                SELECT LAST_INSERT_ID() AS id;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_update_supplier(IN p_id INT, IN p_name VARCHAR(100), IN p_contact VARCHAR(50))
            BEGIN
                UPDATE suppliers SET name = p_name, contact = p_contact WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_delete_supplier(IN p_id INT)
            BEGIN
                DELETE FROM suppliers WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        // --- Staff CRUD ---
        await connection.query(`
            CREATE PROCEDURE sp_add_staff(IN p_username VARCHAR(50), IN p_role VARCHAR(50))
            BEGIN
                INSERT INTO staff (username, role) VALUES (p_username, p_role);
                SELECT LAST_INSERT_ID() AS user_id;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_update_staff(IN p_user_id INT, IN p_username VARCHAR(50), IN p_role VARCHAR(50))
            BEGIN
                UPDATE staff SET username = p_username, role = p_role WHERE user_id = p_user_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_delete_staff(IN p_user_id INT)
            BEGIN
                DELETE FROM staff WHERE user_id = p_user_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        // --- Customer CRUD ---
        await connection.query(`
            CREATE PROCEDURE sp_add_customer(IN p_name VARCHAR(100), IN p_phone VARCHAR(50), IN p_email VARCHAR(100), IN p_city VARCHAR(100))
            BEGIN
                INSERT INTO customers (name, phone, email, city) VALUES (p_name, p_phone, p_email, p_city);
                SELECT LAST_INSERT_ID() AS id;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_update_customer(IN p_id INT, IN p_name VARCHAR(100), IN p_phone VARCHAR(50), IN p_email VARCHAR(100), IN p_city VARCHAR(100))
            BEGIN
                UPDATE customers SET name = p_name, phone = p_phone, email = p_email, city = p_city WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_delete_customer(IN p_id INT)
            BEGIN
                DELETE FROM customers WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        // --- Product CRUD ---
        await connection.query(`
            CREATE PROCEDURE sp_add_product(
                IN p_name VARCHAR(200), IN p_price DECIMAL(12,2), IN p_cost DECIMAL(12,2),
                IN p_qty INT, IN p_supplier_id INT, IN p_type_id INT
            )
            BEGIN
                INSERT INTO products (name, price, cost, qty, supplier_id, type_id)
                VALUES (p_name, p_price, p_cost, p_qty, p_supplier_id, p_type_id);
                SELECT LAST_INSERT_ID() AS id;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_update_product(
                IN p_id INT, IN p_name VARCHAR(200), IN p_price DECIMAL(12,2),
                IN p_cost DECIMAL(12,2), IN p_qty INT, IN p_supplier_id INT, IN p_type_id INT
            )
            BEGIN
                UPDATE products
                SET name = p_name, price = p_price, cost = p_cost, qty = p_qty,
                    supplier_id = p_supplier_id, type_id = p_type_id
                WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        await connection.query(`
            CREATE PROCEDURE sp_delete_product(IN p_id INT)
            BEGIN
                DELETE FROM products WHERE id = p_id;
                SELECT ROW_COUNT() AS affected;
            END
        `);

        // --- Stock Update ---
        await connection.query(`
            CREATE PROCEDURE sp_update_stock(IN p_item_id INT, IN p_qty_change INT, IN p_action VARCHAR(20))
            BEGIN
                DECLARE current_qty INT;
                SELECT qty INTO current_qty FROM products WHERE id = p_item_id;
                IF p_action = 'ADD' THEN
                    UPDATE products SET qty = qty + p_qty_change WHERE id = p_item_id;
                ELSEIF p_action = 'SUBTRACT' THEN
                    IF current_qty >= p_qty_change THEN
                        UPDATE products SET qty = qty - p_qty_change WHERE id = p_item_id;
                    ELSE
                        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock';
                    END IF;
                ELSEIF p_action = 'SET' THEN
                    UPDATE products SET qty = p_qty_change WHERE id = p_item_id;
                END IF;
                SELECT * FROM products WHERE id = p_item_id;
            END
        `);

        // --- Process Sale ---
        await connection.query(`
            CREATE PROCEDURE sp_process_sale(
                IN p_customer_name VARCHAR(100), IN p_customer_phone VARCHAR(50),
                IN p_customer_email VARCHAR(100), IN p_customer_city VARCHAR(100),
                IN p_total_amount DECIMAL(12,2), IN p_total_profit DECIMAL(12,2),
                IN p_payment_method VARCHAR(50), IN p_processed_by VARCHAR(50)
            )
            BEGIN
                DECLARE v_customer_id INT DEFAULT NULL;
                DECLARE v_sale_id INT;
                
                IF p_customer_phone IS NOT NULL AND p_customer_phone != '' THEN
                    SELECT id INTO v_customer_id FROM customers WHERE phone = p_customer_phone LIMIT 1;
                    IF v_customer_id IS NULL THEN
                        INSERT INTO customers (name, phone, email, city)
                        VALUES (p_customer_name, p_customer_phone, p_customer_email, p_customer_city);
                        SET v_customer_id = LAST_INSERT_ID();
                    ELSE
                        UPDATE customers SET name = p_customer_name, email = p_customer_email, city = p_customer_city
                        WHERE id = v_customer_id;
                    END IF;
                END IF;
                
                INSERT INTO sales (sale_date, customer_id, customer_name, customer_phone, customer_email, customer_city,
                                   total_amount, total_profit, payment_method, processed_by)
                VALUES (CURDATE(), v_customer_id, p_customer_name, p_customer_phone, p_customer_email, p_customer_city,
                        p_total_amount, p_total_profit, p_payment_method, p_processed_by);
                
                SET v_sale_id = LAST_INSERT_ID();
                SELECT v_sale_id AS sale_id, v_customer_id AS customer_id;
            END
        `);

        // --- Add Sale Item ---
        await connection.query(`
            CREATE PROCEDURE sp_add_sale_item(
                IN p_sale_id INT, IN p_item_id INT, IN p_qty INT,
                IN p_sold_price DECIMAL(12,2), IN p_cost DECIMAL(12,2), IN p_warranty_days INT
            )
            BEGIN
                DECLARE v_line_total DECIMAL(12,2);
                DECLARE v_profit DECIMAL(12,2);
                DECLARE v_warranty_date DATE;
                
                SET v_line_total = p_sold_price * p_qty;
                SET v_profit = (p_sold_price - p_cost) * p_qty;
                SET v_warranty_date = DATE_ADD(CURDATE(), INTERVAL p_warranty_days DAY);
                
                INSERT INTO sale_item (sale_id, item_id, qty, sold_price, cost, line_total, profit, warranty_expiration)
                VALUES (p_sale_id, p_item_id, p_qty, p_sold_price, p_cost, v_line_total, v_profit, v_warranty_date);
                
                -- Stock deduction handled by trigger trg_deduct_stock_after_sale
                
                SELECT LAST_INSERT_ID() AS sale_item_id, v_line_total AS line_total, v_profit AS profit, v_warranty_date AS warranty_expiration;
            END
        `);

        // --- Process Return ---
        await connection.query(`
            CREATE PROCEDURE sp_process_return(
                IN p_sale_id INT, IN p_sale_item_id INT, IN p_item_id INT,
                IN p_item_name VARCHAR(200), IN p_qty INT, IN p_sold_price DECIMAL(12,2),
                IN p_reason VARCHAR(100), IN p_approved_by VARCHAR(50), IN p_customer_name VARCHAR(100)
            )
            BEGIN
                DECLARE v_returned_amount DECIMAL(12,2);
                DECLARE v_item_cost DECIMAL(12,2);
                DECLARE v_profit_loss DECIMAL(12,2);
                DECLARE v_disposition VARCHAR(100);
                DECLARE v_restocked BOOLEAN DEFAULT FALSE;
                DECLARE v_return_id INT;
                
                SET v_returned_amount = p_sold_price * p_qty;
                SELECT cost INTO v_item_cost FROM products WHERE id = p_item_id;
                SET v_profit_loss = v_returned_amount - (IFNULL(v_item_cost, 0) * p_qty);
                
                IF p_reason = 'Defective' THEN
                    SET v_disposition = 'Defective Bin';
                    SET v_restocked = FALSE;
                ELSE
                    SET v_disposition = 'Returned to Stock';
                    SET v_restocked = TRUE;
                    -- Stock restoration handled by trigger trg_restore_stock_after_return
                END IF;
                
                INSERT INTO returns_tbl (sale_id, sale_item_id, item_id, item_name, qty, sold_price,
                    returned_amount, profit_loss, reason, disposition, restocked, return_date, customer_name, approved_by, status)
                VALUES (p_sale_id, p_sale_item_id, p_item_id, p_item_name, p_qty, p_sold_price,
                    v_returned_amount, v_profit_loss, p_reason, v_disposition, v_restocked, CURDATE(), p_customer_name, p_approved_by, 'Approved');
                
                SET v_return_id = LAST_INSERT_ID();
                SELECT v_return_id AS return_id, v_returned_amount AS returned_amount, v_profit_loss AS profit_loss,
                       v_disposition AS disposition, v_restocked AS restocked;
            END
        `);

        // --- Get Low Stock ---
        await connection.query(`
            CREATE PROCEDURE sp_get_low_stock(IN p_threshold INT)
            BEGIN
                SELECT p.*, c.name AS category_name, s.name AS supplier_name
                FROM products p
                LEFT JOIN categories c ON p.type_id = c.id
                LEFT JOIN suppliers s ON p.supplier_id = s.id
                WHERE p.qty <= p_threshold
                ORDER BY p.qty ASC;
            END
        `);

        console.log('   ✅ All stored procedures created');

        // ========================================
        // FUNCTIONS
        // ========================================

        await connection.query(`
            CREATE FUNCTION fn_get_product_margin(p_price DECIMAL(12,2), p_cost DECIMAL(12,2))
            RETURNS DECIMAL(5,2) DETERMINISTIC
            BEGIN
                IF p_price <= 0 THEN RETURN 0; END IF;
                RETURN ROUND(((p_price - p_cost) / p_price) * 100, 2);
            END
        `);

        await connection.query(`
            CREATE FUNCTION fn_calculate_warranty_expiry(p_sale_date DATE, p_warranty_days INT)
            RETURNS DATE DETERMINISTIC
            BEGIN
                RETURN DATE_ADD(p_sale_date, INTERVAL p_warranty_days DAY);
            END
        `);

        await connection.query(`
            CREATE FUNCTION fn_get_stock_status(p_qty INT, p_threshold INT)
            RETURNS VARCHAR(20) DETERMINISTIC
            BEGIN
                IF p_qty = 0 THEN RETURN 'Out of Stock';
                ELSEIF p_qty <= p_threshold THEN RETURN 'Low Stock';
                ELSE RETURN 'In Stock';
                END IF;
            END
        `);

        console.log('   ✅ All functions created');

        // ========================================
        // TRIGGERS
        // ========================================
        console.log('⚡ Creating triggers...');

        await connection.query(`DROP TRIGGER IF EXISTS trg_validate_stock_before_sale`);
        await connection.query(`DROP TRIGGER IF EXISTS trg_deduct_stock_after_sale`);
        await connection.query(`DROP TRIGGER IF EXISTS trg_restore_stock_after_return`);
        await connection.query(`DROP TRIGGER IF EXISTS trg_prevent_delete_product_with_sales`);

        // Trigger 1: Validate stock availability BEFORE sale_item insert
        await connection.query(`
            CREATE TRIGGER trg_validate_stock_before_sale
            BEFORE INSERT ON sale_item
            FOR EACH ROW
            BEGIN
                DECLARE v_current_stock INT;
                SELECT qty INTO v_current_stock FROM products WHERE id = NEW.item_id;
                IF v_current_stock < NEW.qty THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Insufficient stock for this sale item';
                END IF;
            END
        `);
        console.log('   ✅ trg_validate_stock_before_sale (BEFORE INSERT on sale_item)');

        // Trigger 2: Auto-deduct product stock AFTER sale_item insert
        await connection.query(`
            CREATE TRIGGER trg_deduct_stock_after_sale
            AFTER INSERT ON sale_item
            FOR EACH ROW
            BEGIN
                UPDATE products SET qty = qty - NEW.qty WHERE id = NEW.item_id;
            END
        `);
        console.log('   ✅ trg_deduct_stock_after_sale (AFTER INSERT on sale_item)');

        // Trigger 3: Auto-restore stock AFTER return insert (only if restocked = TRUE)
        await connection.query(`
            CREATE TRIGGER trg_restore_stock_after_return
            AFTER INSERT ON returns_tbl
            FOR EACH ROW
            BEGIN
                IF NEW.restocked = TRUE THEN
                    UPDATE products SET qty = qty + NEW.qty WHERE id = NEW.item_id;
                END IF;
            END
        `);
        console.log('   ✅ trg_restore_stock_after_return (AFTER INSERT on returns_tbl)');

        // Trigger 4: Prevent product deletion if it has existing sale records
        await connection.query(`
            CREATE TRIGGER trg_prevent_delete_product_with_sales
            BEFORE DELETE ON products
            FOR EACH ROW
            BEGIN
                DECLARE v_sale_count INT;
                SELECT COUNT(*) INTO v_sale_count FROM sale_item WHERE item_id = OLD.id;
                IF v_sale_count > 0 THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Cannot delete product with existing sales records';
                END IF;
            END
        `);
        console.log('   ✅ trg_prevent_delete_product_with_sales (BEFORE DELETE on products)');

        console.log('   ✅ All 4 triggers created');

        // ========================================
        // SEED DATA
        // ========================================
        console.log('🌱 Seeding initial data...');

        // Check if data already exists
        const [catRows] = await connection.query('SELECT COUNT(*) AS cnt FROM categories');
        if (catRows[0].cnt === 0) {
            await connection.query(`
                INSERT INTO categories (id, name, warranty) VALUES
                (1, 'Processor', 365), (2, 'Graphics Card', 365), (3, 'Memory', 365),
                (4, 'Peripherals', 365), (5, 'Monitor', 365), (6, 'Storage', 365),
                (7, 'Motherboard', 365), (8, 'Power Supply', 365), (9, 'Furniture', 30),
                (10, 'Accessories', 30), (11, 'Audio', 365)
            `);
            console.log('   ✅ categories seeded (11 rows)');
        } else {
            console.log('   ⏩ categories already has data, skipping');
        }

        const [supRows] = await connection.query('SELECT COUNT(*) AS cnt FROM suppliers');
        if (supRows[0].cnt === 0) {
            await connection.query(`
                INSERT INTO suppliers (id, name, contact) VALUES
                (1, 'AMD Phil', '02-8888-1111'), (2, 'Asus Ph', '02-8888-2222'),
                (3, 'Kingston D.', '02-8888-3333'), (4, 'Logi Dist', '02-8888-4444'),
                (5, 'Nvision', '0917-000-1111'), (6, 'Rakk Gears', '0918-000-2222'),
                (7, 'Gigabyte Ph', '02-8888-5555'), (8, 'Corsair D.', '02-8888-6666'),
                (9, 'SecretLab', '02-8888-7777'), (10, 'Generic', 'N/A'),
                (11, 'Maono', '0919-000-3333'), (12, 'Creative', '02-8888-8888')
            `);
            console.log('   ✅ suppliers seeded (12 rows)');
        } else {
            console.log('   ⏩ suppliers already has data, skipping');
        }

        const [staffRows] = await connection.query('SELECT COUNT(*) AS cnt FROM staff');
        if (staffRows[0].cnt === 0) {
            await connection.query(`
                INSERT INTO staff (user_id, username, role) VALUES
                (1, 'admin', 'Administrator'), (2, 'cashier_01', 'Cashier'),
                (3, 'cashier_02', 'Cashier'), (4, 'manager_01', 'Manager'),
                (5, 'staff', 'Staff')
            `);
            console.log('   ✅ staff seeded (5 rows)');
        } else {
            console.log('   ⏩ staff already has data, skipping');
        }

        const [prodRows] = await connection.query('SELECT COUNT(*) AS cnt FROM products');
        if (prodRows[0].cnt === 0) {
            await connection.query(`
                INSERT INTO products (id, name, price, cost, qty, supplier_id, type_id) VALUES
                (1, 'Ryzen 5 5600', 8500, 6500, 50, 1, 1),
                (2, 'RTX 4060', 18500, 16000, 20, 2, 2),
                (3, '8GB DDR4 RAM', 1500, 900, 100, 3, 3),
                (4, 'Logitech G102', 995, 700, 45, 4, 4),
                (5, '24 IPS Monitor', 7500, 5500, 30, 5, 5),
                (6, 'Mech Keyboard', 2500, 1800, 60, 6, 4),
                (7, '1TB NVMe SSD', 3500, 2500, 40, 3, 6),
                (8, 'Ryzen 7 5700X', 12000, 9500, 15, 1, 1),
                (9, 'B550m Motherboard', 6500, 5000, 25, 2, 7),
                (10, 'RTX 4070', 38000, 34000, 10, 7, 2),
                (11, '650W PSU', 3000, 2200, 35, 8, 8),
                (12, 'Webcam 1080p', 1200, 800, 50, 4, 4),
                (13, 'Gaming Chair', 8000, 5000, 12, 9, 9),
                (14, 'Ring Light', 500, 200, 80, 10, 10),
                (15, 'Microphone USB', 2500, 1500, 40, 11, 11),
                (16, 'Sound Card', 1500, 900, 20, 12, 11),
                (17, 'RTX 3060', 18000, 14000, 0, 2, 2)
            `);
            console.log('   ✅ products seeded (17 rows)');
        } else {
            console.log('   ⏩ products already has data, skipping');
        }

        console.log('');
        console.log('================================================');
        console.log('✅ MySQL initialization complete!');
        console.log('================================================');
        console.log(`   Database: ${DB_NAME}`);
        console.log('   Tables: categories, suppliers, staff, customers, products, sales, sale_item, returns_tbl');
        console.log('   Procedures: 20 stored procedures');
        console.log('   Triggers: trg_validate_stock_before_sale, trg_deduct_stock_after_sale, trg_restore_stock_after_return, trg_prevent_delete_product_with_sales');
        console.log('   Functions: fn_get_product_margin, fn_calculate_warranty_expiry, fn_get_stock_status');
        console.log('================================================');

    } catch (error) {
        console.error('❌ MySQL initialization failed:', error.message);
        console.error(error);
    } finally {
        if (connection) await connection.end();
    }
}

initMySQL();
