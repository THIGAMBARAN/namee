-- Insert sample suppliers
INSERT INTO profiles (id, full_name, email, phone, role, business_name, address, city, rating) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'rajesh@supplier.com', '+91-9876543210', 'supplier', 'Kumar Vegetables', '123 Market Street', 'Mumbai', 4.8),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', 'priya@supplier.com', '+91-9876543211', 'supplier', 'Sharma Spices', '456 Spice Market', 'Delhi', 4.6),
('550e8400-e29b-41d4-a716-446655440003', 'Mohammed Ali', 'ali@supplier.com', '+91-9876543212', 'supplier', 'Ali Trading Co', '789 Wholesale Market', 'Bangalore', 4.7),
('550e8400-e29b-41d4-a716-446655440004', 'Sunita Patel', 'sunita@supplier.com', '+91-9876543213', 'supplier', 'Patel Grains', '321 Grain Market', 'Chennai', 4.5);

-- Insert sample vendors
INSERT INTO profiles (id, full_name, email, phone, role, business_name, address, city) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'Amit Singh', 'amit@vendor.com', '+91-9876543214', 'vendor', 'Singh Chaat Corner', '12 Street Food Lane', 'Mumbai'),
('550e8400-e29b-41d4-a716-446655440006', 'Kavita Devi', 'kavita@vendor.com', '+91-9876543215', 'vendor', 'Devi Snacks', '34 Food Street', 'Delhi'),
('550e8400-e29b-41d4-a716-446655440007', 'Ravi Reddy', 'ravi@vendor.com', '+91-9876543216', 'vendor', 'Reddy Dosa Corner', '56 South Indian Street', 'Bangalore');

-- Insert sample products
INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, description) VALUES
-- Kumar Vegetables (Mumbai)
('550e8400-e29b-41d4-a716-446655440001', 'Fresh Onions', 'Vegetables', 25.00, 'kg', 500, 'Fresh red onions from Maharashtra'),
('550e8400-e29b-41d4-a716-446655440001', 'Tomatoes', 'Vegetables', 30.00, 'kg', 300, 'Ripe red tomatoes'),
('550e8400-e29b-41d4-a716-446655440001', 'Potatoes', 'Vegetables', 20.00, 'kg', 400, 'Fresh potatoes from Punjab'),
('550e8400-e29b-41d4-a716-446655440001', 'Green Chilies', 'Vegetables', 80.00, 'kg', 50, 'Spicy green chilies'),

-- Sharma Spices (Delhi)
('550e8400-e29b-41d4-a716-446655440002', 'Turmeric Powder', 'Spices', 150.00, 'kg', 100, 'Pure turmeric powder'),
('550e8400-e29b-41d4-a716-446655440002', 'Red Chili Powder', 'Spices', 200.00, 'kg', 80, 'Spicy red chili powder'),
('550e8400-e29b-41d4-a716-446655440002', 'Cumin Seeds', 'Spices', 300.00, 'kg', 60, 'Whole cumin seeds'),
('550e8400-e29b-41d4-a716-446655440002', 'Coriander Powder', 'Spices', 120.00, 'kg', 90, 'Ground coriander powder'),

-- Ali Trading Co (Bangalore)
('550e8400-e29b-41d4-a716-446655440003', 'Sunflower Oil', 'Oil', 140.00, 'liter', 200, 'Refined sunflower oil'),
('550e8400-e29b-41d4-a716-446655440003', 'Mustard Oil', 'Oil', 160.00, 'liter', 150, 'Pure mustard oil'),
('550e8400-e29b-41d4-a716-446655440003', 'Coconut Oil', 'Oil', 180.00, 'liter', 100, 'Virgin coconut oil'),

-- Patel Grains (Chennai)
('550e8400-e29b-41d4-a716-446655440004', 'Basmati Rice', 'Grains', 80.00, 'kg', 300, 'Premium basmati rice'),
('550e8400-e29b-41d4-a716-446655440004', 'Wheat Flour', 'Grains', 35.00, 'kg', 500, 'Fine wheat flour'),
('550e8400-e29b-41d4-a716-446655440004', 'Chickpeas', 'Grains', 60.00, 'kg', 200, 'Dried chickpeas'),
('550e8400-e29b-41d4-a716-446655440004', 'Black Lentils', 'Grains', 90.00, 'kg', 150, 'Premium black lentils');

-- Insert sample orders
INSERT INTO orders (vendor_id, supplier_id, total_amount, status) VALUES
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 275.00, 'delivered'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 470.00, 'dispatched'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 420.00, 'pending');

-- Insert sample order items (you'll need to get the actual order IDs from the orders table)
-- This is just an example structure - in practice, you'd need to reference the actual order IDs
