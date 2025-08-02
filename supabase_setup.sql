-- Supabase Setup for Prussian Regiment Staff Portal
-- Copy and paste this entire file into Supabase SQL Editor and click "Run"

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

-- Create login_sessions table for tracking user sessions
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

-- Create user_activity_logs table for audit trail
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

ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_authorized_users_email ON authorized_users(email);
CREATE INDEX IF NOT EXISTS idx_authorized_users_status ON authorized_users(status);
CREATE INDEX IF NOT EXISTS idx_authorized_users_rank ON authorized_users(rank);
CREATE INDEX IF NOT EXISTS idx_login_sessions_user_id ON login_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_sessions_login_time ON login_sessions(login_time);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_authorized_users_updated_at ON authorized_users;
CREATE TRIGGER update_authorized_users_updated_at
    BEFORE UPDATE ON authorized_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authorized_users table
CREATE POLICY "Allow read access to authorized users" ON authorized_users
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for service role" ON authorized_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for service role" ON authorized_users
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete for service role" ON authorized_users
    FOR DELETE USING (NOT is_owner); -- Prevent deleting owner

-- Create policies for login_sessions table
CREATE POLICY "Allow all operations on login_sessions" ON login_sessions
    FOR ALL USING (true);

-- Create policies for user_activity_logs table
CREATE POLICY "Allow all operations on user_activity_logs" ON user_activity_logs
    FOR ALL USING (true);

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Display success message
SELECT 'SUCCESS: Database setup complete! Your email ironwolftrojanmotionscape@gmail.com has been added as OWNER.' AS message;