# Google OAuth Setup Instructions

## Error Fix: redirect_uri_mismatch

The error occurs because the redirect URI in Google Cloud Console doesn't match your application's URL.

## Steps to Fix:

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project or create a new one

### 2. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" and enable it
- Also enable "Google Identity" if available

### 3. Configure OAuth Consent Screen
- Go to "APIs & Services" > "OAuth consent screen"
- Choose "External" user type
- Fill in required fields:
  - App name: "Prussian Regiment Staff Portal"
  - User support email: your email
  - Developer contact: your email
- Add scopes: email, profile, openid

### 4. Create/Update OAuth 2.0 Client ID
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client ID"
- Application type: "Web application"
- Name: "Prussian Staff Portal"

### 5. Configure Authorized URLs
Add these URLs to your OAuth client:

**Authorized JavaScript origins:**
- http://localhost:5173 (for development)
- http://localhost:3000 (alternative dev port)
- https://yourdomain.com (for production)

**Authorized redirect URIs:**
- http://localhost:5173 (for development)
- http://localhost:5173/auth/callback
- https://yourdomain.com (for production)
- https://yourdomain.com/auth/callback

### 6. Current Configuration
Your current Client ID: `372631332637-9h00k2e1qf5rklkh298s5j6avf0itnhn.apps.googleusercontent.com`

### 7. Test URLs to Add
Based on your development setup, add these to authorized origins:
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost:3000
- http://127.0.0.1:3000

### 8. Important Notes
- Changes may take 5-10 minutes to propagate
- Make sure to save the configuration
- Test with the exact URL you're using (localhost vs 127.0.0.1)

### 9. Alternative: Use Google Identity Services
If you continue having issues, we can switch to the newer Google Identity Services which has fewer redirect URI requirements.

## Quick Fix Commands
If you're using Vite (which you likely are), your dev server runs on:
- http://localhost:5173

Add this exact URL to both:
1. Authorized JavaScript origins
2. Authorized redirect URIs

## Testing
After updating the Google Cloud Console:
1. Clear browser cache
2. Try the Google Sign-In again
3. Check browser console for any remaining errors