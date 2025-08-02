-- Logging Hall Database Schema for Prussia Personnel Management
-- This file contains all tables needed for the Logging Hall components

-- 1. Low Rank Logging Table
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

-- 2. NCO Logging Table
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

-- 3. Officer Logging Table
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

-- 4. Inactivity Notice Table
CREATE TABLE IF NOT EXISTS inactivity_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    rank VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    last_seen_date DATE,
    days_inactive INTEGER,
    notice_type VARCHAR(50), -- 'warning', 'final_warning', 'discharge_pending'
    reason_for_absence TEXT,
    contact_attempts TEXT,
    action_taken TEXT,
    notice_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'resolved', 'discharged'
    logged_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Retired Personnel Table (enhanced)
CREATE TABLE IF NOT EXISTS retired_personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    rank_at_retirement VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    retirement_date DATE NOT NULL,
    retirement_reason TEXT,
    years_of_service INTEGER,
    final_position VARCHAR(100),
    commendations TEXT,
    pension_status VARCHAR(50),
    contact_info TEXT,
    retirement_ceremony_date DATE,
    processed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_low_rank_logs_personnel_id ON low_rank_logs(personnel_id);
CREATE INDEX IF NOT EXISTS idx_low_rank_logs_status ON low_rank_logs(status);
CREATE INDEX IF NOT EXISTS idx_low_rank_logs_rank ON low_rank_logs(rank);

CREATE INDEX IF NOT EXISTS idx_nco_logs_personnel_id ON nco_logs(personnel_id);
CREATE INDEX IF NOT EXISTS idx_nco_logs_status ON nco_logs(status);
CREATE INDEX IF NOT EXISTS idx_nco_logs_rank ON nco_logs(rank);

CREATE INDEX IF NOT EXISTS idx_officer_logs_personnel_id ON officer_logs(personnel_id);
CREATE INDEX IF NOT EXISTS idx_officer_logs_status ON officer_logs(status);
CREATE INDEX IF NOT EXISTS idx_officer_logs_rank ON officer_logs(rank);

CREATE INDEX IF NOT EXISTS idx_inactivity_notices_personnel_id ON inactivity_notices(personnel_id);
CREATE INDEX IF NOT EXISTS idx_inactivity_notices_status ON inactivity_notices(status);
CREATE INDEX IF NOT EXISTS idx_inactivity_notices_notice_type ON inactivity_notices(notice_type);

CREATE INDEX IF NOT EXISTS idx_retired_personnel_personnel_id ON retired_personnel(personnel_id);
CREATE INDEX IF NOT EXISTS idx_retired_personnel_retirement_date ON retired_personnel(retirement_date);

-- Enable Row Level Security (RLS)
ALTER TABLE low_rank_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nco_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inactivity_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE retired_personnel ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON low_rank_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON nco_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON officer_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON inactivity_notices
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON retired_personnel
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_low_rank_logs_updated_at BEFORE UPDATE ON low_rank_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nco_logs_updated_at BEFORE UPDATE ON nco_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_officer_logs_updated_at BEFORE UPDATE ON officer_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inactivity_notices_updated_at BEFORE UPDATE ON inactivity_notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_retired_personnel_updated_at BEFORE UPDATE ON retired_personnel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();