-- Create the nco_logs table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS nco_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    rank VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    leadership_training TEXT,
    command_experience TEXT,
    training_conducted TEXT,
    performance_evaluation TEXT,
    recommendations TEXT,
    last_activity_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    logged_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nco_logs_personnel_id ON nco_logs(personnel_id);
CREATE INDEX IF NOT EXISTS idx_nco_logs_status ON nco_logs(status);
CREATE INDEX IF NOT EXISTS idx_nco_logs_rank ON nco_logs(rank);

-- Disable RLS for now (same as low_rank_logs)
ALTER TABLE nco_logs DISABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_nco_logs_updated_at 
    BEFORE UPDATE ON nco_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();