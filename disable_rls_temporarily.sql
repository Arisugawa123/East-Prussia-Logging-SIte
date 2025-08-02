-- Temporarily disable RLS for testing
-- Run this in Supabase SQL Editor if the policy fix doesn't work

-- Disable RLS on low_rank_logs table
ALTER TABLE low_rank_logs DISABLE ROW LEVEL SECURITY;

-- Check table permissions
SELECT table_name, row_security 
FROM information_schema.tables 
WHERE table_name = 'low_rank_logs';

-- Test query to see if it works now
SELECT COUNT(*) FROM low_rank_logs;