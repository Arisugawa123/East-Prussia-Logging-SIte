# Node.js Installation Guide

## 🚨 Node.js Not Found

Your system doesn't have Node.js installed or it's not in your PATH.

## 🔧 Quick Fix Options:

### Option 1: Install Node.js (Recommended)
1. **Download Node.js**: https://nodejs.org/en/download/
2. **Choose**: "Windows Installer (.msi)" for 64-bit
3. **Install**: Follow the installer (it will add Node.js to PATH automatically)
4. **Restart**: Your command prompt/PowerShell
5. **Test**: Run `node --version` to verify

### Option 2: Use npm if Available
Try these commands to see if npm works:
```powershell
npm --version
npx --version
```

If npm works, you can run:
```powershell
cd server
npx node auth.js
```

### Option 3: Check if Node.js is Installed Elsewhere
```powershell
# Check common installation paths
C:\Program Files\nodejs\node.exe --version
C:\Program Files (x86)\nodejs\node.exe --version

# If found, add to PATH or use full path:
cd server
"C:\Program Files\nodejs\node.exe" auth.js
```

## 🎯 After Installing Node.js:

1. **Restart PowerShell**
2. **Navigate to server folder**:
   ```powershell
   cd server
   ```
3. **Install dependencies**:
   ```powershell
   npm install
   ```
4. **Start server**:
   ```powershell
   node auth.js
   ```

## ✅ Expected Output After Fix:
```
🔗 Supabase connection: Configured
✅ Loaded users from Supabase: 13
🚀 Auth server running on http://localhost:3001
```

## 🔄 Alternative: Use Online IDE
If you can't install Node.js locally, you can:
1. Use GitHub Codespaces
2. Use Replit
3. Use CodeSandbox

These provide Node.js environments in the browser.