-- Create production_plans table
CREATE TYPE production_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

CREATE TABLE production_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  status production_status DEFAULT 'pending',
  due_date DATE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create production_history table
CREATE TYPE production_history_status AS ENUM ('completed', 'failed');

CREATE TABLE production_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  production_plan_id UUID REFERENCES production_plans(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity_produced INT NOT NULL,
  status production_history_status DEFAULT 'completed',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_updates table
CREATE TYPE stock_update_type AS ENUM ('entry', 'exit');

CREATE TABLE stock_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity_change INT NOT NULL,
  type stock_update_type NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier_products table
CREATE TABLE supplier_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier_invoices table
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue');

CREATE TABLE supplier_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update products table
ALTER TYPE product_category ADD VALUE 'raw_material';
ALTER TYPE product_category ADD VALUE 'sale_item';

ALTER TABLE products
ALTER COLUMN category TYPE product_category USING category::product_category;

-- Update sales table
CREATE TYPE sale_status AS ENUM ('paid_delivered', 'paid_not_delivered', 'delivered_not_paid');

ALTER TABLE sales
ADD COLUMN sale_status sale_status DEFAULT 'paid_delivered';

-- Update finance table
ALTER TABLE finance
ADD COLUMN closing_date DATE;
