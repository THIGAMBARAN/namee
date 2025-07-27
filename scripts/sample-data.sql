-- Insert sample profiles (users)
INSERT INTO profiles (id, full_name, phone, business_name, address, city, role, rating)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alice Vendor', '9876543210', 'Alice Foods', '123 Vendor St', 'Mumbai', 'vendor', 4.8),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Bob Supplier', '9988776655', 'Bob Supplies', '456 Supplier Rd', 'Delhi', 'supplier', 4.5),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Charlie Vendor', '9123456789', 'Charlie Eats', '789 Food Ave', 'Bangalore', 'vendor', 4.6),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'David Supplier', '9012345678', 'David Organics', '101 Green Ln', 'Chennai', 'supplier', 4.9)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products from Bob Supplier
INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, description)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Fresh Tomatoes', 'Vegetables', 30.50, 'kg', 100, 'Locally sourced, ripe red tomatoes'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Cumin Powder', 'Spices', 120.00, 'packet', 50, 'Organic cumin powder, 200g'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Sunflower Oil', 'Oil', 150.00, 'liter', 75, 'Refined sunflower oil, 1 liter bottle')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products from David Supplier
INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, description)
VALUES
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Basmati Rice', 'Grains', 80.00, 'kg', 200, 'Premium long-grain basmati rice'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Paneer', 'Dairy', 250.00, 'kg', 60, 'Fresh homemade paneer'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Chicken Breast', 'Meat', 220.00, 'kg', 80, 'Boneless chicken breast, fresh')
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders (assuming product IDs exist from above)
-- You'll need to get actual product IDs from your database after running the above inserts
-- For demonstration, let's assume some product IDs for now. In a real scenario, you'd fetch them.
-- Example: product_id for 'Fresh Tomatoes' might be 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'

-- To make this script runnable without manual ID lookup, we'll use a subquery to get product IDs.
-- This assumes product names are unique for simplicity in this sample data.

INSERT INTO orders (vendor_id, supplier_id, total_amount, status)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 305.00, 'pending')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT
  (SELECT id FROM orders WHERE vendor_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' AND supplier_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12' LIMIT 1),
  (SELECT id FROM products WHERE name = 'Fresh Tomatoes' LIMIT 1),
  10,
  30.50
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT
  (SELECT id FROM orders WHERE vendor_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' AND supplier_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12' LIMIT 1),
  (SELECT id FROM products WHERE name = 'Cumin Powder' LIMIT 1),
  2,
  120.00
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (vendor_id, supplier_id, total_amount, status)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 800.00, 'accepted')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT
  (SELECT id FROM orders WHERE vendor_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13' AND supplier_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14' LIMIT 1),
  (SELECT id FROM products WHERE name = 'Basmati Rice' LIMIT 1),
  10,
  80.00
ON CONFLICT (id) DO NOTHING;
