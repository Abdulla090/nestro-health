-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  language_preference TEXT DEFAULT 'ku',
  department TEXT,
  stage TEXT
);

-- Create index for faster lookups by username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Set up Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to all profiles
CREATE POLICY "Allow public read access" ON profiles
  FOR SELECT USING (true);

-- Create policy to allow users to update their own profile
CREATE POLICY "Allow authenticated updates to own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow anonymous creation of profiles
CREATE POLICY "Allow anonymous profile creation" ON profiles
  FOR INSERT WITH CHECK (true); 