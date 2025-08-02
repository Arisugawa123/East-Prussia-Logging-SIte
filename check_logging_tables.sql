-- Check if logging tables exist and their structure
-- Run this in Supabase SQL Editor

-- 1. Check if low_rank_logs table exists and its columns
SELECT table_name, column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'low_rank_logs'
ORDER BY ordinal_position;

-- 2. Check if nco_logs table exists and its columns
SELECT table_name, column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'nco_logs'
ORDER BY ordinal_position;

-- 3. Check if officer_logs table exists and its columns
SELECT table_name, column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'officer_logs'
ORDER BY ordinal_position;

-- 4. Check actual data in low_rank_logs
SELECT id, username, status, performance_notes, created_at 
FROM low_rank_logs 
LIMIT 5;

-- 5. Check actual data in nco_logs
SELECT id, username, status, performance_evaluation, created_at 
FROM nco_logs 
LIMIT 5;

-- 6. Check actual data in officer_logs
SELECT id, username, status, leadership_assessment, created_at 
FROM officer_logs 
LIMIT 5;