// Backend Authentication Server (Express.js)
// This file provides secure OAuth handling for your Vite frontend

const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔗 Supabase connection:', process.env.SUPABASE_URL ? 'Configured' : 'Missing URL');

// Authorized emails and ranks (hardcoded for reliability)
const allowedEmails = [
  'ironwolftrojanmotionscape@gmail.com',
  'test@gmail.com',
  'admin@gmail.com',
  'general@prussianregiment.com',
  'colonel@prussianregiment.com',
  'commander@prussianregiment.com',
  'major@prussianregiment.com',
  'captain@prussianregiment.com',
  'lieutenant@prussianregiment.com',
  'officer@prussianregiment.com',
  'sergeant@prussianregiment.com',
  'corporal@prussianregiment.com',
  'nco@prussianregiment.com'
];

const rankMapping = {
  'ironwolftrojanmotionscape@gmail.com': 'HICOM',
  'test@gmail.com': 'HICOM',
  'admin@gmail.com': 'HICOM',
  'general@prussianregiment.com': 'HICOM',
  'colonel@prussianregiment.com': 'HICOM',
  'commander@prussianregiment.com': 'HICOM',
  'major@prussianregiment.com': 'OFFICER',
  'captain@prussianregiment.com': 'OFFICER',
  'lieutenant@prussianregiment.com': 'OFFICER',
  'officer@prussianregiment.com': 'OFFICER',
  'sergeant@prussianregiment.com': 'NCO',
  'corporal@prussianregiment.com': 'NCO',
  'nco@prussianregiment.com': 'NCO'
};

function loadAuthorizedUsers() {
  console.log('✅ Authorized users loaded:', allowedEmails.length);
  console.log('📧 Your email found:', allowedEmails.includes('ironwolftrojanmotionscape@gmail.com'));
  console.log('📋 Your email:', 'ironwolftrojanmotionscape@gmail.com');
}

// Load users on startup
loadAuthorizedUsers();

// Helper function to log user activity
async function logUserActivity(adminEmail, action, targetEmail, oldValues, newValues, details) {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        admin_email: adminEmail,
        action: action,
        target_email: targetEmail,
        old_values: oldValues,
        new_values: newValues,
        details: details
      });

    if (error) {
      console.error('❌ Error logging activity:', error);
    }
  } catch (error) {
    console.error('❌ Failed to log activity:', error);
  }
}

// Helper function to update last login
async function updateLastLogin(email) {
  try {
    const { error } = await supabase
      .from('authorized_users')
      .update({ last_login: new Date().toISOString() })
      .eq('email', email);

    if (error) {
      console.error('❌ Error updating last login:', error);
    }
  } catch (error) {
    console.error('❌ Failed to update last login:', error);
  }
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Verify Google ID Token
async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    return {
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        verified: payload.email_verified
      }
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { success: false, error: 'Invalid token' };
  }
}

// Authentication endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Google ID token
    const verification = await verifyGoogleToken(idToken);
    
    if (!verification.success) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const { user } = verification;
    
    // Check if email is in allowed list
    console.log(`🔍 Checking email: ${user.email}`);
    console.log(`📋 Allowed emails:`, allowedEmails);
    console.log(`✅ Email authorized:`, allowedEmails.includes(user.email));
    
    if (!allowedEmails.includes(user.email)) {
      console.log(`❌ Access denied for: ${user.email}`);
      return res.status(403).json({ 
        error: `Access denied. Your email "${user.email}" is not authorized for staff access.`,
        email: user.email,
        allowedEmails: allowedEmails // Debug info
      });
    }
    
    console.log(`✅ Access granted for: ${user.email}`);

    // Update last login time
    await updateLastLogin(user.email);

    // Get user rank
    const rank = rankMapping[user.email] || 'OFFICER';
    
    // Create session data
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        rank: rank,
        accessLevel: rank
      },
      loginTime: new Date().toISOString(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      authMethod: 'google_oauth'
    };

    res.json({
      success: true,
      session: sessionData,
      message: `Welcome ${user.name}! Authenticated as ${rank}.`
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user info endpoint
app.get('/api/auth/user', (req, res) => {
  // This would typically check a session or JWT token
  // For now, return basic info
  res.json({ message: 'User info endpoint' });
});

// User Management Endpoints

// Get all users
app.get('/api/auth/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('authorized_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Format data for frontend
    const users = data.map(user => ({
      id: user.id,
      email: user.email,
      rank: user.rank,
      status: user.status,
      dateAdded: user.date_added?.split('T')[0] || 'Unknown',
      lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
      isOwner: user.is_owner
    }));

    res.json({
      success: true,
      users: users,
      total: users.length
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Add new user
app.post('/api/auth/users', async (req, res) => {
  const { email, rank, status } = req.body;
  
  if (!email || !rank) {
    return res.status(400).json({ error: 'Email and rank are required' });
  }

  try {
    // Insert new user
    const { data, error } = await supabase
      .from('authorized_users')
      .insert({
        email: email,
        rank: rank,
        status: status || 'Active'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding user:', error);
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await logUserActivity('system', 'ADD_USER', email, null, { email, rank, status }, `Added new user with rank ${rank}`);

    // Reload authorized users
    await loadAuthorizedUsers();

    console.log(`✅ User added: ${email} with rank: ${rank}`);
    
    res.json({
      success: true,
      message: `User ${email} added successfully`,
      user: data
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Update user
app.put('/api/auth/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, rank, status } = req.body;
  
  try {
    // Get current user data for logging
    const { data: currentUser } = await supabase
      .from('authorized_users')
      .select('*')
      .eq('id', id)
      .single();

    // Update user
    const { data, error } = await supabase
      .from('authorized_users')
      .update({
        email: email,
        rank: rank,
        status: status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating user:', error);
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await logUserActivity('system', 'UPDATE_USER', email, currentUser, { email, rank, status }, `Updated user information`);

    // Reload authorized users
    await loadAuthorizedUsers();

    console.log(`✅ User updated: ${email}`);
    
    res.json({
      success: true,
      message: `User ${email} updated successfully`,
      user: data
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Update user status
app.patch('/api/auth/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    // Get current user data
    const { data: currentUser } = await supabase
      .from('authorized_users')
      .select('*')
      .eq('id', id)
      .single();

    if (currentUser?.is_owner && status === 'Inactive') {
      return res.status(403).json({ error: 'Cannot deactivate owner account' });
    }

    // Update status
    const { data, error } = await supabase
      .from('authorized_users')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating status:', error);
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await logUserActivity('system', 'UPDATE_STATUS', currentUser.email, { status: currentUser.status }, { status }, `Changed status to ${status}`);

    // Reload authorized users
    await loadAuthorizedUsers();

    console.log(`✅ User status updated: ${currentUser.email} -> ${status}`);
    
    res.json({
      success: true,
      message: `User status updated to ${status}`,
      user: data
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete user
app.delete('/api/auth/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get user data before deletion
    const { data: userToDelete } = await supabase
      .from('authorized_users')
      .select('*')
      .eq('id', id)
      .single();

    if (userToDelete?.is_owner) {
      return res.status(403).json({ error: 'Cannot delete owner account' });
    }

    // Delete user
    const { error } = await supabase
      .from('authorized_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting user:', error);
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await logUserActivity('system', 'DELETE_USER', userToDelete.email, userToDelete, null, `Deleted user account`);

    // Reload authorized users
    await loadAuthorizedUsers();

    console.log(`✅ User deleted: ${userToDelete.email}`);
    
    res.json({
      success: true,
      message: `User ${userToDelete.email} deleted successfully`
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Auth server running on http://localhost:${port}`);
  console.log(`📧 Allowed emails: ${allowedEmails.length} configured`);
  console.log(`🔑 Google Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Missing'}`);
});

module.exports = app;