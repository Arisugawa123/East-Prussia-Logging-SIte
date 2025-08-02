-- Fix the status column in logging tables
-- Run this in Supabase SQL Editor

-- 1. Update the default value for status column in all logging tables
ALTER TABLE low_rank_logs ALTER COLUMN status SET DEFAULT 'None';
ALTER TABLE nco_logs ALTER COLUMN status SET DEFAULT 'None';
ALTER TABLE officer_logs ALTER COLUMN status SET DEFAULT 'None';

-- 2. Update existing records that have 'active' status to 'None'
UPDATE low_rank_logs SET status = 'None' WHERE status = 'active';
UPDATE nco_logs SET status = 'None' WHERE status = 'active';
UPDATE officer_logs SET status = 'None' WHERE status = 'active';

-- 3. Check the results
SELECT 'low_rank_logs' as table_name, status, COUNT(*) as count 
FROM low_rank_logs 
GROUP BY status
UNION ALL
SELECT 'nco_logs' as table_name, status, COUNT(*) as count 
FROM nco_logs 
GROUP BY status
UNION ALL
SELECT 'officer_logs' as table_name, status, COUNT(*) as count 
FROM officer_logs 
GROUP BY status;