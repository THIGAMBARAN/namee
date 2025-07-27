-- Insert sample data into the users table
INSERT INTO users (email, password_hash, role) VALUES
('vendor1@example.com', 'hashed_password_vendor1', 'vendor'),
('supplier1@example.com', 'hashed_password_supplier1', 'supplier')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data into the profiles table
INSERT INTO profiles (id, full_name, user_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Vendor One', 'vendor')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, user_type = EXCLUDED.user_type;

INSERT INTO profiles (id, full_name, user_type) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Supplier One', 'supplier')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, user_type = EXCLUDED.user_type;
