-- Debug status updates in real-time
-- Run this after trying to change a status

-- 1. Check recent updates in low_rank_logs
SELECT id, username, status, performance_notes, updated_at
FROM low_rank_logs 
WHERE updated_at > NOW() - INTERVAL '5 minutes'
ORDER BY updated_at DESC;

-- 2. Check recent updates in nco_logs
SELECT id, username, status, performance_evaluation, updated_at
FROM nco_logs 
WHERE updated_at > NOW() - INTERVAL '5 minutes'
ORDER BY updated_at DESC;

-- 3. Check recent updates in officer_logs
SELECT id, username, status, leadership_assessment, updated_at
FROM officer_logs 
WHERE updated_at > NOW() - INTERVAL '5 minutes'
ORDER BY updated_at DESC;

-- 4. Check if there are any status values that are not 'None'
SELECT 'low_rank_logs' as table_name, status, COUNT(*) 
FROM low_rank_logs 
WHERE status != 'None' 
GROUP BY status
UNION ALL
SELECT 'nco_logs' as table_name, status, COUNT(*) 
FROM nco_logs 
WHERE status != 'None' 
GROUP BY status
UNION ALL
SELECT 'officer_logs' as table_name, status, COUNT(*) 
FROM officer_logs 
WHERE status != 'None' 
GROUP BY status;