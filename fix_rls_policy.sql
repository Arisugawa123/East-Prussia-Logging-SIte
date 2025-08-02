-- Fix RLS policy for low_rank_logs table
-- Run this in Supabase SQL Editor

-- Drop the existing policy
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON low_rank_logs;

-- Create a more permissive policy that works with anon access
CREATE POLICY "Enable all access for low_rank_logs" ON low_rank_logs
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Alternative: If you want to keep authentication, use this instead:
-- CREATE POLICY "Allow all operations for authenticated users" ON low_rank_logs
--     FOR ALL 
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);

-- Check if the policy was created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'low_rank_logs';