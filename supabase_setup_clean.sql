-- Clean Supabase Setup for Prussian Regiment Staff Portal
-- This version handles existing policies and data

-- Create authorized_users table
CREATE TABLE IF NOT EXISTS authorized_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    rank VARCHAR(50) NOT NULL CHECK (rank IN ('HICOM', 'OFFICER', 'NCO')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    is_owner BOOLEAN DEFAULT FALSE,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create other tables
CREATE TABLE IF NOT EXISTS login_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES authorized_users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE,
    session_duration INTERVAL,
    auth_method VARCHAR(50) DEFAULT 'google_oauth',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES authorized_users(id) ON DELETE SET NULL,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_email VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all authorized users (with conflict handling)
INSERT INTO authorized_users (email, rank, status, is_owner, date_added) VALUES
-- Your email as owner (MOST IMPORTANT)
('ironwolftrojanmotionscape@gmail.com', 'HICOM', 'Active', TRUE, NOW()),

-- High Command users
('general@prussianregiment.com', 'HICOM', 'Active', FALSE, NOW()),
('colonel@prussianregiment.com', 'HICOM', 'Active', FALSE, NOW()),
('commander@prussianregiment.com', 'HICOM', 'Active', FALSE, NOW()),

-- Officer users
('major@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),
('captain@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),
('lieutenant@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),
('officer@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),

-- NCO users
('sergeant@prussianregiment.com', 'NCO', 'Active', FALSE, NOW()),
('corporal@prussianregiment.com', 'NCO', 'Active', FALSE, NOW()),
('nco@prussianregiment.com', 'NCO', 'Active', FALSE, NOW()),

-- Test accounts
('test@gmail.com', 'HICOM', 'Active', FALSE, NOW()),
('admin@gmail.com', 'HICOM', 'Active', FALSE, NOW())

ON CONFLICT (email) DO UPDATE SET
    rank = EXCLUDED.rank,
    status = EXCLUDED.status,
    is_owner = EXCLUDED.is_owner,
    updated_at = NOW();

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_authorized_users_email ON authorized_users(email);
CREATE INDEX IF NOT EXISTS idx_authorized_users_status ON authorized_users(status);
CREATE INDEX IF NOT EXISTS idx_authorized_users_rank ON authorized_users(rank);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS update_authorized_users_updated_at ON authorized_users;
CREATE TRIGGER update_authorized_users_updated_at
    BEFORE UPDATE ON authorized_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first, then recreate
DROP POLICY IF EXISTS "Allow read access to authorized users" ON authorized_users;
DROP POLICY IF EXISTS "Allow insert for service role" ON authorized_users;
DROP POLICY IF EXISTS "Allow update for service role" ON authorized_users;
DROP POLICY IF EXISTS "Allow delete for service role" ON authorized_users;
DROP POLICY IF EXISTS "Allow all operations on login_sessions" ON login_sessions;
DROP POLICY IF EXISTS "Allow all operations on user_activity_logs" ON user_activity_logs;

-- Create fresh policies
CREATE POLICY "Allow read access to authorized users" ON authorized_users
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for service role" ON authorized_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for service role" ON authorized_users
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete for service role" ON authorized_users
    FOR DELETE USING (NOT is_owner);

CREATE POLICY "Allow all operations on login_sessions" ON login_sessions
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on user_activity_logs" ON user_activity_logs
    FOR ALL USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- Verify your email is in the database
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM authorized_users WHERE email = 'ironwolftrojanmotionscape@gmail.com' AND is_owner = true)
        THEN 'SUCCESS: Your email is set up as OWNER! You can now authenticate.'
        ELSE 'ERROR: Your email was not added properly!'
    END AS setup_status;

-- Show all users for verification
SELECT email, rank, status, is_owner FROM authorized_users ORDER BY is_owner DESC, rank, email;