CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  business_name VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  role VARCHAR(50), -- 'vendor' or 'supplier'
  rating NUMERIC(2,1) DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own profile
CREATE POLICY "Users can view their own profile." ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy for authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy for authenticated users to update their own profile
CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50),
  stock_quantity INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Suppliers can view and manage their own products
CREATE POLICY "Suppliers can view their own products." ON products
  FOR SELECT USING (supplier_id = auth.uid());
CREATE POLICY "Suppliers can insert their own products." ON products
  FOR INSERT WITH CHECK (supplier_id = auth.uid());
CREATE POLICY "Suppliers can update their own products." ON products
  FOR UPDATE USING (supplier_id = auth.uid());
CREATE POLICY "Suppliers can delete their own products." ON products
  FOR DELETE USING (supplier_id = auth.uid());

-- Vendors can view all products
CREATE POLICY "Vendors can view all products." ON products
  FOR SELECT TO authenticated USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, dispatched, delivered, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Vendors can view and insert their own orders
CREATE POLICY "Vendors can view their own orders." ON orders
  FOR SELECT USING (vendor_id = auth.uid());
CREATE POLICY "Vendors can insert their own orders." ON orders
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

-- Suppliers can view and update orders directed to them
CREATE POLICY "Suppliers can view orders directed to them." ON orders
  FOR SELECT USING (supplier_id = auth.uid());
CREATE POLICY "Suppliers can update orders directed to them." ON orders
  FOR UPDATE USING (supplier_id = auth.uid());

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own order items
CREATE POLICY "Vendors can view their own order items." ON order_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.vendor_id = auth.uid()));

-- Suppliers can view order items related to their orders
CREATE POLICY "Suppliers can view order items related to their orders." ON order_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.supplier_id = auth.uid()));

-- Vendors can insert order items
CREATE POLICY "Vendors can insert order items." ON order_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.vendor_id = auth.uid()));

-- Function to update product stock after order item insertion
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after an order item is inserted
CREATE TRIGGER update_stock_after_order_item
AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION update_product_stock();
