-- Supabase SQL Schema for User Management System
-- Run this in your Supabase SQL Editor

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

-- Insert initial authorized users
INSERT INTO authorized_users (email, rank, status, is_owner, date_added) VALUES
-- Owner
('ironwolftrojanmotionscape@gmail.com', 'HICOM', 'Active', TRUE, '2024-01-15'),

-- High Command
('general@prussianregiment.com', 'HICOM', 'Active', FALSE, '2024-01-15'),
('colonel@prussianregiment.com', 'HICOM', 'Active', FALSE, '2024-01-15'),
('commander@prussianregiment.com', 'HICOM', 'Active', FALSE, '2024-01-15'),

-- Officers
('major@prussianregiment.com', 'OFFICER', 'Active', FALSE, '2024-01-16'),
('captain@prussianregiment.com', 'OFFICER', 'Active', FALSE, '2024-01-16'),
('lieutenant@prussianregiment.com', 'OFFICER', 'Active', FALSE, '2024-01-16'),
('officer@prussianregiment.com', 'OFFICER', 'Active', FALSE, '2024-01-16'),

-- NCOs
('sergeant@prussianregiment.com', 'NCO', 'Active', FALSE, '2024-01-17'),
('corporal@prussianregiment.com', 'NCO', 'Active', FALSE, '2024-01-17'),
('nco@prussianregiment.com', 'NCO', 'Active', FALSE, '2024-01-17'),

-- Test accounts
('test@gmail.com', 'HICOM', 'Active', FALSE, '2024-01-18'),
('admin@gmail.com', 'HICOM', 'Active', FALSE, '2024-01-18')

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

-- Create views for easier querying
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'Active') as active_users,
    COUNT(*) FILTER (WHERE status = 'Inactive') as inactive_users,
    COUNT(*) FILTER (WHERE rank = 'HICOM') as hicom_count,
    COUNT(*) FILTER (WHERE rank = 'OFFICER') as officer_count,
    COUNT(*) FILTER (WHERE rank = 'NCO') as nco_count
FROM authorized_users;

-- Create view for recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    ual.id,
    ual.admin_email,
    ual.action,
    ual.target_email,
    ual.details,
    ual.created_at,
    au.rank as admin_rank
FROM user_activity_logs ual
LEFT JOIN authorized_users au ON au.email = ual.admin_email
ORDER BY ual.created_at DESC
LIMIT 50;

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;