# Supabase Setup Requirements

## 🎯 What You Need to Set Up in Supabase

### 1. **Create the Database Tables**
You MUST run this SQL in your Supabase SQL Editor:

```sql
-- Create authorized_users table
CREATE TABLE IF NOT EXISTS authorized_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    rank VARCHAR(50) NOT NULL CHECK (rank IN ('HICOM', 'OFFICER', 'NCO')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    is_owner BOOLEAN DEFAULT FALSE,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert your email as owner
INSERT INTO authorized_users (email, rank, status, is_owner, date_added) VALUES
('ironwolftrojanmotionscape@gmail.com', 'HICOM', 'Active', TRUE, NOW());

-- Insert other users
INSERT INTO authorized_users (email, rank, status, is_owner, date_added) VALUES
('general@prussianregiment.com', 'HICOM', 'Active', FALSE, NOW()),
('colonel@prussianregiment.com', 'HICOM', 'Active', FALSE, NOW()),
('commander@prussianregiment.com', 'HICOM', 'Active', FALSE, NOW()),
('major@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),
('captain@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),
('lieutenant@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),
('officer@prussianregiment.com', 'OFFICER', 'Active', FALSE, NOW()),
('sergeant@prussianregiment.com', 'NCO', 'Active', FALSE, NOW()),
('corporal@prussianregiment.com', 'NCO', 'Active', FALSE, NOW()),
('nco@prussianregiment.com', 'NCO', 'Active', FALSE, NOW()),
('test@gmail.com', 'HICOM', 'Active', FALSE, NOW()),
('admin@gmail.com', 'HICOM', 'Active', FALSE, NOW());
```

### 2. **Verify Your Supabase Connection**
- **URL**: https://duqpkttgmldgteeuuwbd.supabase.co
- **Service Role Key**: Must be valid and have database access

### 3. **Check Network Connectivity**
Your system must be able to reach:
- `duqpkttgmldgteeuuwbd.supabase.co`

### 4. **Required Environment Variables**
In `server/.env`:
```
SUPABASE_URL=https://duqpkttgmldgteeuuwbd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚨 Critical Steps:

1. **Go to**: https://duqpkttgmldgteeuuwbd.supabase.co
2. **Click**: "SQL Editor" 
3. **Paste**: The SQL above
4. **Click**: "Run"
5. **Verify**: Go to "Table Editor" → "authorized_users" → Check your email is there

## 🔍 What the Server Needs:

The server will ONLY work if:
- ✅ `authorized_users` table exists
- ✅ Your email `ironwolftrojanmotionscape@gmail.com` is in the table
- ✅ Network can reach Supabase
- ✅ Service role key has proper permissions

**No fallbacks, no workarounds - fix the database setup!**