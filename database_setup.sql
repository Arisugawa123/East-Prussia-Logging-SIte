-- Prussia Regiment Database Schema
-- Run these commands in your Supabase SQL Editor

-- 1. Create personnel table
CREATE TABLE personnel (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    rank TEXT NOT NULL,
    category TEXT NOT NULL,
    position TEXT,
    date_joined TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    promoted_by TEXT,
    retired_by TEXT,
    retired_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create promotion_logs table
CREATE TABLE promotion_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    previous_rank TEXT NOT NULL,
    new_rank TEXT NOT NULL,
    category_change TEXT,
    processed_by TEXT NOT NULL,
    promotion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create activity_logs table
CREATE TABLE activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    details TEXT NOT NULL,
    category TEXT,
    processed_by TEXT NOT NULL,
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert initial command structure data
INSERT INTO personnel (username, rank, category, position) VALUES
('Max13Gamer1', 'Oberst', 'High Command', 'Regiment Commander'),
('KarKarlinus', 'Oberstleutnant', 'High Command', 'Deputy Commander'),
('Mechtech101', 'Major', 'High Command', 'Operations Commander'),
('jvitolas_alt', 'Premierleutnant', 'Officer Corps', 'Senior Lieutenant'),
('IRON_WOLF321567', 'Feldwebel', 'Senior NCOs', 'Senior NCO'),
('Ole618', 'Sergeant', 'Junior NCOs', 'Squad Leader'),
('Sith_PlaysRon61', 'Korporal', 'Junior NCOs', 'Team Leader');

-- 5. Create indexes for better performance
CREATE INDEX idx_personnel_status ON personnel(status);
CREATE INDEX idx_personnel_category ON personnel(category);
CREATE INDEX idx_promotion_logs_date ON promotion_logs(promotion_date);
CREATE INDEX idx_activity_logs_date ON activity_logs(activity_date);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for public access (adjust as needed for security)
CREATE POLICY "Enable read access for all users" ON personnel FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON personnel FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON personnel FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON personnel FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON promotion_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON promotion_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON activity_logs FOR INSERT WITH CHECK (true);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create trigger for personnel table
CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON personnel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();