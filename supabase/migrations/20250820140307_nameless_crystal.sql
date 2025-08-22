/*
  # Create personnel table

  1. New Tables
    - `personnel`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `role` (text, not null)
      - `email` (text)
      - `phone` (text)
      - `hours_worked` (integer, default 0)
      - `hourly_rate` (decimal)
      - `salary` (decimal)
      - `hire_date` (timestamp)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `personnel` table
    - Add policies for admin/manager access only
*/

CREATE TABLE IF NOT EXISTS personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  email text,
  phone text,
  hours_worked integer DEFAULT 0,
  hourly_rate decimal(10,2),
  salary decimal(10,2),
  hire_date timestamptz DEFAULT now(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;

-- Create policies (restricted to admin and manager roles)
CREATE POLICY "Admins and managers can manage personnel"
  ON personnel
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_personnel_updated_at
  BEFORE UPDATE ON personnel
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();