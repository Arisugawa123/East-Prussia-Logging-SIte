-- Check for ID mismatch issues
-- Run this in Supabase SQL Editor

-- 1. Check the specific record that was being updated
-- Replace 'KakujiExostlx' with the actual username from the console log
SELECT 
    id as log_id,
    personnel_id,
    username,
    rank,
    status,
    performance_notes,
    updated_at
FROM low_rank_logs 
WHERE username = 'KakujiExostlx';

-- 2. Check if there are multiple records for the same personnel
SELECT 
    personnel_id,
    COUNT(*) as record_count,
    array_agg(id) as log_ids,
    array_agg(status) as statuses
FROM low_rank_logs 
GROUP BY personnel_id 
HAVING COUNT(*) > 1;

-- 3. Check the personnel table for this user
SELECT id, username, rank, status 
FROM personnel 
WHERE username = 'KakujiExostlx';

-- 4. Try manually updating the status to see if it works
-- Replace the ID with the actual log_id from step 1
-- UPDATE low_rank_logs 
-- SET status = 'Needs Improvement' 
-- WHERE id = 'YOUR_LOG_ID_HERE';

-- 5. Check if the manual update worked
-- SELECT id, username, status FROM low_rank_logs WHERE username = 'KakujiExostlx';