/*
  # Create journal table

  1. New Tables
    - `journal`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `mood` (enum)
      - `category` (enum)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `journal` table
    - Add policies for user access control (users can only see their own entries)
*/

-- Create enums
CREATE TYPE journal_mood AS ENUM ('excellent', 'good', 'neutral', 'difficult', 'challenging');
CREATE TYPE journal_category AS ENUM ('business', 'personal', 'goals', 'reflection', 'ideas');

-- Create journal table
CREATE TABLE IF NOT EXISTS journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  mood journal_mood DEFAULT 'neutral',
  category journal_category DEFAULT 'business',
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own journal entries)
CREATE POLICY "Users can manage their own journal entries"
  ON journal
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_journal_updated_at
  BEFORE UPDATE ON journal
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();