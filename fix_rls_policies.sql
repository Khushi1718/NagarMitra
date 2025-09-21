-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new permissive policies for custom authentication
CREATE POLICY "Anyone can create users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update users" ON users
    FOR UPDATE USING (true);