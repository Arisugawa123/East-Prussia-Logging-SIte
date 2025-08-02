-- Create the officer_logs table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS officer_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    rank VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    command_assignments TEXT,
    strategic_planning TEXT,
    officer_training TEXT,
    leadership_assessment TEXT,
    mission_reports TEXT,
    last_activity_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    logged_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_officer_logs_personnel_id ON officer_logs(personnel_id);
CREATE INDEX IF NOT EXISTS idx_officer_logs_status ON officer_logs(status);
CREATE INDEX IF NOT EXISTS idx_officer_logs_rank ON officer_logs(rank);

-- Disable RLS for now (same as other logging tables)
ALTER TABLE officer_logs DISABLE ROW LEVEL SECURITY;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_officer_logs_updated_at') THEN
        CREATE TRIGGER update_officer_logs_updated_at 
            BEFORE UPDATE ON officer_logs 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;