/*
  # Create finance table

  1. New Tables
    - `finance`
      - `id` (uuid, primary key)
      - `type` (enum: income, expense)
      - `amount` (decimal, not null)
      - `description` (text, not null)
      - `category` (text, not null)
      - `sale_id` (uuid, foreign key to sales, nullable)
      - `receipt_url` (text, nullable)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `finance` table
    - Add policies for user access control
    - Restrict access to financial data based on role
*/

-- Create enum for transaction type
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Create finance table
CREATE TABLE IF NOT EXISTS finance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type transaction_type NOT NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  sale_id uuid REFERENCES sales(id) ON DELETE SET NULL,
  receipt_url text,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE finance ENABLE ROW LEVEL SECURITY;

-- Create policies (restricted to admin and manager roles)
CREATE POLICY "Admins and managers can manage finance"
  ON finance
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
CREATE TRIGGER update_finance_updated_at
  BEFORE UPDATE ON finance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();