-- Create the low_rank_logs table first
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS low_rank_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    rank VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    training_completed TEXT,
    performance_notes TEXT,
    disciplinary_actions TEXT,
    last_activity_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    logged_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_low_rank_logs_personnel_id ON low_rank_logs(personnel_id);
CREATE INDEX IF NOT EXISTS idx_low_rank_logs_status ON low_rank_logs(status);
CREATE INDEX IF NOT EXISTS idx_low_rank_logs_rank ON low_rank_logs(rank);

-- Enable Row Level Security (RLS)
ALTER TABLE low_rank_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON low_rank_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_low_rank_logs_updated_at 
    BEFORE UPDATE ON low_rank_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();