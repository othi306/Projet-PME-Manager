/*
  # Create production table

  1. New Tables
    - `production`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `recipe` (jsonb, recipe details)
      - `cost` (decimal, production cost)
      - `quantity_produced` (integer)
      - `production_date` (timestamp)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `production` table
    - Add policies for user access control
*/

CREATE TABLE IF NOT EXISTS production (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  recipe jsonb,
  cost decimal(10,2) NOT NULL,
  quantity_produced integer NOT NULL CHECK (quantity_produced > 0),
  production_date timestamptz DEFAULT now(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE production ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their production"
  ON production
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

-- Create trigger for updated_at
CREATE TRIGGER update_production_updated_at
  BEFORE UPDATE ON production
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();