/*
  # Create sales and sale_items tables

  1. New Tables
    - `sales`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `total_amount` (decimal, not null)
      - `payment_method` (enum)
      - `payment_status` (enum)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `sale_items`
      - `id` (uuid, primary key)
      - `sale_id` (uuid, foreign key to sales)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer, not null)
      - `unit_price` (decimal, not null)
      - `total_price` (decimal, not null)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
*/

-- Create enums
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer', 'check');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  total_amount decimal(10,2) NOT NULL,
  payment_method payment_method DEFAULT 'cash',
  payment_status payment_status DEFAULT 'paid',
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Create policies for sales
CREATE POLICY "Users can manage their sales"
  ON sales
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Create policies for sale_items
CREATE POLICY "Users can manage their sale items"
  ON sale_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales 
      WHERE sales.id = sale_items.sale_id 
      AND (sales.user_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM users 
             WHERE users.id = auth.uid() 
             AND users.role IN ('admin', 'manager')
           ))
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();