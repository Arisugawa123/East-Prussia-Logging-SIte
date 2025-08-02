-- Debug promotion issues
-- Run this in Supabase SQL Editor to check if promotions are working

-- 1. Check recent personnel updates
SELECT id, username, rank, category, updated_at 
FROM personnel 
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;

-- 2. Check recent promotion logs
SELECT * FROM promotion_logs 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 3. Check specific personnel by username (replace 'USERNAME' with actual username)
SELECT id, username, rank, category, position, promoted_by, updated_at
FROM personnel 
WHERE username ILIKE '%USERNAME%';

-- 4. Check if there are any personnel with Sergeant rank
SELECT id, username, rank, category 
FROM personnel 
WHERE rank = 'Sergeant'
ORDER BY username;

-- 5. Check if there are any personnel with Feldwebel rank
SELECT id, username, rank, category 
FROM personnel 
WHERE rank = 'Feldwebel'
ORDER BY username;