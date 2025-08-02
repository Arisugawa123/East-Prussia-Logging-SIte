# Quick Setup Instructions

## 🚀 Step-by-Step Setup

### 1. Setup Supabase Database
1. Go to your Supabase project: https://duqpkttgmldgteeuuwbd.supabase.co
2. Go to SQL Editor
3. Copy and paste the entire content from `database/user_management_schema.sql`
4. Click "Run" to create tables and insert your data

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Start Backend Server
```bash
cd server
npm run dev
```

**Look for these startup messages:**
```
✅ Loaded users from Supabase: 13
🔗 Supabase connection: Configured
🚀 Auth server running on http://localhost:3001
```

### 4. Test Authentication
1. Start frontend: `npm run dev`
2. Try Google Sign-In with: `ironwolftrojanmotionscape@gmail.com`
3. Check console for debug messages

## 🔧 If Still Getting "Access Denied"

### Quick Debug Steps:

1. **Check Backend Logs:**
   - Look for "✅ Loaded users from Supabase: X"
   - If you see "❌ Error loading users from Supabase", the database isn't set up

2. **Test Backend Directly:**
   ```bash
   curl http://localhost:3001/api/auth/users
   ```
   Should return your user list

3. **Manual Database Check:**
   - Go to Supabase → Table Editor
   - Check if `authorized_users` table exists
   - Verify your email is in the table

4. **Fallback Test:**
   - Use "Low Rank Access Code": `KONIGSBERG`
   - This should work regardless of Google OAuth

## 🗄️ Database Schema Status

After running the SQL, you should have:
- ✅ `authorized_users` table with your email
- ✅ `login_sessions` table for tracking
- ✅ `user_activity_logs` table for audit

## 🔍 Debug Commands

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check users endpoint
curl http://localhost:3001/api/auth/users

# Check Supabase connection in backend logs
cd server && npm run dev
```

## 📧 Your Email Status

Your email `ironwolftrojanmotionscape@gmail.com` should be:
- ✅ In the `authorized_users` table
- ✅ Marked as `is_owner: true`
- ✅ Rank: `HICOM`
- ✅ Status: `Active`

If authentication still fails, the issue is likely:
1. Database not set up (run the SQL schema)
2. Backend not connecting to Supabase
3. Backend server not running on port 3001