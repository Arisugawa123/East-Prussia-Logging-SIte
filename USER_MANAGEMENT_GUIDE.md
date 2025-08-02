# User Management System - Complete Guide

## 🎯 Overview
The User Management system now integrates with your actual authentication credentials and provides live management of whitelisted users.

## 🔧 Features Implemented

### 1. **Live Credential Management**
- ✅ Shows your actual email: `ironwolftrojanmotionscape@gmail.com` (marked as OWNER)
- ✅ Displays all authorized users from the backend
- ✅ Real-time synchronization with authentication system
- ✅ Fallback to localStorage when backend is unavailable

### 2. **Owner Protection**
- 🔒 Your email (`ironwolftrojanmotionscape@gmail.com`) is protected as OWNER
- 🔒 Cannot be deleted or deactivated
- 👑 Shows crown icon and OWNER badge
- 🛡️ Full administrative privileges

### 3. **Backend Integration**
- 📡 Connects to `http://localhost:3001/api/auth/users`
- 💾 Saves changes to backend when available
- 🔄 Falls back to localStorage when offline
- 📊 Real-time user statistics

### 4. **User Operations**
- ➕ **Add Users**: Email, rank assignment, status setting
- ✏️ **Edit Users**: Update email, rank, or status
- 🔄 **Toggle Status**: Activate/deactivate users
- 🗑️ **Delete Users**: Remove from whitelist (except owner)

## 🚀 How to Use

### **Start the System:**
1. **Backend Server**: `cd server && npm run dev` (port 3001)
2. **Frontend**: `npm run dev` (port 5173)
3. **Access**: Dashboard → Website Admin → User Management

### **Managing Users:**

#### **Add New User:**
1. Click "Add User" button
2. Enter email address
3. Select rank (HICOM/OFFICER/NCO)
4. Set status (Active/Inactive)
5. Click "Add User"

#### **Edit Existing User:**
1. Click edit icon (pencil) next to user
2. Modify details in popup
3. Click "Update User"

#### **Toggle User Status:**
1. Click play/pause icon
2. Confirms activation/deactivation

#### **Delete User:**
1. Click trash icon
2. Confirm deletion (owner cannot be deleted)

## 📊 User Interface

### **Header Statistics:**
- **Active Users**: Count of currently active users
- **High Command**: Number of HICOM users
- **Officers**: Number of OFFICER users

### **Search & Filter:**
- **Search Box**: Filter by email address
- **Rank Filter**: Show specific ranks only
- **Real-time filtering**: Updates as you type

### **User Table Columns:**
- **Email**: User's email address (crown icon for owner)
- **Rank**: Color-coded rank badges
- **Status**: Active/Inactive status badges
- **Date Added**: When user was added to system
- **Last Login**: Last authentication time
- **Actions**: Edit, toggle status, delete buttons

## 🔐 Current Authorized Users

### **Owner (Protected):**
- `ironwolftrojanmotionscape@gmail.com` - HICOM ⚡

### **High Command:**
- `general@prussianregiment.com` - HICOM
- `colonel@prussianregiment.com` - HICOM
- `commander@prussianregiment.com` - HICOM
- `test@gmail.com` - HICOM
- `admin@gmail.com` - HICOM

### **Officers:**
- `major@prussianregiment.com` - OFFICER
- `captain@prussianregiment.com` - OFFICER
- `lieutenant@prussianregiment.com` - OFFICER
- `officer@prussianregiment.com` - OFFICER

### **NCOs:**
- `sergeant@prussianregiment.com` - NCO
- `corporal@prussianregiment.com` - NCO
- `nco@prussianregiment.com` - NCO

## 🛡️ Security Features

### **Owner Protection:**
- Cannot delete owner account
- Cannot deactivate owner account
- Visual indicators (crown icon, OWNER badge)
- Full administrative access

### **Data Persistence:**
- Primary: Backend server database
- Fallback: Browser localStorage
- Automatic synchronization
- Offline capability

### **Validation:**
- Email format validation
- Rank assignment validation
- Status change confirmation
- Deletion confirmation dialogs

## 🔄 Backend API Endpoints

- `GET /api/auth/users` - Get all users
- `POST /api/auth/users` - Add new user
- `PUT /api/auth/users/:id` - Update user
- `PATCH /api/auth/users/:id/status` - Update status
- `DELETE /api/auth/users/:id` - Delete user

## 📝 Notes

- Changes are saved to both backend and localStorage
- System works offline with localStorage fallback
- Owner account has special protections
- All operations are logged to console
- User feedback via alert messages

The User Management system is now fully integrated with your authentication credentials and provides complete administrative control over user access!