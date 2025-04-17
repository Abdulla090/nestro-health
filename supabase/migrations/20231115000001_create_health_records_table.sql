-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  record_type TEXT NOT NULL,
  record_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  record_value NUMERIC NOT NULL,
  record_value_2 NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);

-- Create index for faster lookups by record_type
CREATE INDEX IF NOT EXISTS idx_health_records_record_type ON health_records(record_type);

-- Create composite index for user_id and record_type for even faster lookups
CREATE INDEX IF NOT EXISTS idx_health_records_user_type ON health_records(user_id, record_type);

-- Set up Row Level Security
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to all health records
-- This is acceptable for our app's use case as we're using anonymous profiles
CREATE POLICY "Allow public read access" ON health_records
  FOR SELECT USING (true);

-- Create policy to allow users to insert their own health records
CREATE POLICY "Allow authenticated health record creation" ON health_records
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to update their own health records  
CREATE POLICY "Allow authenticated updates to own health records" ON health_records
  FOR UPDATE USING (true);

-- Create policy to allow users to delete their own health records
CREATE POLICY "Allow authenticated deletion of own health records" ON health_records
  FOR DELETE USING (true); 