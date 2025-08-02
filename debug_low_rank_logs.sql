-- Debug queries to check the low_rank_logs table and data

-- 1. Check if the table exists and its structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'low_rank_logs'
ORDER BY ordinal_position;

-- 2. Check if there are any records in low_rank_logs
SELECT COUNT(*) as total_records FROM low_rank_logs;

-- 3. Check personnel table for low rank personnel
SELECT id, rank, username, status 
FROM personnel 
WHERE rank IN ('Rekrut', 'Musketier', 'Gefreiter', 'Frei Korporal')
AND status = 'active'
ORDER BY rank;

-- 4. Check if there are any low_rank_logs records
SELECT * FROM low_rank_logs LIMIT 10;

-- 5. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'low_rank_logs';

-- 6. Test the exact query that the app is running
SELECT *
FROM low_rank_logs
WHERE status = 'active'
ORDER BY created_at DESC;