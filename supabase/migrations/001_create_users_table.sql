-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,  -- Phone number as unique identifier for login
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Store hashed password
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups on phone_number (used for login)
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to insert new users (for signup)
CREATE POLICY "Anyone can create users" ON users
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read users (for login verification)
-- In a production app, you might want to restrict this further
CREATE POLICY "Anyone can read users" ON users
    FOR SELECT USING (true);

-- Allow anyone to update users (you can restrict this later if needed)
CREATE POLICY "Anyone can update users" ON users
    FOR UPDATE USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();